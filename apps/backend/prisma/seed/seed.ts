import { PrismaClient } from '@prisma/client';
import genres from './data/genres.json';
import regionData from './data/regions-provinces.json';
import instrumentData from './data/instruments.json';
import tuningSystems from './data/tuning-systems.json';
import rhythms from './data/rhythms.json';

const prisma = new PrismaClient();

const slugify = (value: string): string =>
  value
    .toLocaleLowerCase('tr-TR')
    .replace(/ı/g, 'i')
    .replace(/ş/g, 's')
    .replace(/ç/g, 'c')
    .replace(/ö/g, 'o')
    .replace(/ü/g, 'u')
    .replace(/ğ/g, 'g')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

async function main(): Promise<void> {
  for (const genre of genres) {
    await prisma.musicGenre.upsert({
      where: { slug: genre.slug },
      update: genre,
      create: genre
    });
  }

  for (const region of regionData) {
    const createdRegion = await prisma.region.upsert({
      where: { code: region.code },
      update: { name: region.region },
      create: { name: region.region, code: region.code, countryCode: 'TR' }
    });

    for (const province of region.provinces) {
      await prisma.province.upsert({
        where: { regionId_name: { regionId: createdRegion.id, name: province } },
        update: {},
        create: { regionId: createdRegion.id, name: province }
      });
    }
  }

  const instrumentMap = new Map<string, string>();

  for (const instrumentName of instrumentData.instruments) {
    const instrument = await prisma.instrument.upsert({
      where: { slug: slugify(instrumentName) },
      update: { name: instrumentName },
      create: { name: instrumentName, slug: slugify(instrumentName), isActive: true }
    });
    instrumentMap.set(instrumentName, instrument.id);
  }

  for (const type of instrumentData.instrumentTypes) {
    const instrumentId = instrumentMap.get(type.instrument);
    if (!instrumentId) continue;

    await prisma.instrumentType.upsert({
      where: { instrumentId_slug: { instrumentId, slug: type.slug } },
      update: { name: type.name },
      create: {
        instrumentId,
        name: type.name,
        slug: type.slug
      }
    });
  }

  const baglamaId = instrumentMap.get('Bağlama');
  const gitarId = instrumentMap.get('Gitar');

  for (const systemName of tuningSystems) {
    const isGuitarSystem = ['Standart E2–A2–D3–G3–B3–E4', 'Drop D', 'Half Step Down', 'Whole Step Down', 'Open G', 'Open D'].includes(systemName);
    const instrumentId = isGuitarSystem ? gitarId : baglamaId;
    if (!instrumentId) continue;

    await prisma.tuningSystem.upsert({
      where: {
        instrumentId_slug: {
          instrumentId,
          slug: slugify(systemName)
        }
      },
      update: {
        name: systemName,
        referenceSource: 'verify before seed',
        isVerified: false
      },
      create: {
        instrumentId,
        name: systemName,
        slug: slugify(systemName),
        referenceSource: 'verify before seed',
        isVerified: false
      }
    });
  }

  for (const rhythmName of rhythms) {
    await prisma.rhythm.upsert({
      where: { slug: slugify(rhythmName) },
      update: { name: rhythmName },
      create: { name: rhythmName, slug: slugify(rhythmName), isActive: true }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
