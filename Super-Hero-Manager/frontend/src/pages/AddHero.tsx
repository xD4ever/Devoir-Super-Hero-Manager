import { useNavigate } from 'react-router-dom';
import HeroForm from '../components/HeroForm';
import { createHero } from '../api/heroApi';

const AddHero = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData: FormData) => {
    await createHero(formData);
    navigate('/');
  };

  return (
    <main className="page">
      <header className="page-header">
        <h1>Ajouter un héros</h1>
      </header>
      <section className="card">
        <HeroForm onSubmit={handleSubmit} submitLabel="Créer" />
      </section>
    </main>
  );
};

export default AddHero;
