import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { MapPin, Navigation, Plus, Trash2, Search, ExternalLink, X } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const defaultLocations = [
  { id: 1, name: "TTPU Universitet", address: "Toshkent", lat: 41.3111, lng: 69.2797, type: "education", icon: "🏫" },
  { id: 2, name: "Tashkent City", address: "Tashkent City Mall", lat: 41.3055, lng: 69.2812, type: "event", icon: "🏙️" },
  { id: 3, name: "IT Park", address: "IT Park, Toshkent", lat: 41.3200, lng: 69.2850, type: "work", icon: "🏢" },
];

function MapClickHandler({ onMapClick }) {
  useMapEvents({ click: (e) => onMapClick(e.latlng) });
  return null;
}

function FlyToLocation({ position }) {
  const map = useMap();
  useEffect(() => { if (position) map.flyTo(position, 15, { duration: 1 }); }, [position, map]);
  return null;
}

export default function LocationMap() {
  const { events } = useApp();
  const { t, language } = useAuth();
  const lang = language || 'uz';

  const [locations, setLocations] = useState(() => {
    const saved = localStorage.getItem('flowly-locations');
    return saved ? JSON.parse(saved) : defaultLocations;
  });
  const [showForm, setShowForm] = useState(false);
  const [newLoc, setNewLoc] = useState({ name: '', address: '', type: 'personal', lat: null, lng: null });
  const [selectedLoc, setSelectedLoc] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [flyTo, setFlyTo] = useState(null);

  const saveLocations = (locs) => {
    setLocations(locs);
    localStorage.setItem('flowly-locations', JSON.stringify(locs));
  };

  const handleAdd = () => {
    if (!newLoc.name || !newLoc.lat) return;
    const icons = { personal: '📍', education: '🏫', work: '🏢', meeting: '💼', event: '📍', birthday: '🎂' };
    const loc = { ...newLoc, id: Date.now(), icon: icons[newLoc.type] || '📍' };
    saveLocations([...locations, loc]);
    setNewLoc({ name: '', address: '', type: 'personal', lat: null, lng: null });
    setShowForm(false);
  };

  const handleMapClick = (latlng) => {
    if (showForm) {
      setNewLoc(prev => ({ ...prev, lat: latlng.lat, lng: latlng.lng }));
    }
  };

  const handleDelete = (id) => {
    saveLocations(locations.filter(l => l.id !== id));
    if (selectedLoc?.id === id) setSelectedLoc(null);
  };

  const openDirections = (loc) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}`, '_blank');
  };

  const openInMaps = (loc) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${loc.lat},${loc.lng}`, '_blank');
  };

  const filteredLocations = searchQuery
    ? locations.filter(l => l.name.toLowerCase().includes(searchQuery.toLowerCase()) || l.address.toLowerCase().includes(searchQuery.toLowerCase()))
    : locations;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{t('locationTitle')}</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{t('locationDesc')}</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={() => setShowForm(!showForm)}>
          <Plus size={18} /> {t('addPlace')}
        </button>
      </div>

      {/* Search */}
      <div className="card">
        <div className="flex items-center gap-3">
          <Search size={18} style={{ color: 'var(--text-secondary)' }} />
          <input type="text" placeholder={t('searchPlace')} value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none" style={{ color: 'var(--text-primary)' }} />
        </div>
      </div>

      {/* Add Form - appears above map with instruction */}
      {showForm && (
        <div className="card animate-in" style={{ borderColor: 'var(--accent)' }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{t('addPlace')}</h3>
            <button onClick={() => setShowForm(false)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              <X size={16} style={{ color: 'var(--text-secondary)' }} />
            </button>
          </div>
          <p className="text-xs mb-3 p-2 rounded-lg bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400">
            📍 {lang === 'ru' ? 'Нажмите на карту чтобы выбрать место' : lang === 'en' ? 'Click on the map to select location' : 'Xaritadan joy tanlash uchun bosing'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input type="text" placeholder={t('placeName')} value={newLoc.name} onChange={e => setNewLoc({...newLoc, name: e.target.value})}
              className="px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
            <input type="text" placeholder={t('placeAddress')} value={newLoc.address} onChange={e => setNewLoc({...newLoc, address: e.target.value})}
              className="px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
            <select value={newLoc.type} onChange={e => setNewLoc({...newLoc, type: e.target.value})}
              className="px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
              <option value="personal">{t('personal')}</option>
              <option value="education">{t('education')}</option>
              <option value="work">{t('work')}</option>
              <option value="meeting">{t('meeting')}</option>
              <option value="event">{t('event')}</option>
              <option value="birthday">{t('birthday')}</option>
            </select>
            <div className="px-4 py-2 rounded-lg border text-sm flex items-center" style={{ background: 'var(--bg-secondary)', borderColor: newLoc.lat ? 'rgba(34,197,94,0.5)' : 'var(--border)', color: newLoc.lat ? '#22c55e' : 'var(--text-secondary)' }}>
              {newLoc.lat ? `✓ ${newLoc.lat.toFixed(4)}, ${newLoc.lng.toFixed(4)}` : (lang === 'ru' ? '⬆️ Нажмите на карту' : lang === 'en' ? '⬆️ Click on map' : '⬆️ Xaritadan tanlang')}
            </div>
          </div>
          <button className="btn-primary mt-3 w-full flex items-center justify-center gap-2" onClick={handleAdd} disabled={!newLoc.lat || !newLoc.name}>
            <Plus size={16} /> {lang === 'ru' ? 'Добавить место' : lang === 'en' ? 'Add Place' : "Joyni qo'shish"}
          </button>
        </div>
      )}

      {/* MAP */}
      <div className="card overflow-hidden p-0">
        <div className={`w-full rounded-2xl overflow-hidden ${showForm ? 'h-[350px] ring-2 ring-blue-400' : 'h-[400px]'}`}>
          <MapContainer center={[41.311, 69.279]} zoom={12} className="h-full w-full z-0" style={{ height: '100%', width: '100%' }}>
            <TileLayer attribution='&copy; OSM' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapClickHandler onMapClick={handleMapClick} />
            {flyTo && <FlyToLocation position={flyTo} />}
            {locations.map(loc => (
              <Marker key={loc.id} position={[loc.lat, loc.lng]}
                eventHandlers={{ click: () => { setSelectedLoc(loc); setFlyTo([loc.lat, loc.lng]); } }}>
                <Popup>
                  <div className="text-center min-w-[100px]">
                    <span className="text-xl">{loc.icon}</span>
                    <p className="font-bold text-sm mt-1">{loc.name}</p>
                    <p className="text-xs text-gray-500">{loc.address}</p>
                    <div className="flex gap-1 mt-2 justify-center">
                      <button onClick={() => openDirections(loc)} className="px-2 py-0.5 bg-green-500 text-white rounded text-[10px]">Yo'l</button>
                      <button onClick={() => openInMaps(loc)} className="px-2 py-0.5 bg-blue-500 text-white rounded text-[10px]">Maps</button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
            {newLoc.lat && showForm && (
              <Marker position={[newLoc.lat, newLoc.lng]}>
                <Popup><span className="text-sm font-bold text-blue-600">📍 Yangi joy</span></Popup>
              </Marker>
            )}
          </MapContainer>
        </div>
      </div>

      {/* Selected Location Detail */}
      {selectedLoc && (
        <div className="card animate-in" style={{ borderColor: 'var(--accent)' }}>
          <div className="flex items-center gap-4">
            <span className="text-3xl">{selectedLoc.icon}</span>
            <div className="flex-1">
              <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{selectedLoc.name}</h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{selectedLoc.address}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openInMaps(selectedLoc)} className="btn-primary flex items-center gap-1 text-sm">
                <ExternalLink size={14} /> {t('openInMaps')}
              </button>
              <button onClick={() => openDirections(selectedLoc)} className="px-3 py-2 rounded-xl bg-green-500 text-white font-medium text-sm flex items-center gap-1 hover:bg-green-600">
                <Navigation size={14} /> {t('getDirections')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Saved Locations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredLocations.map((loc, idx) => (
          <div key={loc.id} className={`card flex items-center gap-4 cursor-pointer transition-all ${selectedLoc?.id === loc.id ? 'ring-2 ring-blue-500' : ''}`}
            style={{ animationDelay: `${idx * 50}ms` }}
            onClick={() => { setSelectedLoc(loc); setFlyTo([loc.lat, loc.lng]); }}>
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl" style={{ background: 'var(--bg-secondary)' }}>{loc.icon}</div>
            <div className="flex-1">
              <h4 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{loc.name}</h4>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{loc.address}</p>
            </div>
            <button onClick={(e) => { e.stopPropagation(); openDirections(loc); }} className="p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20">
              <Navigation size={14} className="text-green-500" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); handleDelete(loc.id); }} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
              <Trash2 size={14} className="text-red-400" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
