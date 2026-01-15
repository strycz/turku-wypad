import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import type { ScheduleItem } from '../data';
import { v4 as uuidv4 } from 'uuid';

type Props = {
  item?: ScheduleItem; // If undefined, we are creating new
  onSave: (item: ScheduleItem) => void;
  onCancel: () => void;
  onDelete?: () => void;
};

export const ScheduleItemEditor = ({ item, onSave, onCancel, onDelete }: Props) => {
  const [title, setTitle] = useState(item?.title || '');
  const [time, setTime] = useState(item?.time || '');
  const [description, setDescription] = useState(item?.description || '');
  const [location, setLocation] = useState(item?.location || '');
  // Legacy image URL preservation (readonly)
  const imageUrl = item?.imageUrl || '';
  
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: item?.id || uuidv4(),
      title,
      time,
      description,
      location,
      imageUrl
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ position: 'relative' }}>
          {item && onDelete && (
              <button 
                type="button" 
                onClick={onDelete} 
                className="btn-icon" 
                style={{ 
                    position: 'absolute', 
                    top: '1rem', 
                    right: '1rem', 
                    color: 'var(--danger)',
                    zIndex: 10
                }}
              >
                  <Trash2 size={24} />
              </button>
          )}
        <h3 style={{ marginBottom: '1.5rem', paddingRight: '2.5rem' }}>{item ? 'Edytuj wydarzenie' : 'Dodaj wydarzenie'}</h3>
        <form onSubmit={handleSubmit} className="flex-col">
          <label>
            <span className="input-label">Godzina</span>
            <input 
              value={time} 
              onChange={e => setTime(e.target.value)} 
              placeholder="HH:MM lub HH:MM–HH:MM"
              className="form-input"
              required 
            />
          </label>
          
          <label>
            <span className="input-label">Tytuł</span>
            <input 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              placeholder="Co robimy?"
              className="form-input"
              required 
            />
          </label>

          <label>
            <span className="input-label">Opis (opcjonalnie)</span>
            <textarea 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              placeholder="Szczegóły..."
              rows={3}
              className="form-input"
            />
          </label>

          <label>
            <span className="input-label">Link do Mapy (opcjonalnie)</span>
            <input 
              value={location} 
              onChange={e => setLocation(e.target.value)} 
              placeholder="https://maps.google.com/..."
              className="form-input"
            />
          </label>



          <div style={{ marginTop: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onCancel} className="btn btn-secondary">
              Anuluj
            </button>
            <button type="submit" className="btn btn-primary">
              Zapisz
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
