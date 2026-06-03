import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { MapPin, Navigation, Plus, Trash2, Search, ExternalLink } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const defaultLocations = [
  { id: 1, name: "TTPU Universitet", address: "Toshkent, O'zbekiston", lat: 41.3111, lng: 69.2797, type: "education", icon: "🏫" },
  { id: 2, name: "Tashkent City", address: "Tashkent City Mall", lat: 41.3055, lng: 69.2812, type: "event", icon: "🏙️" },
  { id: 3, name: "IT Park", address: "IT Park, Toshkent", lat: 41.3200, lng: 69.2850, type: "work", icon: "🏢" },
  { id: 4, name: "Tug'ilgan kun joyi", address: "Andijon", lat: 40.7831, lng: 72.3442, type: "birthday", icon: "🎂" },
];

function MapClickHandler({ onMapClick }) {
  useMapEvents({ click: (e) => onMapClick(e.latlng) });
  return null;
}

function FlyToLocation({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo(position, 15, { duration: 1 });
  }, [position, map]);
  return null;
}

export default function LocationMap() {
  const { events } = useApp();
  const { t } = useAuth();

  const [locations, setLocations] = useState(() => {
    const saved = localStorage.getItem('flowly-locations');
    return saved ? JSON.parse(saved) : defaultLocations;
  });
  const [showForm, setShowForm] = useState(false);
  const [newLoc, setNewLoc] = useState({ name: '', address: '', type: 'personal', icon: '📍', lat: null, lng: null });
  const [selectedLoc, setSelectedLoc] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [flyTo, setFlyTo] = useState(null);
  const [pickingOnMap, setPickingOnMap] = useState(false);

  const saveLocations = (locs) => {
    setLocations(locs);
    localStorage.setItem('flowly-locations', JSON.stringify(locs));
  };

  const handleAdd = () => {
    if (!newLoc.name || !newLoc.lat) return;
    const loc = { ...newLoc, id: Date.now() };
    saveLocations([...locations, loc]);
    setNewLoc({ name: '', address: '', type: 'personal', icon: '📍', lat: null, lng: null });
    setShowForm(false);
    setPickingOnMap(false);
  };

  const handleMapClick = (latlng) => {
    if (pickingOnMap) {
      setNewLoc(prev => ({ ...prev, lat: latlng.lat, lng: latlng.lng }));
    }
  };

  const handleDelete = (id) => {
    saveLocations(locations.filter(l => l.id !== id));
    if (selectedLoc?.id === id) setSelectedLoc(null);
  };

  const openDirections = (loc) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}`;
    window.open(url, '_blank');
  };

  const openInMaps = (loc) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${loc.lat},${loc.lng}`, '_blank');
  };

  const filteredLocations = searchQuery
    ? locations.filter(l => l.name.toLowerCase().includes(searchQuery.toLowerCase()) || l.address.toLowerCase().includes(searchQuery.toLowerCase()))
    : locations;

  const eventsWithLocation = events.filter(e => e.location);

  const typeColors = {
    education: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    event: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    meeting: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    personal: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
    work: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400',
    birthday: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{t('locationTitle')}</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{t('locationDesc')}</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={() => { setShowForm(!showForm); setPickingOnMap(true); }}>
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

      {/* Add Form */}
      {showForm && (
        <div className="card animate-in" style={{ borderColor: 'var(--accent)' }}>
          <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>{t('addPlace')}</h3>
          <p className="text-xs mb-3 p-2 rounded-lg bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400">
            📍 Xaritadan joy tanlash uchun xaritaga bosing. Koordinatalar avtomatik tanlanadi.
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
            <div className="px-4 py-2 rounded-lg border text-sm" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
              {newLoc.lat ? `📍 ${newLoc.lat.toFixed(4)}, ${newLoc.lng.toFixed(4)}` : '⬆️ Xaritadan tanlang'}
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button className="btn-primary" onClick={handleAdd} disabled={!newLoc.lat || !newLoc.name}>{t('add')}</button>
            <button className="px-4 py-2 rounded-lg border" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }} onClick={() => { setShowForm(false); setPickingOnMap(false); }}>{t('cancel')}</button>
          </div>
        </div>
      )}

      {/* MAP */}
      <div className="card overflow-hidden p-0">
        <div className="h-[400px] w-full rounded-2xl overflow-hidden">
          <MapContainer center={[41.311, 69.279]} zoom={12} className="h-full w-full z-0"
            style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://osm.org/copyright">OSM</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapClickHandler onMapClick={handleMapClick} />
            {flyTo && <FlyToLocation position={flyTo} />}

            {/* Existing pins */}
            {locations.map(loc => (
              <Marker key={loc.id} position={[loc.lat, loc.lng]}
                eventHandlers={{ click: () => { setSelectedLoc(loc); setFlyTo([loc.lat, loc.lng]); } }}>
                <Popup>
                  <div className="text-center min-w-[120px]">
                    <span className="text-2xl">{loc.icon}</span>
                    <p className="font-bold text-sm mt-1">{loc.name}</p>
                    <p className="text-xs text-gray-500">{loc.address}</p>
                    <div className="flex gap-1 mt-2 justify-center">
                      <button onClick={() => openDirections(loc)} className="px-2 py-1 bg-green-500 text-white rounded text-[10px]">Yo'l</button>
                      <button onClick={() => openInMaps(loc)} className="px-2 py-1 bg-blue-500 text-white rounded text-[10px]">Maps</button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* New location pin (being placed) */}
            {newLoc.lat && (
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
            <span className="text-4xl">{selectedLoc.icon}</span>
            <div className="flex-1">
              <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{selectedLoc.name}</h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{selectedLoc.address}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${typeColors[selectedLoc.type] || typeColors.personal}`}>{selectedLoc.type}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openInMaps(selectedLoc)} className="btn-primary flex items-center gap-1 text-sm">
                <ExternalLink size={14} /> {t('openInMaps')}
              </button>
              <button onClick={() => openDirections(selectedLoc)} className="px-3 py-2 rounded-xl bg-green-500 text-white font-medium text-sm flex items-center gap-1 hover:bg-green-600 transition-all">
                <Navigation size={14} /> {t('getDirections')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* All Locations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredLocations.map((loc, idx) => (
          <div key={loc.id} className={`card flex items-center gap-4 animate-in cursor-pointer transition-all ${selectedLoc?.id === loc.id ? 'ring-2 ring-blue-500' : ''}`}
            style={{ animationDelay: `${idx * 50}ms` }}
            onClick={() => { setSelectedLoc(loc); setFlyTo([loc.lat, loc.lng]); }}>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{ background: 'var(--bg-secondary)' }}>{loc.icon}</div>
            <div className="flex-1">
              <h4 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{loc.name}</h4>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{loc.address}</p>
            </div>
            <div className="flex gap-1">
              <button onClick={(e) => { e.stopPropagation(); openDirections(loc); }} className="p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20" title={t('getDirections')}>
                <Navigation size={14} className="text-green-500" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); handleDelete(loc.id); }} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
                <Trash2 size={14} className="text-red-400" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Events with locations */}
      {eventsWithLocation.length > 0 && (
        <div className="card">
          <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>📅 {t('eventsLocation')}</h3>
          <div className="space-y-3">
            {eventsWithLocation.map(event => (
              <div key={event.id} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/10"
                style={{ background: 'var(--bg-secondary)' }}
                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`, '_blank')}>
                <span className="text-xl">{event.icon}</span>
                <div className="flex-1">
                  <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{event.title}</p>
                  <p className="text-xs flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}><MapPin size={10} /> {event.location} • {event.date}</p>
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
