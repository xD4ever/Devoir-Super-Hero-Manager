import { useEffect, useState } from 'react';
import { fetchUsers, fetchAuditLog, AuditEntry } from '../api/adminApi';
import { User } from '../types/User';

const AdminPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [audit, setAudit] = useState<AuditEntry[]>([]);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const usersRes = await fetchUsers();
      const auditRes = await fetchAuditLog();

      setUsers(usersRes.data);
      setAudit(auditRes.data);

      if (usersRes.fallback || auditRes.fallback) {
        setInfo(
          "Les routes /api/admin ne sont pas encore actives. Données de démonstration affichées.",
        );
      }
    };
    load();
  }, []);

  return (
    <main className="page">
      <header className="page-header">
        <h1>Administration</h1>
        <p>Gestion des utilisateurs et journal des actions.</p>
      </header>

      {info && <div className="info">{info}</div>}

      <section className="card">
        <h2>Utilisateurs</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Rôle</th>
              <th>Créé le</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id}>
                <td>{u.username}</td>
                <td>{u.role}</td>
                <td>
                  {u.createdAt
                    ? new Date(u.createdAt).toLocaleDateString()
                    : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="card">
        <h2>Journal des actions</h2>
        {audit.length === 0 ? (
          <p>Aucune action enregistrée.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Acteur</th>
                <th>Action</th>
                <th>Cible</th>
              </tr>
            </thead>
            <tbody>
              {audit.map(entry => (
                <tr key={entry._id}>
                  <td>
                    {new Date(entry.createdAt).toLocaleString('fr-FR', {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    })}
                  </td>
                  <td>{entry.actor}</td>
                  <td>{entry.action}</td>
                  <td>{entry.target}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
};

export default AdminPage;
