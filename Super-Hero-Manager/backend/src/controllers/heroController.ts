import { Request, Response } from 'express';
import { logger } from '../utils/logger.js';
import Hero from '../models/Hero.js';

export const getAllHeroes = async (res: Response) => {
    try {
        const heroes = await Hero.find();
        logger.info(`Retrieved ${heroes.length} heroes`);
        return res.status(200).json(heroes);
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
        const { nom, alias, univers, pouvoirs, description, image, origine, premiereApparition } = req.body;
        
        const newHero = new Hero({
            nom,
            alias,
            univers,
            pouvoirs,
            description,
            image,
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
        const updateData = req.body;
        
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
