-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('GUEST', 'USER', 'EDITOR', 'REVIEWER', 'ADMIN');

-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('DRAFT', 'REVIEW', 'APPROVED', 'PUBLISHED', 'REJECTED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "LicenseType" AS ENUM ('PUBLIC_DOMAIN', 'LICENSED', 'USER_SUBMITTED', 'CREATIVE_COMMONS', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('SONG_VIEW', 'SONG_SEARCH', 'SONG_FAVORITE_ADD', 'SONG_FAVORITE_REMOVE', 'SONG_SHARE', 'TUNER_OPEN');

-- CreateEnum
CREATE TYPE "SourceType" AS ENUM ('COMPILER', 'SOURCE_PERSON', 'ARCHIVE', 'PUBLICATION', 'OTHER');

-- CreateEnum
CREATE TYPE "SongVerseType" AS ENUM ('VERSE', 'CHORUS', 'BRIDGE');

-- CreateEnum
CREATE TYPE "NotationFormat" AS ENUM ('IMAGE', 'PDF', 'MUSICXML', 'MIDI');

-- CreateEnum
CREATE TYPE "ChordFormat" AS ENUM ('CHORDPRO', 'PLAIN_TEXT', 'JSON');

-- CreateEnum
CREATE TYPE "VideoType" AS ENUM ('VIDEO', 'SOLFEGE');

-- CreateEnum
CREATE TYPE "SubscriptionTier" AS ENUM ('FREE', 'PREMIUM', 'FAMILY');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "passwordHash" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "googleProviderId" TEXT,
    "appleProviderId" TEXT,
    "phone" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MusicGenre" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MusicGenre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentLicense" (
    "id" TEXT NOT NULL,
    "type" "LicenseType" NOT NULL,
    "ownerName" TEXT,
    "termsUrl" TEXT,
    "expiresAt" TIMESTAMP(3),
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentLicense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Song" (
    "id" TEXT NOT NULL,
    "genreId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "searchKey" TEXT NOT NULL,
    "category" TEXT,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "licenseId" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Song_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SongAlias" (
    "id" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    "alias" TEXT NOT NULL,
    "note" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SongAlias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SongLyrics" (
    "id" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    "versionName" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "source" TEXT,
    "copyrightNote" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SongLyrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SongVerse" (
    "id" TEXT NOT NULL,
    "lyricsId" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "type" "SongVerseType" NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SongVerse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SongMetadata" (
    "id" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    "rhythmId" TEXT,
    "timeSignature" TEXT,
    "makam" TEXT,
    "scale" TEXT,
    "tempo" INTEGER,
    "rawJson" JSONB,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SongMetadata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SongRegion" (
    "id" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    "regionId" TEXT NOT NULL,
    "provinceId" TEXT,
    "districtId" TEXT,
    "confidence" DOUBLE PRECISION,
    "disputed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SongRegion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SongStory" (
    "id" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "verifiedFacts" TEXT,
    "oralTradition" TEXT,
    "sourcesJson" JSONB,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SongStory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SongSource" (
    "id" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    "type" "SourceType" NOT NULL,
    "name" TEXT NOT NULL,
    "detail" TEXT,
    "url" TEXT,
    "licenseId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SongSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SongNotation" (
    "id" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    "format" "NotationFormat" NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "resolution" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SongNotation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SongChord" (
    "id" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    "lyricsId" TEXT,
    "chordSeqJson" JSONB NOT NULL,
    "format" "ChordFormat" NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SongChord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SongTab" (
    "id" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    "instrumentId" TEXT NOT NULL,
    "tabText" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SongTab_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Artist" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bio" TEXT,
    "birthYear" INTEGER,
    "regionId" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Artist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Composer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bio" TEXT,
    "birthYear" INTEGER,
    "regionId" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Composer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SongArtist" (
    "id" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "role" TEXT,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "SongArtist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SongComposer" (
    "id" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    "composerId" TEXT NOT NULL,
    "role" TEXT,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "SongComposer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Region" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL DEFAULT 'TR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Region_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Province" (
    "id" TEXT NOT NULL,
    "regionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "plateCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Province_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "District" (
    "id" TEXT NOT NULL,
    "provinceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "District_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Instrument" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Instrument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstrumentType" (
    "id" TEXT NOT NULL,
    "instrumentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InstrumentType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TuningSystem" (
    "id" TEXT NOT NULL,
    "instrumentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "referenceSource" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TuningSystem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TuningConfiguration" (
    "id" TEXT NOT NULL,
    "instrumentTypeId" TEXT NOT NULL,
    "tuningSystemId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "stringCount" INTEGER NOT NULL,
    "stringGroupsJson" JSONB,
    "referenceNote" TEXT,
    "referenceOctave" INTEGER,
    "referenceFrequencyHz" DOUBLE PRECISION,
    "alternativeTunings" JSONB,
    "regionalVariation" TEXT,
    "referenceSource" TEXT NOT NULL,
    "isOfficial" BOOLEAN NOT NULL DEFAULT false,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TuningConfiguration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TuningString" (
    "id" TEXT NOT NULL,
    "configurationId" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "groupName" TEXT NOT NULL,
    "courseIndex" INTEGER NOT NULL,
    "targetNote" TEXT NOT NULL,
    "targetOctave" INTEGER NOT NULL,
    "targetFrequencyHz" DOUBLE PRECISION,
    "isOpenString" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "TuningString_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rhythm" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "timeSignature" TEXT,
    "subdivisions" TEXT,
    "accentPattern" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Rhythm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VideoProvider" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "VideoProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SongVideoSearch" (
    "id" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "queryText" TEXT NOT NULL,
    "type" "VideoType" NOT NULL,
    "resultsJson" JSONB,
    "cachedUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SongVideoSearch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentChangeLog" (
    "id" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "beforeJson" JSONB,
    "afterJson" JSONB,
    "actorUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContentChangeLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserFavorite" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserFavorite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserCollection" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "coverArtUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserCollection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollectionItem" (
    "id" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CollectionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserActivityEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "songId" TEXT,
    "sessionId" TEXT,
    "eventType" "EventType" NOT NULL,
    "deviceInfo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserActivityEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPreference" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "theme" TEXT NOT NULL DEFAULT 'system',
    "language" TEXT NOT NULL DEFAULT 'tr',
    "fontScale" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "contentFiltersJson" JSONB,

    CONSTRAINT "UserPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserTuningPreset" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "baseConfigurationId" TEXT,
    "name" TEXT NOT NULL,
    "referenceFrequencyHz" DOUBLE PRECISION NOT NULL DEFAULT 440,
    "stringOverrides" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserTuningPreset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recording" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "songId" TEXT,
    "instrumentId" TEXT,
    "fileName" TEXT NOT NULL,
    "durationSec" INTEGER NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "cloudBackedUp" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Recording_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriptionPlan" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tier" "SubscriptionTier" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "metadataJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubscriptionPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrendingScore" (
    "id" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "rankSnapshot" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrendingScore_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_googleProviderId_key" ON "User"("googleProviderId");

-- CreateIndex
CREATE UNIQUE INDEX "User_appleProviderId_key" ON "User"("appleProviderId");

-- CreateIndex
CREATE INDEX "RefreshToken_userId_idx" ON "RefreshToken"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "MusicGenre_slug_key" ON "MusicGenre"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "MusicGenre_code_key" ON "MusicGenre"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Song_slug_key" ON "Song"("slug");

-- CreateIndex
CREATE INDEX "Song_genreId_idx" ON "Song"("genreId");

-- CreateIndex
CREATE INDEX "Song_status_idx" ON "Song"("status");

-- CreateIndex
CREATE INDEX "Song_searchKey_idx" ON "Song"("searchKey");

-- CreateIndex
CREATE INDEX "SongAlias_songId_idx" ON "SongAlias"("songId");

-- CreateIndex
CREATE INDEX "SongLyrics_songId_idx" ON "SongLyrics"("songId");

-- CreateIndex
CREATE INDEX "SongVerse_lyricsId_orderIndex_idx" ON "SongVerse"("lyricsId", "orderIndex");

-- CreateIndex
CREATE INDEX "SongMetadata_songId_idx" ON "SongMetadata"("songId");

-- CreateIndex
CREATE INDEX "SongRegion_songId_idx" ON "SongRegion"("songId");

-- CreateIndex
CREATE INDEX "SongRegion_regionId_idx" ON "SongRegion"("regionId");

-- CreateIndex
CREATE INDEX "SongStory_songId_idx" ON "SongStory"("songId");

-- CreateIndex
CREATE INDEX "SongSource_songId_idx" ON "SongSource"("songId");

-- CreateIndex
CREATE INDEX "SongNotation_songId_idx" ON "SongNotation"("songId");

-- CreateIndex
CREATE INDEX "SongChord_songId_idx" ON "SongChord"("songId");

-- CreateIndex
CREATE INDEX "SongTab_songId_idx" ON "SongTab"("songId");

-- CreateIndex
CREATE UNIQUE INDEX "SongArtist_songId_artistId_key" ON "SongArtist"("songId", "artistId");

-- CreateIndex
CREATE UNIQUE INDEX "SongComposer_songId_composerId_key" ON "SongComposer"("songId", "composerId");

-- CreateIndex
CREATE UNIQUE INDEX "Region_code_key" ON "Region"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Province_regionId_name_key" ON "Province"("regionId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "District_provinceId_name_key" ON "District"("provinceId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Instrument_slug_key" ON "Instrument"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "InstrumentType_instrumentId_slug_key" ON "InstrumentType"("instrumentId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "TuningSystem_instrumentId_slug_key" ON "TuningSystem"("instrumentId", "slug");

-- CreateIndex
CREATE INDEX "TuningConfiguration_tuningSystemId_idx" ON "TuningConfiguration"("tuningSystemId");

-- CreateIndex
CREATE UNIQUE INDEX "TuningConfiguration_instrumentTypeId_name_key" ON "TuningConfiguration"("instrumentTypeId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "TuningString_configurationId_orderIndex_key" ON "TuningString"("configurationId", "orderIndex");

-- CreateIndex
CREATE UNIQUE INDEX "Rhythm_slug_key" ON "Rhythm"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "VideoProvider_code_key" ON "VideoProvider"("code");

-- CreateIndex
CREATE INDEX "SongVideoSearch_songId_providerId_idx" ON "SongVideoSearch"("songId", "providerId");

-- CreateIndex
CREATE INDEX "ContentChangeLog_entityType_entityId_idx" ON "ContentChangeLog"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "UserFavorite_userId_idx" ON "UserFavorite"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserFavorite_songId_userId_key" ON "UserFavorite"("songId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "CollectionItem_collectionId_songId_key" ON "CollectionItem"("collectionId", "songId");

-- CreateIndex
CREATE UNIQUE INDEX "CollectionItem_collectionId_position_key" ON "CollectionItem"("collectionId", "position");

-- CreateIndex
CREATE INDEX "UserActivityEvent_songId_eventType_idx" ON "UserActivityEvent"("songId", "eventType");

-- CreateIndex
CREATE INDEX "UserActivityEvent_userId_createdAt_idx" ON "UserActivityEvent"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "UserPreference_userId_key" ON "UserPreference"("userId");

-- CreateIndex
CREATE INDEX "UserTuningPreset_userId_idx" ON "UserTuningPreset"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionPlan_code_key" ON "SubscriptionPlan"("code");

-- CreateIndex
CREATE INDEX "TrendingScore_periodStart_score_idx" ON "TrendingScore"("periodStart", "score");

-- CreateIndex
CREATE UNIQUE INDEX "TrendingScore_songId_periodStart_periodEnd_key" ON "TrendingScore"("songId", "periodStart", "periodEnd");

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "MusicGenre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_licenseId_fkey" FOREIGN KEY ("licenseId") REFERENCES "ContentLicense"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SongAlias" ADD CONSTRAINT "SongAlias_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SongLyrics" ADD CONSTRAINT "SongLyrics_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SongVerse" ADD CONSTRAINT "SongVerse_lyricsId_fkey" FOREIGN KEY ("lyricsId") REFERENCES "SongLyrics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SongMetadata" ADD CONSTRAINT "SongMetadata_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SongMetadata" ADD CONSTRAINT "SongMetadata_rhythmId_fkey" FOREIGN KEY ("rhythmId") REFERENCES "Rhythm"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SongRegion" ADD CONSTRAINT "SongRegion_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SongRegion" ADD CONSTRAINT "SongRegion_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SongRegion" ADD CONSTRAINT "SongRegion_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES "Province"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SongRegion" ADD CONSTRAINT "SongRegion_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SongStory" ADD CONSTRAINT "SongStory_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SongSource" ADD CONSTRAINT "SongSource_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SongSource" ADD CONSTRAINT "SongSource_licenseId_fkey" FOREIGN KEY ("licenseId") REFERENCES "ContentLicense"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SongNotation" ADD CONSTRAINT "SongNotation_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SongChord" ADD CONSTRAINT "SongChord_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SongChord" ADD CONSTRAINT "SongChord_lyricsId_fkey" FOREIGN KEY ("lyricsId") REFERENCES "SongLyrics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SongTab" ADD CONSTRAINT "SongTab_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SongTab" ADD CONSTRAINT "SongTab_instrumentId_fkey" FOREIGN KEY ("instrumentId") REFERENCES "Instrument"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Artist" ADD CONSTRAINT "Artist_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Composer" ADD CONSTRAINT "Composer_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SongArtist" ADD CONSTRAINT "SongArtist_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SongArtist" ADD CONSTRAINT "SongArtist_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SongComposer" ADD CONSTRAINT "SongComposer_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SongComposer" ADD CONSTRAINT "SongComposer_composerId_fkey" FOREIGN KEY ("composerId") REFERENCES "Composer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Province" ADD CONSTRAINT "Province_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "District" ADD CONSTRAINT "District_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES "Province"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstrumentType" ADD CONSTRAINT "InstrumentType_instrumentId_fkey" FOREIGN KEY ("instrumentId") REFERENCES "Instrument"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TuningSystem" ADD CONSTRAINT "TuningSystem_instrumentId_fkey" FOREIGN KEY ("instrumentId") REFERENCES "Instrument"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TuningConfiguration" ADD CONSTRAINT "TuningConfiguration_instrumentTypeId_fkey" FOREIGN KEY ("instrumentTypeId") REFERENCES "InstrumentType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TuningConfiguration" ADD CONSTRAINT "TuningConfiguration_tuningSystemId_fkey" FOREIGN KEY ("tuningSystemId") REFERENCES "TuningSystem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TuningString" ADD CONSTRAINT "TuningString_configurationId_fkey" FOREIGN KEY ("configurationId") REFERENCES "TuningConfiguration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SongVideoSearch" ADD CONSTRAINT "SongVideoSearch_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SongVideoSearch" ADD CONSTRAINT "SongVideoSearch_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "VideoProvider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentChangeLog" ADD CONSTRAINT "ContentChangeLog_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFavorite" ADD CONSTRAINT "UserFavorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFavorite" ADD CONSTRAINT "UserFavorite_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCollection" ADD CONSTRAINT "UserCollection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionItem" ADD CONSTRAINT "CollectionItem_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "UserCollection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionItem" ADD CONSTRAINT "CollectionItem_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserActivityEvent" ADD CONSTRAINT "UserActivityEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserActivityEvent" ADD CONSTRAINT "UserActivityEvent_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPreference" ADD CONSTRAINT "UserPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTuningPreset" ADD CONSTRAINT "UserTuningPreset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTuningPreset" ADD CONSTRAINT "UserTuningPreset_baseConfigurationId_fkey" FOREIGN KEY ("baseConfigurationId") REFERENCES "TuningConfiguration"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recording" ADD CONSTRAINT "Recording_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recording" ADD CONSTRAINT "Recording_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recording" ADD CONSTRAINT "Recording_instrumentId_fkey" FOREIGN KEY ("instrumentId") REFERENCES "Instrument"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrendingScore" ADD CONSTRAINT "TrendingScore_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;

