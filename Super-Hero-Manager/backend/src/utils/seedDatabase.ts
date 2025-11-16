import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import Hero from '../models/Hero.js';
import { logger } from './logger.js';
import { connectDB } from '../config/db.js';

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
    try {
        // Connect to database
        await connectDB();
        
        const filePath = path.join(process.cwd(), 'src', 'uploads', 'SuperHerosComplet.json');
        const data = fs.readFileSync(filePath, 'utf-8');
        const jsonData = JSON.parse(data);
        const superHeroes: SuperHeroData[] = jsonData.superheros || [];

        logger.info(`Found ${superHeroes.length} heroes to seed`);

        // Clear existing heroes (optional)
        // await Hero.deleteMany({});
        // logger.info('Cleared existing heroes');

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