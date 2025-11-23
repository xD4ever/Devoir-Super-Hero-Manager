import { FormEvent, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { login as loginRequest } from '../api/authApi';
import useAuth from '../hooks/useAuth';

const LoginPage = () => {
  const { login, isAuthenticated, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const { token } = await loginRequest({ username, password });
      login(token);
      await refreshUser();
      navigate('/');
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          'Erreur lors de la connexion. Vérifiez vos identifiants.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="page page--centered">
      <form className="card auth-form" onSubmit={handleSubmit}>
        <h1>Connexion</h1>
        <label>
          Nom d&apos;utilisateur
          <input
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoFocus
          />
        </label>
        <label>
          Mot de passe
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </label>
        {error && <div className="error">{error}</div>}
        <button className="btn primary" disabled={isSubmitting}>
          {isSubmitting ? 'Connexion…' : 'Se connecter'}
        </button>
      </form>
    </main>
  );
};

export default LoginPage;
