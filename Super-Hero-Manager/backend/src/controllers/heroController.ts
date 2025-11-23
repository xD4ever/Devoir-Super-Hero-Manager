import { Request, Response } from 'express';
import { logger } from '../utils/logger.js';
import Hero from '../models/Hero.js';

export const getAllHeroes = async (_req: Request, res: Response) => {
    try {
        // Use lean for cheaper objects & easier inspection
        const heroesRaw: any[] = await Hero.find().lean();

        // Fallback: detect a malformed aggregated document that contains the entire dataset under `superheros`
        if (
            heroesRaw.length === 1 &&
            !heroesRaw[0].nom &&
            Array.isArray(heroesRaw[0].superheros) &&
            heroesRaw[0].superheros.length > 0
        ) {
            logger.warn(
                'Detected aggregated hero document with embedded `superheros` array; applying fallback expansion. Fix the database seeding to remove this document.'
            );

            const expanded = heroesRaw[0].superheros.map((h: any) => {
                const univers = h?.biography?.publisher?.includes('Marvel')
                    ? 'Marvel'
                    : h?.biography?.publisher?.includes('DC')
                    ? 'DC'
                    : 'Autre';
                return {
                    // Generate a stable id; prefer slug, else original id number
                    _id: h.slug || String(h.id),
                    nom: h.name,
                    alias: h?.biography?.fullName || h.name,
                    univers,
                        pouvoirs: [
                        `Intelligence: ${h.powerstats?.intelligence}`,
                        `Strength: ${h.powerstats?.strength}`,
                        `Speed: ${h.powerstats?.speed}`,
                        `Durability: ${h.powerstats?.durability}`,
                        `Power: ${h.powerstats?.power}`,
                        `Combat: ${h.powerstats?.combat}`,
                    ],
                    description: `${h?.biography?.fullName || h.name}. ${h?.work?.occupation || ''}`.trim(),
                    image: h?.images?.md || h?.images?.sm || h?.images?.xs || h?.images?.lg,
                    origine: h?.biography?.placeOfBirth,
                    premiereApparition: h?.biography?.firstAppearance || undefined,
                };
            });

            logger.info(`Expanded aggregated document into ${expanded.length} heroes (temporary fallback).`);
            return res.status(200).json(expanded);
        }

        logger.info(`Retrieved ${heroesRaw.length} heroes`);
        return res.status(200).json(heroesRaw);
    } catch (error) {
        logger.error('Error fetching all heroes:', error);
        return res.status(500).json({ message: 'Server error', error });
    }
};

export const getHeroById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const hero = await Hero.findById(id);
        
        if (!hero) {
            logger.warn(`Hero not found with id: ${id}`);
            return res.status(404).json({ message: 'Hero not found' });
        }
        
        logger.info(`Retrieved hero: ${hero.nom}`);
        return res.status(200).json(hero);
    } catch (error) {
        logger.error('Error fetching hero by id:', error);
        return res.status(500).json({ message: 'Server error', error });
    }
};

export const createHero = async (req: Request, res: Response) => {
    try {
        const { nom, alias, univers, pouvoirs, description, origine, premiereApparition } = req.body;
        
        // Handle uploaded image
        let imageUrl = req.body.image; // Default to URL from body if provided
        if (req.file) {
            // If file was uploaded, use the uploaded file path
            imageUrl = `/uploads/${req.file.filename}`;
            logger.info(`Image uploaded: ${req.file.filename}`);
        }
        
        const newHero = new Hero({
            nom,
            alias,
            univers,
            pouvoirs: Array.isArray(pouvoirs) ? pouvoirs : JSON.parse(pouvoirs || '[]'),
            description,
            image: imageUrl,
            origine,
            premiereApparition
        });
        
        await newHero.save();
        logger.info(`Hero created: ${newHero.nom}`);
        return res.status(201).json({ message: 'Hero created successfully', hero: newHero });
    } catch (error) {
        logger.error('Error creating hero:', error);
        return res.status(500).json({ message: 'Server error', error });
    }
};

export const updateHero = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };
        
        // Handle uploaded image
        if (req.file) {
            updateData.image = `/uploads/${req.file.filename}`;
            logger.info(`Image uploaded for update: ${req.file.filename}`);
        }
        
        // Handle pouvoirs if it's a string
        if (updateData.pouvoirs && typeof updateData.pouvoirs === 'string') {
            updateData.pouvoirs = JSON.parse(updateData.pouvoirs);
        }
        
        const updatedHero = await Hero.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );
        
        if (!updatedHero) {
            logger.warn(`Hero not found for update with id: ${id}`);
            return res.status(404).json({ message: 'Hero not found' });
        }
        
        logger.info(`Hero updated: ${updatedHero.nom}`);
        return res.status(200).json({ message: 'Hero updated successfully', hero: updatedHero });
    } catch (error) {
        logger.error('Error updating hero:', error);
        return res.status(500).json({ message: 'Server error', error });
    }
};

export const deleteHero = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        const deletedHero = await Hero.findByIdAndDelete(id);
        
        if (!deletedHero) {
            logger.warn(`Hero not found for deletion with id: ${id}`);
            return res.status(404).json({ message: 'Hero not found' });
        }
        
        logger.info(`Hero deleted: ${deletedHero.nom}`);
        return res.status(200).json({ message: 'Hero deleted successfully', hero: deletedHero });
    } catch (error) {
        logger.error('Error deleting hero:', error);
        return res.status(500).json({ message: 'Server error', error });
    }
};
