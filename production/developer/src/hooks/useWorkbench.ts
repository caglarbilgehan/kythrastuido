import { useRef } from 'react';
import { DEFAULT_STAGES } from '../constants/stages';
import { useAudioMixer } from './useAudioMixer';
import { useSessionPipeline } from './useSessionPipeline';

export { DEFAULT_STAGES };

export function useWorkbench() {
  const stopAudioRef = useRef<(() => void) | null>(null);

      const pipeline = useSessionPipeline(() => stopAudioRef.current?.());
      const audio = useAudioMixer({
        session: pipeline.session,
        stage3Output: pipeline.stageOutputs[3]
      });
      stopAudioRef.current = audio.stopAndResetAudio;

      return {
    ...pipeline,
        ...audio
      };
    }
