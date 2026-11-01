export type NoteName =
  | 'C' | 'C#' | 'Db'
  | 'D' | 'D#' | 'Eb'
  | 'E' | 'Fb'
  | 'F' | 'E#' | 'F#' | 'Gb'
  | 'G' | 'G#' | 'Ab'
  | 'A' | 'A#' | 'Bb'
  | 'B' | 'Cb';

export interface PitchReference {
  a4Hz: number;
}

export interface PitchPoint {
  note: NoteName;
  octave: number;
}
