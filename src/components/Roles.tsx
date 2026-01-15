import { useFirebaseState } from "../hooks/useFirebaseState";
import { DEFAULT_ROLES, type Member } from "../data";

export const Roles = () => {
  const [squad, setSquad] = useFirebaseState<Member[]>("squad", []);

  // Initialize with default roles if empty (e.g. first run)
  if (squad.length === 0 && DEFAULT_ROLES.length > 0) {
     // NOTE: We probably shouldn't set this inside render in a real app loop, 
     // but useFirebaseState handles updates. A safer way is a useEffect or button initialization.
     // For simplicity let's provide a button to "Load Defaults" or just start with an Add button.
     // Actually, let's just use empty array and let user add, or maybe push defaults once?
     // Let's rely on the user to add members for now to avoid infinite loops or complexity.
  }

  const updateMember = (id: string, field: keyof Member, value: string) => {
    setSquad((prev) => prev.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const addMember = () => {
    const newMember: Member = {
      id: Date.now().toString(),
      name: ""
    };
    setSquad((prev) => [...(prev || []), newMember]);
  };

  const removeMember = (id: string) => {
    setSquad((prev) => prev.filter(m => m.id !== id));
  };
  
  // ensure squad is array
  const list = Array.isArray(squad) ? squad : [];

  return (
    <div>
      <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {list.map((member) => (
          <li key={member.id} className="card" style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white' }}>
                 {member.name.charAt(0).toUpperCase() || "?"}
            </div>
            <input
              type="text"
              className="input"
              placeholder="Imię..."
              value={member.name}
              onChange={(e) => updateMember(member.id, "name", e.target.value)}
              style={{ flex: 1, background: 'transparent', border: 'none', padding: 0, height: 'auto' }}
            />
            <button className="btn-icon" onClick={() => removeMember(member.id)} style={{ color: 'var(--text-tertiary)' }}>×</button>
          </li>
        ))}
      </ul>
      
      <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        <button className="btn btn-secondary" onClick={addMember} style={{ width: '100%' }}>+ Dodaj Osobę</button>
      </div>
      
      {list.length === 0 && (
         <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <button className="btn btn-primary" onClick={() => setSquad(DEFAULT_ROLES)}>
               Wczytaj Domyślnych (4 osoby)
            </button>
         </div>
      )}
    </div>
  );
};
