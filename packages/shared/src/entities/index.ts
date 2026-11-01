import { ContentStatus, LicenseType, UserRole } from '../enums';

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: string;
}

export interface MusicGenre {
  id: string;
  name: string;
  slug: string;
  code: string;
  isActive: boolean;
}

export interface ContentLicense {
  id: string;
  type: LicenseType;
  ownerName: string | null;
  termsUrl: string | null;
  expiresAt: string | null;
}

export interface Song {
  id: string;
  title: string;
  slug: string;
  genreId: string;
  status: ContentStatus;
  isVerified: boolean;
  licenseId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SongLyrics {
  id: string;
  songId: string;
  versionName: string;
  language: string;
  content: string;
  isPrimary: boolean;
}

export interface SongStory {
  id: string;
  songId: string;
  content: string;
  verifiedFacts: string | null;
}

export interface Region {
  id: string;
  name: string;
  code: string;
  countryCode: string;
}

export interface Province {
  id: string;
  regionId: string;
  name: string;
  plateCode: string | null;
}

export interface District {
  id: string;
  provinceId: string;
  name: string;
}

export interface Instrument {
  id: string;
  name: string;
  slug: string;
}

export interface InstrumentType {
  id: string;
  instrumentId: string;
  name: string;
  slug: string;
}

export interface TuningSystem {
  id: string;
  instrumentId: string;
  name: string;
  slug: string;
  referenceSource: string;
  isVerified: boolean;
}

export interface TuningConfiguration {
  id: string;
  tuningSystemId: string;
  instrumentTypeId: string;
  name: string;
  referenceSource: string;
  isVerified: boolean;
}

export interface TuningString {
  id: string;
  configurationId: string;
  orderIndex: number;
  noteName: string;
  octave: number;
}

export interface Rhythm {
  id: string;
  name: string;
  slug: string;
  timeSignature: string | null;
}
