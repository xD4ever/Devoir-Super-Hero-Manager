import { useState, useEffect } from 'react';
import { getHeroes } from '../api/heroApi';
import { Hero } from '../types/Hero';
import HeroCard from '../components/HeroCard';
import SearchBar from '../components/SearchBar';

const Dashboard = () => {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [filteredHeroes, setFilteredHeroes] = useState<Hero[]>([]);

  useEffect(() => {
    const fetchHeroes = async () => {
      const data = await getHeroes();
      setHeroes(data);
      setFilteredHeroes(data);
    };
    fetchHeroes();
  }, []);

  const handleSearch = (query: string) => {
    const lowercasedQuery = query.toLowerCase();
    const filtered = heroes.filter(hero =>
      hero.nom.toLowerCase().includes(lowercasedQuery) ||
      hero.alias.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredHeroes(filtered);
  };

  return (
    <div>
      <SearchBar onSearch={handleSearch} />
      <div className="heroes-grid">
        {filteredHeroes.map(hero => (
          <HeroCard key={hero._id} hero={hero} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
