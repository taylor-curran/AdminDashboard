import { useEffect, useState } from "react";
import { fetchUsers, type User } from "./api/users";

export function App() {
  const [users, setUsers] = useState<User[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers()
      .then(setUsers)
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : String(e)),
      );
  }, []);

  return (
    <main style={{ fontFamily: "system-ui, sans-serif", padding: "2rem" }}>
      <h1>Admin Dashboard — React POC</h1>
      <p>
        Backend: <code>json-server</code> on <code>:3000</code> (shared with the
        Angular app).
      </p>
      {error && <p style={{ color: "crimson" }}>Error: {error}</p>}
      {!users && !error && <p>Loading users…</p>}
      {users && (
        <ul data-testid="user-list">
          {users.map((u) => (
            <li key={u.id}>
              <strong>{u.name}</strong> — {u.email} <em>({u.role})</em>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
