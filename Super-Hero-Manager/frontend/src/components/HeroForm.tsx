import React, { useState, useEffect } from 'react';
import { Hero } from '../types/Hero';

interface HeroFormProps {
  onSubmit: (hero: Omit<Hero, '_id'>) => void;
  initialHero?: Hero;
}

const HeroForm = ({ onSubmit, initialHero }: HeroFormProps) => {
  const [hero, setHero] = useState<Omit<Hero, '_id'>>({
    nom: '',
    alias: '',
    univers: 'Marvel',
    pouvoirs: [],
    description: '',
    image: '',
    origine: '',
    premiereApparition: new Date(),
  });

  useEffect(() => {
    if (initialHero) {
      setHero(initialHero);
    }
  }, [initialHero]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setHero(prev => ({ ...prev, [name]: value }));
  };

  const handlePouvoirsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setHero(prev => ({ ...prev, pouvoirs: value.split(',').map(p => p.trim()) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(hero);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="nom" value={hero.nom} onChange={handleChange} placeholder="Nom" required />
      <input name="alias" value={hero.alias} onChange={handleChange} placeholder="Alias" required />
      <select name="univers" value={hero.univers} onChange={handleChange}>
        <option value="Marvel">Marvel</option>
        <option value="DC">DC</option>
        <option value="Autre">Autre</option>
      </select>
      <input name="pouvoirs" value={hero.pouvoirs.join(', ')} onChange={handlePouvoirsChange} placeholder="Pouvoirs (comma separated)" required />
      <textarea name="description" value={hero.description} onChange={handleChange} placeholder="Description" />
      <input name="image" value={hero.image} onChange={handleChange} placeholder="Image URL" />
      <input name="origine" value={hero.origine} onChange={handleChange} placeholder="Origine" />
      <input type="date" name="premiereApparition" value={hero.premiereApparition?.toString().split('T')[0]} onChange={handleChange} />
      <button type="submit">Submit</button>
    </form>
  );
};

export default HeroForm;
