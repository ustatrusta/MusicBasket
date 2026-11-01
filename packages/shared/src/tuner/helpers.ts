import { NoteName, PitchPoint, PitchReference } from './types';

const NOTE_TO_SEMITONE: Record<NoteName, number> = {
  C: 0,
  'C#': 1,
  Db: 1,
  D: 2,
  'D#': 3,
  Eb: 3,
  E: 4,
  Fb: 4,
  'E#': 5,
  F: 5,
  'F#': 6,
  Gb: 6,
  G: 7,
  'G#': 8,
  Ab: 8,
  A: 9,
  'A#': 10,
  Bb: 10,
  B: 11,
  Cb: 11
};

const MIDI_TO_NOTE_SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;

export function noteToMidi(note: NoteName, octave: number): number {
  return (octave + 1) * 12 + NOTE_TO_SEMITONE[note];
}

export function midiToNote(midi: number): PitchPoint {
  const normalized = Math.round(midi);
  const semitone = ((normalized % 12) + 12) % 12;
  const octave = Math.floor(normalized / 12) - 1;
  const note = MIDI_TO_NOTE_SHARP[semitone] as NoteName;
  return { note, octave };
}

export function midiToHz(midi: number, reference: PitchReference = { a4Hz: 440 }): number {
  return reference.a4Hz * Math.pow(2, (midi - 69) / 12);
}

export function hzToMidi(hz: number, reference: PitchReference = { a4Hz: 440 }): number {
  return 69 + 12 * Math.log2(hz / reference.a4Hz);
}

export function noteToHz(note: NoteName, octave: number, reference: PitchReference = { a4Hz: 440 }): number {
  const midi = noteToMidi(note, octave);
  return midiToHz(midi, reference);
}

export function hzToClosestPitch(hz: number, reference: PitchReference = { a4Hz: 440 }): PitchPoint & { midi: number; cents: number } {
  const midiFloat = hzToMidi(hz, reference);
  const midi = Math.round(midiFloat);
  const cents = Math.round((midiFloat - midi) * 100);
  const { note, octave } = midiToNote(midi);
  return { note, octave, midi, cents };
}
