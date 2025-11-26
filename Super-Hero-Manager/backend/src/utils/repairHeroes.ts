import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import Hero from '../models/Hero.js';
import { logger } from './logger.js';

interface RawHeroEntry {
  id: number;
  name: string;
  slug: string;
  powerstats: {
    intelligence: number;
    strength: number;
    speed: number;
    durability: number;
    power: number;
    combat: number;
  };
  biography: {
    fullName: string;
    firstAppearance: string;
    publisher: string;
    placeOfBirth: string;
  };
  work: {
    occupation: string;
  };
  images: {
    xs?: string;
    sm?: string;
    md?: string;
    lg?: string;
  };
}

// Detect and expand malformed document that embeds the entire JSON dataset under `superheros`
const repair = async () => {
  await connectDB();
  logger.info('Connected for hero repair');

  const malformed = await Hero.find({ superheros: { $exists: true } }).lean();
  if (!malformed.length) {
    logger.info('No malformed hero documents detected. Nothing to repair.');
    await mongoose.disconnect();
    return;
  }

  logger.warn(`Found ${malformed.length} malformed document(s). Starting expansion.`);
  let created = 0;

  for (const doc of malformed) {
    const list: RawHeroEntry[] = (doc as any).superheros || [];
    logger.info(`Expanding document ${doc._id} containing ${list.length} entries`);
    const newHeroes = list.map(h => {
      const univers = h.biography?.publisher?.includes('Marvel')
        ? 'Marvel'
        : h.biography?.publisher?.includes('DC')
          ? 'DC'
          : 'Autre';
      return {
        nom: h.name,
        alias: h.biography?.fullName || h.name,
        univers,
        pouvoirs: [
          `Intelligence: ${h.powerstats?.intelligence}`,
          `Strength: ${h.powerstats?.strength}`,
          `Speed: ${h.powerstats?.speed}`,
          `Durability: ${h.powerstats?.durability}`,
          `Power: ${h.powerstats?.power}`,
          `Combat: ${h.powerstats?.combat}`,
        ],
        description: `${h.biography?.fullName || h.name}. ${h.work?.occupation || ''}`.trim(),
        image: h.images?.md || h.images?.sm || h.images?.xs || h.images?.lg,
        origine: h.biography?.placeOfBirth,
        premiereApparition: h.biography?.firstAppearance
          ? new Date(h.biography.firstAppearance)
          : undefined,
      };
    });

    if (newHeroes.length) {
      await Hero.insertMany(newHeroes);
      created += newHeroes.length;
    }
    await Hero.deleteOne({ _id: doc._id });
    logger.info(`Removed malformed document ${doc._id}`);
  }

  logger.info(`Repair complete. Inserted ${created} hero documents.`);
  console.log(`✅ Repair complete. Inserted ${created} hero documents.`);
  await mongoose.disconnect();
};

repair().catch(err => {
  logger.error('Repair script failed', err);
  console.error('❌ Repair script failed', err);
  mongoose.disconnect();
});
