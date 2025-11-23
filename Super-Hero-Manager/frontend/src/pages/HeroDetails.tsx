import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getHeroById, deleteHero } from '../api/heroApi';
import { Hero } from '../types/Hero';
import {
  formatHeroPowers,
  resolveHeroImage,
} from '../utils/heroUtils';
import useAuth from '../hooks/useAuth';

const HeroDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [hero, setHero] = useState<Hero | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const canEdit = isAuthenticated && ['admin', 'editor'].includes(user!.role);
  const canDelete = isAuthenticated && user?.role === 'admin';

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const data = await getHeroById(id);
        setHero(data);
      } catch (e: any) {
        setError(
          e?.response?.data?.message || 'Erreur lors du chargement du héros',
        );
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id]);

  const handleDelete = async () => {
    if (!hero || !canDelete) return;
    if (!window.confirm(`Supprimer ${hero.nom} ?`)) return;
    await deleteHero(hero._id);
    navigate('/');
  };

  if (isLoading) return <div className="page-state">Chargement…</div>;
  if (error) return <div className="error">{error}</div>;
  if (!hero) return <div className="page-state">Héros introuvable.</div>;

  const imageUrl = resolveHeroImage(hero.image);

  return (
    <main className="page">
      <section className="hero-details card">
        <div className="hero-details__image">
          <img src={imageUrl} alt={hero.nom} />
        </div>
        <div className="hero-details__content">
          <h1>{hero.nom}</h1>
          <p className="hero-details__alias">{hero.alias}</p>
          <p>
            <strong>Univers:</strong> {hero.univers}
          </p>
          {hero.description && <p>{hero.description}</p>}
          {hero.pouvoirs?.length > 0 && (
            <p>
              <strong>Pouvoirs:</strong> {formatHeroPowers(hero.pouvoirs)}
            </p>
          )}
          {hero.origine && (
            <p>
              <strong>Origine:</strong> {hero.origine}
            </p>
          )}
          {hero.premiereApparition && (
            <p>
              <strong>Première apparition:</strong>{' '}
              {new Date(hero.premiereApparition).toLocaleDateString()}
            </p>
          )}
          <div className="hero-details__actions">
            <button type="button" className="btn ghost" onClick={() => navigate(-1)}>
              Retour
            </button>
            {canEdit && (
              <button
                type="button"
                className="btn"
                onClick={() => navigate(`/edit-hero/${hero._id}`)}
              >
                Modifier
              </button>
            )}
            {canDelete && (
              <button
                type="button"
                className="btn danger"
                onClick={handleDelete}
              >
                Supprimer
              </button>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default HeroDetails;
