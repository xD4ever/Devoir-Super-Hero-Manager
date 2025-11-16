import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getHeroById, updateHero } from '../api/heroApi';
import HeroForm from '../components/HeroForm';
import { Hero } from '../types/Hero';

const EditHero = () => {
  const { id } = useParams<{ id: string }>();
  const [initialHero, setInitialHero] = useState<Hero | undefined>(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const fetchHero = async () => {
        const data = await getHeroById(id);
        setInitialHero(data);
      };
      fetchHero();
    }
  }, [id]);

  const handleSubmit = async (hero: Omit<Hero, '_id'>) => {
    if (id) {
      await updateHero(id, hero);
      navigate(`/hero/${id}`);
    }
  };

  return (
    <div>
      <h1>Edit Hero</h1>
      {initialHero ? (
        <HeroForm onSubmit={handleSubmit} initialHero={initialHero} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default EditHero;
