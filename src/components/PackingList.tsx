import { useState, useEffect } from "react";
import { packingList as staticList } from "../data";
import { useFirebaseState } from "../hooks/useFirebaseState";
import { Plus, Trash2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

type PackingItem = {
  id: string;
  text: string;
  checked: boolean;
};

export const PackingList = () => {
    const [items, setItems, loading] = useFirebaseState<PackingItem[] | null>("packing-list", null);
    const [newItemText, setNewItemText] = useState("");

    // Migration / Init
    useEffect(() => {
        if (!loading && items === null) {
            // First time setup: map static list to objects
            const initialItems = staticList.map(text => ({
                id: uuidv4(),
                text,
                checked: false
            }));
            setItems(initialItems);
        }
    }, [loading, items, setItems]);

    const toggleItem = (id: string) => {
        if (!items) return;
        setItems(items.map(i => i.id === id ? { ...i, checked: !i.checked } : i));
    };

    const addItem = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newItemText.trim() || !items) return;
        
        const newItem: PackingItem = {
            id: uuidv4(),
            text: newItemText.trim(),
            checked: false
        };
        
        setItems([...items, newItem]);
        setNewItemText("");
    };

    const deleteItem = (id: string) => {
        if (!items || !confirm("Usunąć ten element?")) return;
        setItems(items.filter(i => i.id !== id));
    };

    if (loading) return <div className="text-center p-4 muted">Ładowanie listy...</div>;
    if (!items) return null; // Should initialize via effect

    return (
        <div className="packing-list-container">
            <form onSubmit={addItem} className="card glass-panel flex-row" style={{ marginBottom: '1.5rem', padding: '0.75rem' }}>
                <input 
                    type="text" 
                    value={newItemText}
                    onChange={(e) => setNewItemText(e.target.value)}
                    placeholder="Dodaj rzecz..."
                    className="input"
                    style={{ border: 'none', background: 'transparent' }}
                />
                <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={!newItemText.trim()}
                    style={{ width: '48px', height: '48px', borderRadius: '50%', padding: 0, flexShrink: 0 }}
                >
                    <Plus size={24} />
                </button>
            </form>

            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {items.map((item) => (
                    <li 
                        key={item.id} 
                        className="card"
                        style={{ 
                            padding: '0.75rem 1rem', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between',
                            opacity: item.checked ? 0.6 : 1,
                            transition: 'opacity 0.2s',
                            gap: '1rem'
                        }}
                    >
                        <label className="flex-row" style={{ flex: 1, cursor: 'pointer', gap: '1rem', margin: 0 }}>
                            <div style={{ 
                                width: '24px', 
                                height: '24px', 
                                border: `2px solid ${item.checked ? 'var(--success)' : 'var(--text-secondary)'}`, 
                                borderRadius: '6px',
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                background: item.checked ? 'var(--success)' : 'transparent',
                                flexShrink: 0
                            }}>
                                {item.checked && <span style={{ color: 'white', fontWeight: 'bold', fontSize: '14px' }}>✓</span>}
                            </div>
                            <input
                                type="checkbox"
                                checked={item.checked}
                                onChange={() => toggleItem(item.id)}
                                style={{ display: 'none' }}
                            />
                            <span style={{ 
                                fontSize: '1.1rem',
                                textDecoration: item.checked ? 'line-through' : 'none',
                                color: item.checked ? 'var(--text-secondary)' : 'var(--text-primary)',
                                fontWeight: 500
                            }}>
                                {item.text}
                            </span>
                        </label>
                        
                        <button 
                            onClick={(e) => { e.stopPropagation(); deleteItem(item.id); }}
                            className="btn-icon"
                            style={{ 
                                color: 'var(--danger)',
                                background: 'transparent',
                                flexShrink: 0
                            }}
                        >
                            <Trash2 size={20} />
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

