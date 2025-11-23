import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHeroes, deleteHero } from '../api/heroApi';
import { Hero } from '../types/Hero';
import HeroCard from '../components/HeroCard';
import SearchBar from '../components/SearchBar';
import useAuth from '../hooks/useAuth';
import { filterHeroes, sortHeroes } from '../utils/heroUtils';

const Dashboard = () => {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [universeFilter, setUniverseFilter] =
    useState<'Tous' | 'Marvel' | 'DC' | 'Autre'>('Tous');
  const [sort, setSort] = useState<'name' | 'createdAt'>('name');
  const [error, setError] = useState<string | null>(null);

  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getHeroes();
        console.log('[Dashboard] Fetched heroes raw:', data);
        if (Array.isArray(data)) {
          // Log first hero keys to verify backend field names
          if (data.length) {
            console.log('[Dashboard] First hero keys:', Object.keys(data[0]));
            console.log('[Dashboard] First hero sample:', data[0]);
          } else {
            console.log('[Dashboard] Hero list empty');
          }
        } else {
          console.warn('[Dashboard] Unexpected heroes response (not array):', data);
        }
        setHeroes(data as Hero[]);
      } catch (e: any) {
        console.error('Erreur lors du chargement des héros', e);
        setError(
          e?.response?.data?.message ||
            e?.message ||
            'Erreur lors du chargement des héros',
        );
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const canCreate = isAuthenticated && ['admin', 'editor'].includes(user!.role);
  const canDelete = isAuthenticated && user?.role === 'admin';

  const filtered = useMemo(
    () => sortHeroes(filterHeroes(heroes, query, universeFilter), sort),
    [heroes, query, universeFilter, sort],
  );

  const handleDelete = async (hero: Hero) => {
    if (!canDelete) return;
    if (!window.confirm(`Supprimer ${hero.nom} ?`)) return;
    try {
      await deleteHero(hero._id);
      setHeroes(prev => prev.filter(h => h._id !== hero._id));
    } catch (e: any) {
      alert(
        e?.response?.data?.message ||
          'Erreur lors de la suppression du héros.',
      );
    }
  };

  return (
    <main className="page">
      <header className="page-header">
        <div>
          <h1>Super-héros</h1>
          <p>Liste avec recherche, filtres et gestion selon votre rôle.</p>
        </div>
        {canCreate && (
          <button
            className="btn primary"
            type="button"
            onClick={() => navigate('/add-hero')}
          >
            Ajouter un héros
          </button>
        )}
      </header>

      <section className="toolbar">
        <SearchBar onSearch={setQuery} />
        <select
          value={universeFilter}
          onChange={e =>
            setUniverseFilter(e.target.value as 'Tous' | 'Marvel' | 'DC' | 'Autre')
          }
        >
          <option value="Tous">Tous les univers</option>
          <option value="Marvel">Marvel</option>
          <option value="DC">DC</option>
          <option value="Autre">Autre</option>
        </select>
        <select
          value={sort}
          onChange={e => setSort(e.target.value as 'name' | 'createdAt')}
        >
          <option value="name">Ordre alphabétique</option>
          <option value="createdAt">Date d&apos;ajout</option>
        </select>
      </section>

      {isLoading && <div className="page-state">Chargement des héros…</div>}
      {error && <div className="error">{error}</div>}

      {!isLoading && !error && (
        <section className="hero-grid">
          {filtered.length === 0 ? (
            <div className="page-state">Aucun héros trouvé.</div>
          ) : (
            filtered.map(hero => (
              <HeroCard
                key={hero._id}
                hero={hero}
                canManage={
                  isAuthenticated && ['admin', 'editor'].includes(user!.role)
                }
                onEdit={() => navigate(`/edit-hero/${hero._id}`)}
                onDelete={() => handleDelete(hero)}
              />
            ))
          )}
        </section>
      )}
    </main>
  );
};

export default Dashboard;
