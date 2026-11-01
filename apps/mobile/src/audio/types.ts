export interface PitchSample {
  frequencyHz: number;
  noteName: string;
  cents: number;
  confidence: number;
  timestampMs: number;
}

export interface TunerSessionOptions {
  instrumentId: string;
  tuningConfigurationId?: string;
  a4ReferenceHz?: number;
}
