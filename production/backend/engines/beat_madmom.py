"""
Kythra Engine: Beat & Downbeat Tracking (madmom RNNDownBeat)
Optimized with Multi-Core Thread Pool (num_threads=8) for Parallel CPU+GPU DAG Execution.
"""

import os
import time
import logging
import numpy as np
from madmom.features.downbeats import RNNDownBeatProcessor, DBNDownBeatTrackingProcessor

from backend.engines.base import PipelineContext
from backend.models import BeatEvent

logger = logging.getLogger("backend.beat")


class BeatMadmomEngine:
    name: str = "madmom RNNDownBeat"
    version: str = "0.16.1-multicore"

    def __init__(self):
        self.proc = None
        self.dbn = None
        self.num_threads = min(8, os.cpu_count() or 4)

    def load(self) -> None:
        if self.proc is None:
            self.proc = RNNDownBeatProcessor(num_threads=self.num_threads)
            self.dbn = DBNDownBeatTrackingProcessor(beats_per_bar=[3, 4], fps=100)

    def run(self, ctx: PipelineContext) -> None:
        t0 = time.time()
        audio_file = ctx.audio_path
        logger.info("Tracking beats and downbeats (%d CPU threads) on: %s", self.num_threads, audio_file)

        beats: list[BeatEvent] = []
        tempo_bpm = 120.0
        time_sig = "4/4"

        try:
            self.load()
            act = self.proc(str(audio_file))
            downbeats_res = self.dbn(act)

            if len(downbeats_res) > 0:
                bar_idx = 0
                for row in downbeats_res:
                    t_sec = float(row[0])
                    b_num = int(row[1])
                    if b_num == 1 and len(beats) > 0:
                        bar_idx += 1

                    beats.append(BeatEvent(
                        time_sec=t_sec,
                        beat_number=b_num,
                        is_downbeat=(b_num == 1),
                        bar_index=bar_idx
                    ))

                max_beat = max(b.beat_number for b in beats) if beats else 4
                time_sig = "3/4" if max_beat == 3 else "4/4"

                beat_times = [b.time_sec for b in beats]
                if len(beat_times) > 1:
                    diffs = np.diff(beat_times)
                    median_diff = float(np.median(diffs))
                    if median_diff > 0:
                        tempo_bpm = round(60.0 / median_diff, 1)

        except Exception as e:
            logger.warning("madmom beat tracking failed (%s). Falling back to librosa...", e)
            ctx.warnings.append(f"madmom beat tracking error: {str(e)}")
            try:
                import librosa
                y, sr = librosa.load(str(audio_file), sr=22050, mono=True)
                tempo, beat_frames = librosa.beat.beat_track(y=y, sr=sr)
                beat_times = librosa.frames_to_time(beat_frames, sr=sr)
                tempo_bpm = float(np.round(float(tempo), 1)) if float(tempo) > 0 else 120.0
                bar_idx = 0
                for i, t_sec in enumerate(beat_times):
                    b_num = (i % 4) + 1
                    if b_num == 1 and i > 0:
                        bar_idx += 1
                    beats.append(BeatEvent(
                        time_sec=float(t_sec),
                        beat_number=b_num,
                        is_downbeat=(b_num == 1),
                        bar_index=bar_idx
                    ))
            except Exception as e2:
                logger.error("librosa fallback failed: %s", e2)
                ctx.warnings.append(f"librosa beat tracking error: {str(e2)}")

        ctx.beats = beats
        ctx.tempo_bpm = tempo_bpm
        ctx.time_signature = time_sig
        ctx.timings_ms["beat"] = (time.time() - t0) * 1000
        logger.info("Beat tracking finished: %d beats, %.1f BPM, %s in %.1f ms", len(beats), tempo_bpm, time_sig, ctx.timings_ms["beat"])
