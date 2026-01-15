import { useState, useEffect } from "react";
import { database } from "../firebase";
import { get, ref } from "firebase/database";
import type { DayPlan } from "../data";
import { Camera } from "lucide-react";
import { ImageViewer } from "./ImageViewer";

export const PhotoAlbum = () => {
  const [scheduleData, setScheduleData] = useState<DayPlan[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewImage, setViewImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const dbRef = ref(database, "schedule-data");
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        setScheduleData(snapshot.val());
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-center p-4">Ładowanie zdjęć...</div>;

  if (!scheduleData) return <div className="text-center p-4">Brak danych.</div>;

  // Flatten photos
  const daysWithPhotos = scheduleData.map(day => ({
    day: day.day,
    photos: day.items.flatMap(item => {
      const urls = item.images || (item.imageUrl ? [item.imageUrl] : []);
      return urls.map(url => ({ url, item }));
    })
  })).filter(day => day.photos.length > 0);

  // We need to be able to delete photos from the album view too
  // Note: This modifies the scheduleData state, but we really should sync back to Firebase.
  // Ideally, Schedule.tsx and PhotoAlbum.tsx should share a hook or context, but for now we update specific item.
  
  const handleDelete = async (photo: { url: string, item: import('../data').ScheduleItem }, dayIndex: number) => {
      if (!scheduleData || !confirm("Usunąć to zdjęcie z wydarzenia?")) return;

      const newSchedule = [...scheduleData];
      const dayItems = newSchedule[dayIndex].items;
      const itemIndex = dayItems.findIndex(i => i.id === photo.item.id);
      
      if (itemIndex !== -1) {
          const currentItem = dayItems[itemIndex];
          const currentImages = currentItem.images || (currentItem.imageUrl ? [currentItem.imageUrl] : []);
          const newImages = currentImages.filter(url => url !== photo.url);
          
          // Update local state
          dayItems[itemIndex] = { ...currentItem, images: newImages };
          setScheduleData(newSchedule);
          
          // Sync to Firebase
          const dbRef = ref(database, "schedule-data");
          await import("firebase/database").then(db => db.set(dbRef, newSchedule));
      }
  };

  if (daysWithPhotos.length === 0) {
    return (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--muted)' }}>
            <Camera size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
            <h3>Brak zdjęć</h3>
            <p>Dodaj zdjęcia do wydarzeń w planie, aby zobaczyć je tutaj.</p>
        </div>
    );
  }

  return (
    <div style={{ paddingBottom: '5rem' }}>
      {daysWithPhotos.map(day => (
        <div key={day.day}>
          <h2 style={{ fontSize: '1.2rem', marginTop: '2rem', marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
            {day.day}
          </h2>
          <div className="gallery-grid">
            {day.photos.map((photo, idx) => {
              // We need to find the real day index from the schedule to update it correctly
              // This is a bit inefficient but safe:
              const dayIndex = scheduleData.findIndex(d => d.day === day.day);

              return (
              <div 
                key={idx} 
                className="gallery-item" 
                onClick={() => setViewImage(photo.url)} 
                style={{ cursor: 'pointer' }}
              >
                <img src={photo.url} alt="Snap" loading="lazy" />
                <div className="photo-caption">
                    <strong>{photo.item.time}</strong> {photo.item.title}
                </div>
                <button 
                    className="btn-delete-photo" 
                    onClick={(e) => { e.stopPropagation(); handleDelete(photo, dayIndex); }}
                    title="Usuń zdjęcie"
                >
                    {/* Trash icon from lucide-react, assume imported or use text if not */}
                     <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </button>
              </div>
            )})}
          </div>
        </div>
      ))}
      
      {viewImage && <ImageViewer src={viewImage} onClose={() => setViewImage(null)} />}
    </div>
  );
};
