import { PitchSample, TunerSessionOptions } from './types';

/**
 * Phase 1 placeholder interface.
 * Native DSP implementation arrives in Phase 4.
 */
export interface TunerController {
  startTuning(options: TunerSessionOptions): Promise<void>;
  onPitchSample(listener: (sample: PitchSample) => void): () => void;
  stopTuning(): Promise<void>;
}
