import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getHeroById, deleteHero } from '../api/heroApi';
import { Hero } from '../types/Hero';

const HeroDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [hero, setHero] = useState<Hero | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const fetchHero = async () => {
        const data = await getHeroById(id);
        setHero(data);
      };
      fetchHero();
    }
  }, [id]);

  const handleDelete = async () => {
    if (id) {
      await deleteHero(id);
      navigate('/');
    }
  };

  if (!hero) return <div>Loading...</div>;

  return (
    <div>
      <h1>{hero.nom}</h1>
      <img src={`http://localhost:5000${hero.image}`} alt={hero.nom} />
      <p><strong>Alias:</strong> {hero.alias}</p>
      <p><strong>Universe:</strong> {hero.univers}</p>
      <p><strong>Powers:</strong> {hero.pouvoirs.join(', ')}</p>
      <p><strong>Description:</strong> {hero.description}</p>
      <p><strong>Origin:</strong> {hero.origine}</p>
      <p><strong>First Appearance:</strong> {new Date(hero.premiereApparition!).toLocaleDateString()}</p>
      <button onClick={() => navigate(`/edit-hero/${id}`)}>Edit</button>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};

export default HeroDetails;
