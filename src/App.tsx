import { useState } from "react";
import clsx from "clsx";
import { Schedule } from "./components/Schedule";
import { PackingList } from "./components/PackingList";
import { Roles } from "./components/Roles";
import { Budget } from "./components/Budget";
import { PhotoAlbum } from "./components/PhotoAlbum";
import { Weather } from "./components/Weather";
import "./index.css";
import { 
  Calendar, 
  Users, 
  Wallet, 
  Backpack, 
  Image
} from "lucide-react";

type Tab = "schedule" | "squad" | "budget" | "items" | "album";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("schedule");
  const [viewToday, setViewToday] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case "schedule": return <Schedule viewMode={viewToday ? "today" : "all"} />;
      case "squad": return <Roles />;
      case "budget": return <Budget />;
      case "items": return <PackingList />;
      case "album": return <PhotoAlbum />;
      default: return <Schedule />;
    }
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case "schedule": return "Plan Wyjazdu";
      case "squad": return "Ekipa";
      case "budget": return "Budżet";
      case "items": return "Lista";
      case "album": return "Album";
    }
  };

  return (
    <>
      <header className="app-header">
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Turku '26</h1>
          <div className="flex-row" style={{ gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            <span>🇫🇮 16–18 Stycznia</span>
          </div>
        </div>
        <Weather />
      </header>

      <main className="container animate-enter">
        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>{getPageTitle()}</h2>
          {activeTab === "schedule" && (
            <button 
                onClick={() => setViewToday(!viewToday)}
                className={clsx("btn btn-secondary", viewToday && "active")}
                style={{ height: '32px', fontSize: '0.85rem', padding: '0 1rem' }}
            >
                {viewToday ? "Dzisiaj" : "Całość"}
            </button>
          )}
        </div>
        
        {renderContent()}
      </main>

      <nav className="nav-bar">
        <button 
          className={clsx("nav-item", activeTab === "schedule" && "active")}
          onClick={() => setActiveTab("schedule")}
        >
          <Calendar size={24} strokeWidth={activeTab === "schedule" ? 2.5 : 2} />
          <span style={{ fontSize: '10px', fontWeight: 600 }}>Plan</span>
        </button>
        <button 
          className={clsx("nav-item", activeTab === "items" && "active")}
          onClick={() => setActiveTab("items")}
        >
          <Backpack size={24} strokeWidth={activeTab === "items" ? 2.5 : 2} />
          <span style={{ fontSize: '10px', fontWeight: 600 }}>Lista</span>
        </button>
        <button 
          className={clsx("nav-item", activeTab === "budget" && "active")}
          onClick={() => setActiveTab("budget")}
        >
          <Wallet size={24} strokeWidth={activeTab === "budget" ? 2.5 : 2} />
          <span style={{ fontSize: '10px', fontWeight: 600 }}>Kasa</span>
        </button>
        <button 
          className={clsx("nav-item", activeTab === "squad" && "active")}
          onClick={() => setActiveTab("squad")}
        >
          <Users size={24} strokeWidth={activeTab === "squad" ? 2.5 : 2} />
          <span style={{ fontSize: '10px', fontWeight: 600 }}>Ekipa</span>
        </button>
        <button 
          className={clsx("nav-item", activeTab === "album" && "active")}
          onClick={() => setActiveTab("album")}
        >
          <Image size={24} strokeWidth={activeTab === "album" ? 2.5 : 2} />
          <span style={{ fontSize: '10px', fontWeight: 600 }}>Album</span>
        </button>
      </nav>
    </>
  );
}
