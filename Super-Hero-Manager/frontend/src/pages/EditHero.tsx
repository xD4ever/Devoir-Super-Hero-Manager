import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HeroForm from '../components/HeroForm';
import { getHeroById, updateHero } from '../api/heroApi';
import { Hero } from '../types/Hero';

const EditHero = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [hero, setHero] = useState<Hero | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const handleSubmit = async (formData: FormData) => {
    if (!id) return;
    await updateHero(id, formData);
    navigate(`/hero/${id}`);
  };

  if (isLoading) {
    return <div className="page-state">Chargement du héros…</div>;
  }
  if (error) {
    return <div className="error">{error}</div>;
  }
  if (!hero) {
    return <div className="page-state">Héros introuvable.</div>;
  }

  return (
    <main className="page">
      <header className="page-header">
        <h1>Modifier le héros</h1>
      </header>
      <section className="card">
        <HeroForm
          onSubmit={handleSubmit}
          initialHero={hero}
          submitLabel="Mettre à jour"
        />
      </section>
    </main>
  );
};

export default EditHero;
