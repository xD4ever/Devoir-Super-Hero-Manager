import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Hero from '../models/Hero.js';
import { logger } from './logger.js';
import { connectDB } from '../config/db.js';

dotenv.config();

interface SuperHeroData {
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
    appearance: {
        gender: string;
        race: string;
        height: string[];
        weight: string[];
        eyeColor: string;
        hairColor: string;
    };
    biography: {
        fullName: string;
        alterEgos: string;
        aliases: string[];
        placeOfBirth: string;
        firstAppearance: string;
        publisher: string;
        alignment: string;
    };
    work: {
        occupation: string;
        base: string;
    };
    connections: {
        groupAffiliation: string;
        relatives: string;
    };
    images: {
        xs: string;
        sm: string;
        md: string;
        lg: string;
    };
}

const seedDatabase = async () => {
    console.log('Starting seed/migration script...');
    try {
        // Connect to database
        await connectDB();
        
        let superHeroes: SuperHeroData[] = [];
        let badDocId: any = null;
        let sourceCollectionName: string | null = null;

        if (mongoose.connection.db) {
            const col = mongoose.connection.db.collection('heros');
            const allDocs = await col.find({}).toArray();
            
            // Find the bad document in memory
            const doc = allDocs.find((d: any) => d.superheros && Array.isArray(d.superheros));
            
            if (doc) {
                badDocId = doc._id;
                superHeroes = doc.superheros;
                sourceCollectionName = 'heros';
            }
        }

        if (badDocId) {
            logger.info(`Found malformed document in '${sourceCollectionName}' with ${superHeroes.length} heroes. Migrating...`);
        } else {
            const filePath = path.join(process.cwd(), 'src', 'uploads', 'SuperHerosComplet.json');
            if (fs.existsSync(filePath)) {
                const data = fs.readFileSync(filePath, 'utf-8');
                const jsonData = JSON.parse(data);
                superHeroes = jsonData.superheros || [];
                logger.info(`Found ${superHeroes.length} heroes in file to seed`);
            }
        }

        let successCount = 0;
        let errorCount = 0;

        for (const heroData of superHeroes) {
            try {
                // Map the JSON structure to our Hero model
                const heroDoc = {
                    nom: heroData.name,
                    alias: heroData.biography.fullName || heroData.name,
                    univers: heroData.biography.publisher.includes('Marvel') ? 'Marvel' 
                           : heroData.biography.publisher.includes('DC') ? 'DC' 
                           : 'Autre',
                    pouvoirs: [
                        `Intelligence: ${heroData.powerstats.intelligence}`,
                        `Strength: ${heroData.powerstats.strength}`,
                        `Speed: ${heroData.powerstats.speed}`,
                        `Durability: ${heroData.powerstats.durability}`,
                        `Power: ${heroData.powerstats.power}`,
                        `Combat: ${heroData.powerstats.combat}`
                    ],
                    description: `${heroData.biography.fullName} (${heroData.name}). ${heroData.work.occupation}`,
                    image: heroData.images.md || heroData.images.sm,
                    origine: heroData.biography.placeOfBirth,
                    premiereApparition: heroData.biography.firstAppearance ? new Date(heroData.biography.firstAppearance) : undefined
                };

                await Hero.create(heroDoc);
                successCount++;
            } catch (error) {
                errorCount++;
                logger.error(`Error seeding hero ${heroData.name}:`, error);
            }
        }

        if (badDocId && sourceCollectionName && mongoose.connection.db) {
            await mongoose.connection.db.collection(sourceCollectionName).deleteOne({ _id: badDocId });
            logger.info('Deleted malformed document');
        }

        logger.info(`Database seeded successfully. Success: ${successCount}, Errors: ${errorCount}`);
        console.log(`✅ Database seeded successfully. Success: ${successCount}, Errors: ${errorCount}`);
    } catch (error) {
        logger.error('Error seeding database:', error);
        console.error('❌ Error seeding database:', error);
        throw error;
    } finally {
        await mongoose.disconnect();
        logger.info('Database connection closed');
    }
};

seedDatabase();