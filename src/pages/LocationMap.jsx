import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { MapPin, Navigation, Plus, Trash2, Search, ExternalLink, X, Map } from 'lucide-react';

const defaultLocations = [
  { id: 1, name: "TTPU Universitet", address: "Toshkent", lat: 41.3111, lng: 69.2797, type: "education", icon: "🏫" },
  { id: 2, name: "Tashkent City", address: "Tashkent City Mall", lat: 41.3055, lng: 69.2812, type: "event", icon: "🏙️" },
  { id: 3, name: "IT Park", address: "IT Park, Toshkent", lat: 41.3200, lng: 69.2850, type: "work", icon: "🏢" },
];

export default function LocationMap() {
  const { events } = useApp();
  const { t, language } = useAuth();
  const lang = language || 'uz';

  const [locations, setLocations] = useState(() => {
    const saved = localStorage.getItem('flowly-locations');
    return saved ? JSON.parse(saved) : defaultLocations;
  });
  const [showForm, setShowForm] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [newLoc, setNewLoc] = useState({ name: '', address: '', type: 'personal', lat: null, lng: null });
  const [selectedLoc, setSelectedLoc] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const saveLocations = (locs) => {
    setLocations(locs);
    localStorage.setItem('flowly-locations', JSON.stringify(locs));
  };

  const handleAdd = () => {
    if (!newLoc.name || !newLoc.address) return;
    const icons = { personal: '📍', education: '🏫', work: '🏢', meeting: '💼', event: '📍', birthday: '🎂' };
    // If user didn't pick on map, use a default Tashkent location
    const lat = newLoc.lat || (41.30 + Math.random() * 0.03);
    const lng = newLoc.lng || (69.27 + Math.random() * 0.02);
    const loc = { ...newLoc, lat, lng, id: Date.now(), icon: icons[newLoc.type] || '📍' };
    saveLocations([...locations, loc]);
    setNewLoc({ name: '', address: '', type: 'personal', lat: null, lng: null });
    setShowForm(false);
  };

  // Open map picker modal - user clicks on iframe map to select location
  const openMapPicker = () => {
    setShowMapPicker(true);
  };

  const handleMapSelect = (lat, lng) => {
    setNewLoc(prev => ({ ...prev, lat, lng }));
    setShowMapPicker(false);
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

  const eventsWithLocation = events.filter(e => e.location);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
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

      {/* Add Form */}
      {showForm && (
        <div className="card animate-in" style={{ borderColor: 'var(--accent)' }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{t('addPlace')}</h3>
            <button onClick={() => setShowForm(false)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              <X size={16} style={{ color: 'var(--text-secondary)' }} />
            </button>
          </div>
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
            {/* Map button to open picker */}
            <button onClick={openMapPicker} type="button"
              className={`px-4 py-2 rounded-lg border flex items-center justify-center gap-2 transition-all ${newLoc.lat ? 'ring-2 ring-green-400 bg-green-50 dark:bg-green-900/10' : 'hover:ring-2 hover:ring-blue-300'}`}
              style={{ borderColor: newLoc.lat ? 'rgba(34,197,94,0.5)' : 'var(--border)', color: newLoc.lat ? '#22c55e' : 'var(--text-secondary)' }}>
              <Map size={16} />
              {newLoc.lat
                ? `✓ ${newLoc.lat.toFixed(4)}, ${newLoc.lng.toFixed(4)}`
                : (lang === 'ru' ? 'Выбрать на карте' : lang === 'en' ? 'Pick on Map' : 'Xaritadan tanlash')
              }
            </button>
          </div>
          <button className="btn-primary mt-3 w-full flex items-center justify-center gap-2" onClick={handleAdd} disabled={!newLoc.name || !newLoc.address}>
            <Plus size={16} /> {t('add')}
          </button>
        </div>
      )}

      {/* Map Picker Modal */}
      {showMapPicker && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setShowMapPicker(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          <div className="relative w-full max-w-2xl h-[70vh] rounded-2xl shadow-2xl overflow-hidden animate-in" onClick={e => e.stopPropagation()}
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-10 p-4 flex items-center justify-between"
              style={{ background: 'linear-gradient(to bottom, var(--bg-card), transparent)' }}>
              <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>
                📍 {lang === 'ru' ? 'Выберите место на карте' : lang === 'en' ? 'Select location on map' : 'Xaritadan joy tanlang'}
              </h3>
              <button onClick={() => setShowMapPicker(false)} className="p-2 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                <X size={18} style={{ color: 'var(--text-primary)' }} />
              </button>
            </div>

            {/* Embedded OpenStreetMap */}
            <iframe
              src={`https://www.openstreetmap.org/export/embed.html?bbox=69.1%2C41.2%2C69.4%2C41.4&layer=mapnik&marker=41.311%2C69.279`}
              className="w-full h-full border-0"
              title="Map Picker"
            ></iframe>

            {/* Bottom controls */}
            <div className="absolute bottom-0 left-0 right-0 p-4" style={{ background: 'linear-gradient(to top, var(--bg-card), transparent)' }}>
              <p className="text-xs text-center mb-3" style={{ color: 'var(--text-secondary)' }}>
                {lang === 'ru' ? 'Введите координаты или используйте карту для навигации' : lang === 'en' ? 'Enter coordinates or use map for navigation' : 'Koordinatalarni kiriting yoki xaritadan foydalaning'}
              </p>
              <div className="flex gap-2">
                <input type="number" step="0.0001" placeholder="Lat (41.xxxx)" value={newLoc.lat || ''}
                  onChange={e => setNewLoc(prev => ({...prev, lat: parseFloat(e.target.value) || null}))}
                  className="flex-1 px-3 py-2 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                <input type="number" step="0.0001" placeholder="Lng (69.xxxx)" value={newLoc.lng || ''}
                  onChange={e => setNewLoc(prev => ({...prev, lng: parseFloat(e.target.value) || null}))}
                  className="flex-1 px-3 py-2 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                <button onClick={() => setShowMapPicker(false)}
                  className="btn-primary px-4 text-sm whitespace-nowrap">
                  {newLoc.lat ? '✓ OK' : (lang === 'ru' ? 'Готово' : lang === 'en' ? 'Done' : 'Tayyor')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
          <div key={loc.id} className={`card flex items-center gap-4 cursor-pointer transition-all animate-in ${selectedLoc?.id === loc.id ? 'ring-2 ring-blue-500' : ''}`}
            style={{ animationDelay: `${idx * 50}ms` }}
            onClick={() => setSelectedLoc(loc)}>
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl" style={{ background: 'var(--bg-secondary)' }}>{loc.icon}</div>
            <div className="flex-1">
              <h4 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{loc.name}</h4>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{loc.address}</p>
            </div>
            <button onClick={(e) => { e.stopPropagation(); openDirections(loc); }} className="p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20" title={t('getDirections')}>
              <Navigation size={14} className="text-green-500" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); handleDelete(loc.id); }} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
              <Trash2 size={14} className="text-red-400" />
            </button>
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
