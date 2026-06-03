import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Navigation, Plus, Trash2, ExternalLink, Search } from 'lucide-react';

const defaultLocations = [
  { id: 1, name: "Universitet", address: "TTPU, Toshkent", lat: 41.3111, lng: 69.2797, type: "education", icon: "🏫" },
  { id: 2, name: "Tashkent City", address: "Tashkent City Mall", lat: 41.3123, lng: 69.2787, type: "event", icon: "🏙️" },
  { id: 3, name: "Konferensiya markazi", address: "Hilton Toshkent", lat: 41.3045, lng: 69.2715, type: "meeting", icon: "🏨" },
  { id: 4, name: "Kafe", address: "Navoi ko'chasi", lat: 41.3150, lng: 69.2800, type: "personal", icon: "☕" },
  { id: 5, name: "Ofis", address: "IT Park, Toshkent", lat: 41.3200, lng: 69.2850, type: "work", icon: "🏢" },
  { id: 6, name: "Tug'ilgan kun joyi", address: "Andijon", lat: 40.7831, lng: 72.3442, type: "birthday", icon: "🎂" },
];

export default function LocationMap() {
  const { events } = useApp();
  const [locations, setLocations] = useState(() => {
    const saved = localStorage.getItem('flowly-locations');
    return saved ? JSON.parse(saved) : defaultLocations;
  });
  const [showForm, setShowForm] = useState(false);
  const [newLoc, setNewLoc] = useState({ name: '', address: '', type: 'personal', icon: '📍' });
  const [selectedLoc, setSelectedLoc] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const saveLocations = (locs) => {
    setLocations(locs);
    localStorage.setItem('flowly-locations', JSON.stringify(locs));
  };

  const handleAdd = () => {
    if (!newLoc.name || !newLoc.address) return;
    const loc = {
      ...newLoc,
      id: Date.now(),
      lat: 41.3 + Math.random() * 0.05,
      lng: 69.27 + Math.random() * 0.03,
    };
    saveLocations([...locations, loc]);
    setNewLoc({ name: '', address: '', type: 'personal', icon: '📍' });
    setShowForm(false);
  };

  const handleDelete = (id) => {
    saveLocations(locations.filter(l => l.id !== id));
    if (selectedLoc?.id === id) setSelectedLoc(null);
  };

  const openInMaps = (loc) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.address + ' ' + loc.name)}`;
    window.open(url, '_blank');
  };

  const openDirections = (loc) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(loc.address + ' ' + loc.name)}`;
    window.open(url, '_blank');
  };

  // Events with locations
  const eventsWithLocation = events.filter(e => e.location);
  const filteredLocations = searchQuery
    ? locations.filter(l => l.name.toLowerCase().includes(searchQuery.toLowerCase()) || l.address.toLowerCase().includes(searchQuery.toLowerCase()))
    : locations;

  const typeColors = {
    education: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    event: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    meeting: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    personal: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
    work: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400',
    birthday: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Location & Map</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Geolokatsiya, xarita va yo'l ko'rsatish</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={() => setShowForm(!showForm)}>
          <Plus size={18} /> Joy qo'shish
        </button>
      </div>

      {/* Search */}
      <div className="card">
        <div className="flex items-center gap-3">
          <Search size={18} style={{ color: 'var(--text-secondary)' }} />
          <input type="text" placeholder="Joy qidirish..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none" style={{ color: 'var(--text-primary)' }} />
        </div>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="card animate-in" style={{ borderColor: 'var(--accent)' }}>
          <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Yangi joy qo'shish</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input type="text" placeholder="Joy nomi" value={newLoc.name} onChange={e => setNewLoc({...newLoc, name: e.target.value})}
              className="px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
            <input type="text" placeholder="Manzil" value={newLoc.address} onChange={e => setNewLoc({...newLoc, address: e.target.value})}
              className="px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
            <select value={newLoc.type} onChange={e => setNewLoc({...newLoc, type: e.target.value})}
              className="px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
              <option value="personal">Shaxsiy</option>
              <option value="education">Ta'lim</option>
              <option value="work">Ish</option>
              <option value="meeting">Uchrashuv</option>
              <option value="event">Tadbir</option>
              <option value="birthday">Tug'ilgan kun</option>
            </select>
            <select value={newLoc.icon} onChange={e => setNewLoc({...newLoc, icon: e.target.value})}
              className="px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500 text-xl"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
              <option value="📍">📍</option><option value="🏫">🏫</option><option value="🏢">🏢</option>
              <option value="🏠">🏠</option><option value="☕">☕</option><option value="🏙️">🏙️</option>
              <option value="🏨">🏨</option><option value="🎂">🎂</option><option value="🏋️">🏋️</option>
              <option value="🏥">🏥</option><option value="✈️">✈️</option><option value="🚉">🚉</option>
            </select>
          </div>
          <div className="flex gap-2 mt-3">
            <button className="btn-primary" onClick={handleAdd}>Qo'shish</button>
            <button className="px-4 py-2 rounded-lg border" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }} onClick={() => setShowForm(false)}>Bekor</button>
          </div>
        </div>
      )}

      {/* Map Preview (Interactive visual representation) */}
      <div className="card overflow-hidden">
        <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>🗺️ Xarita</h3>
        <div className="relative w-full h-64 rounded-xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #e0f2fe 0%, #dbeafe 30%, #bfdbfe 60%, #93c5fd 100%)' }}>
          {/* Simplified map visualization */}
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="#3b82f6" strokeWidth="0.5"/></pattern></defs>
              <rect width="100%" height="100%" fill="url(#grid)"/>
            </svg>
          </div>
          {/* Location pins */}
          {filteredLocations.map((loc, idx) => {
            const x = 10 + (idx % 5) * 18 + Math.random() * 5;
            const y = 15 + Math.floor(idx / 5) * 35 + Math.random() * 10;
            return (
              <div key={loc.id}
                className={`absolute cursor-pointer transition-all hover:scale-125 ${selectedLoc?.id === loc.id ? 'scale-125 z-10' : ''}`}
                style={{ left: `${x}%`, top: `${y}%` }}
                onClick={() => setSelectedLoc(loc)}>
                <div className="flex flex-col items-center">
                  <span className="text-2xl drop-shadow-lg">{loc.icon}</span>
                  <span className="text-[9px] font-bold px-1 rounded mt-0.5 whitespace-nowrap" style={{ background: 'rgba(255,255,255,0.9)', color: '#1e293b' }}>{loc.name}</span>
                </div>
              </div>
            );
          })}
          {/* Toshkent label */}
          <div className="absolute bottom-2 right-3 text-xs font-medium px-2 py-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.8)', color: '#1e293b' }}>
            📍 Toshkent, O'zbekiston
          </div>
        </div>
      </div>

      {/* Selected Location Detail */}
      {selectedLoc && (
        <div className="card animate-in" style={{ borderColor: 'var(--accent)' }}>
          <div className="flex items-center gap-4">
            <span className="text-4xl">{selectedLoc.icon}</span>
            <div className="flex-1">
              <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{selectedLoc.name}</h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{selectedLoc.address}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${typeColors[selectedLoc.type] || typeColors.personal}`}>{selectedLoc.type}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openInMaps(selectedLoc)} className="btn-primary flex items-center gap-1 text-sm">
                <ExternalLink size={14} /> Xaritada
              </button>
              <button onClick={() => openDirections(selectedLoc)} className="px-3 py-2 rounded-xl bg-green-500 text-white font-medium text-sm flex items-center gap-1 hover:bg-green-600 transition-all">
                <Navigation size={14} /> Yo'l
              </button>
            </div>
          </div>
        </div>
      )}

      {/* All Locations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredLocations.map((loc, idx) => (
          <div key={loc.id} className={`card flex items-center gap-4 animate-in cursor-pointer transition-all ${selectedLoc?.id === loc.id ? 'ring-2 ring-blue-500' : ''}`}
            style={{ animationDelay: `${idx * 50}ms` }} onClick={() => setSelectedLoc(loc)}>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{ background: 'var(--bg-secondary)' }}>
              {loc.icon}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{loc.name}</h4>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{loc.address}</p>
            </div>
            <div className="flex gap-1">
              <button onClick={(e) => { e.stopPropagation(); openDirections(loc); }}
                className="p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20" title="Yo'l ko'rsatish">
                <Navigation size={14} className="text-green-500" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); handleDelete(loc.id); }}
                className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
                <Trash2 size={14} className="text-red-400" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Events with locations */}
      {eventsWithLocation.length > 0 && (
        <div className="card">
          <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>📅 Voqealar joylashuvi</h3>
          <div className="space-y-3">
            {eventsWithLocation.map(event => (
              <div key={event.id} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/10"
                style={{ background: 'var(--bg-secondary)' }}
                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`, '_blank')}>
                <span className="text-xl">{event.icon}</span>
                <div className="flex-1">
                  <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{event.title}</p>
                  <p className="text-xs flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                    <MapPin size={10} /> {event.location} • {event.date}
                  </p>
                </div>
                <Navigation size={16} className="text-blue-500" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
