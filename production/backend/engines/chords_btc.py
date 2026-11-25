"""
Kythra Engine: Automatic Chord Recognition (BTC-Transformer)
Optimized with Decoupled CPU CQT Feature Extraction & Vectorized Batched GPU Forward Pass.
"""

from pathlib import Path
import sys
import time
import logging
import numpy as np
import torch

from backend.config import BTC_DIR, BTC_CKPT, BTC_CONFIG, DEVICE
from backend.engines.base import PipelineContext
from backend.models import ChordEvent

logger = logging.getLogger("backend.chords")


class ChordsBtcEngine:
    name: str = "BTC-Transformer"
    version: str = "large_voca_batched"

    def __init__(self):
        self.model = None
        self.config = None
        self.mean = None
        self.std = None
        self.idx_to_chord = None
        self.is_loaded = False

    def load(self) -> None:
        if self.is_loaded:
            return
        logger.info("Loading BTC-Transformer model...")
        if str(BTC_DIR) not in sys.path:
            sys.path.insert(0, str(BTC_DIR))

        from btc_model import BTC_model
        from btc_utils.mir_eval_modules import idx2voca_chord
        from btc_utils.hparams import HParams

        self.config = HParams.load(str(BTC_CONFIG))
        self.config.feature['large_voca'] = True
        self.config.model['num_chords'] = 170
        self.idx_to_chord = idx2voca_chord()

        self.model = BTC_model(config=self.config.model).to(DEVICE)
        checkpoint = torch.load(str(BTC_CKPT), map_location=DEVICE, weights_only=False)
        self.mean = checkpoint['mean']
        self.std = checkpoint['std']
        self.model.load_state_dict(checkpoint['model'])
        self.model.eval()
        self.is_loaded = True
        logger.info("BTC-Transformer model loaded onto %s", DEVICE)

    def extract_features(self, audio_path: Path) -> tuple[np.ndarray, float, int, int]:
        """
        CPU-bound CQT feature extraction. Can run in parallel on CPU threads
        while the GPU is busy running Stage 3 BS-RoFormer source separation.
        """
        self.load()
        if str(BTC_DIR) not in sys.path:
            sys.path.insert(0, str(BTC_DIR))
        from btc_utils.mir_eval_modules import audio_file_to_features

        feature, feature_per_second, _ = audio_file_to_features(str(audio_path), self.config)
        feature = feature.T
        feature = (feature - self.mean) / self.std
        time_unit = float(feature_per_second)
        n_timestep = int(self.config.model['timestep'])

        orig_frames = feature.shape[0]
        rem = orig_frames % n_timestep
        num_pad = (n_timestep - rem) if rem != 0 else 0
        if num_pad > 0:
            feature = np.pad(feature, ((0, num_pad), (0, 0)), mode='constant', constant_values=0)

        return feature, time_unit, n_timestep, orig_frames

    def infer_from_features(
        self,
        feature: np.ndarray,
        time_unit: float,
        n_timestep: int,
        orig_frames: int
    ) -> list[ChordEvent]:
        """
        Single Batched GPU Forward Pass + Vectorized NumPy Run-Length Decoding.
        Eliminates thousands of per-frame .item() CUDA synchronization stalls.
        """
        self.load()
        num_instance = feature.shape[0] // n_timestep
        if num_instance <= 0:
            return []

        batched = feature.reshape(num_instance, n_timestep, feature.shape[1])

        with torch.inference_mode():
            feature_tensor = torch.as_tensor(batched, dtype=torch.float32, device=DEVICE)
            self_attn_output, _ = self.model.self_attn_layers(feature_tensor)
            prediction, _ = self.model.output_layer(self_attn_output)
            pred_flat = prediction.view(-1).detach().cpu().numpy()[:orig_frames]

        if len(pred_flat) == 0:
            return []

        # Vectorized transition boundary detection in NumPy
        change_indices = np.flatnonzero(pred_flat[1:] != pred_flat[:-1]) + 1
        boundaries = np.concatenate(([0], change_indices, [len(pred_flat)]))

        chords: list[ChordEvent] = []
        for idx in range(len(boundaries) - 1):
            s_frame = int(boundaries[idx])
            e_frame = int(boundaries[idx + 1])
            chord_idx = int(pred_flat[s_frame])
            lbl = self.idx_to_chord[chord_idx]
            if lbl != "N" and e_frame > s_frame:
                chords.append(
                    ChordEvent(
                        start_sec=float(round(s_frame * time_unit, 3)),
                        end_sec=float(round(e_frame * time_unit, 3)),
                        chord=lbl,
                    )
                )
        return chords

    def run(self, ctx: PipelineContext) -> None:
        t0 = time.time()
        audio_file = ctx.audio_path
        logger.info("Recognizing chords (Batched BTC) on: %s", audio_file)

        chords: list[ChordEvent] = []
        try:
            feature, time_unit, n_timestep, orig_frames = self.extract_features(audio_file)
            chords = self.infer_from_features(feature, time_unit, n_timestep, orig_frames)
        except Exception as e:
            logger.warning("BTC chord recognition failed (%s). Continuing without chords...", e)
            ctx.warnings.append(f"BTC chord error: {str(e)}")

        ctx.chords = chords
        ctx.timings_ms["chords"] = (time.time() - t0) * 1000
        logger.info("Chords recognized: %d chord segments in %.2f ms", len(chords), ctx.timings_ms["chords"])
