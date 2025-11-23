import { Link } from 'react-router-dom';
import { Hero } from '../types/Hero';
import {
  extractHeroSummary,
  formatHeroPowers,
  resolveHeroImage,
} from '../utils/heroUtils';

interface HeroCardProps {
  hero: Hero;
  canManage?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

const HeroCard = ({
  hero,
  canManage = false,
  onEdit,
  onDelete,
}: HeroCardProps) => {
  const imageUrl = resolveHeroImage(hero.image);
  const universe = hero.univers ?? 'Autre';

  return (
    <article className={`hero-card hero-card--${universe.toLowerCase()}`}>
      <Link to={`/hero/${hero._id}`} className="hero-card__image">
        <img src={imageUrl} alt={hero.nom} />
      </Link>
      <div className="hero-card__body">
        <header>
          <h2>{hero.nom}</h2>
          <p className="hero-card__alias">{hero.alias}</p>
          <span className="hero-card__universe">{universe}</span>
        </header>
        <p className="hero-card__summary">{extractHeroSummary(hero)}</p>
        {hero.pouvoirs?.length > 0 && (
          <p className="hero-card__powers">
            <strong>Pouvoirs:</strong> {formatHeroPowers(hero.pouvoirs)}
          </p>
        )}
        <footer className="hero-card__footer">
          <Link to={`/hero/${hero._id}`} className="btn ghost">
            Détails
          </Link>
          {canManage && (
            <div className="hero-card__actions">
              <button type="button" className="btn" onClick={onEdit}>
                Modifier
              </button>
              <button
                type="button"
                className="btn danger"
                onClick={onDelete}
              >
                Supprimer
              </button>
            </div>
          )}
        </footer>
      </div>
    </article>
  );
};

export default HeroCard;
