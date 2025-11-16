import { useNavigate } from 'react-router-dom';
import { createHero } from '../api/heroApi';
import HeroForm from '../components/HeroForm';
import { Hero } from '../types/Hero';

const AddHero = () => {
  const navigate = useNavigate();

  const handleSubmit = async (hero: Omit<Hero, '_id'>) => {
    await createHero(hero);
    navigate('/');
  };

  return (
    <div>
      <h1>Add New Hero</h1>
      <HeroForm onSubmit={handleSubmit} />
    </div>
  );
};

export default AddHero;
