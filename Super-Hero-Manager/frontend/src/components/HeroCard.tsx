import { Link } from 'react-router-dom';
import { Hero } from '../types/Hero';

interface HeroCardProps {
  hero: Hero;
}

const HeroCard = ({ hero }: HeroCardProps) => {
  return (
    <div className="hero-card">
      <img src={`http://localhost:5000${hero.image}`} alt={hero.nom} />
      <h2>{hero.nom}</h2>
      <p>{hero.alias}</p>
      <Link to={`/hero/${hero._id}`}>View Details</Link>
    </div>
  );
};

export default HeroCard;
