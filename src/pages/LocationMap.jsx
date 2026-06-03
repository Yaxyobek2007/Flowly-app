import { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { MapPin, Navigation, Plus, Trash2, Search, ExternalLink, X, Save } from 'lucide-react';

const defaultLocations = [
  { id: 1, name: "TTPU Universitet", address: "Toshkent", lat: 41.3111, lng: 69.2797, type: "education", icon: "🏫" },
  { id: 2, name: "Tashkent City", address: "Tashkent City Mall", lat: 41.3055, lng: 69.2812, type: "event", icon: "🏙️" },
  { id: 3, name: "IT Park", address: "IT Park, Toshkent", lat: 41.3200, lng: 69.2850, type: "work", icon: "🏢" },
];

export default function LocationMap() {
  const { events } = useApp();
  const { t, language } = useAuth();
  const lang = language || 'uz';
  const mapRef = useRef(null);

  const [locations, setLocations] = useState(() => {
    const saved = localStorage.getItem('flowly-locations');
    return saved ? JSON.parse(saved) : defaultLocations;
  });
  const [showForm, setShowForm] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [newLoc, setNewLoc] = useState({ name: '', address: '', type: 'personal', lat: null, lng: null });
  const [selectedLoc, setSelectedLoc] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapPin, setMapPin] = useState(null); // temporary pin position
  const [pinSaved, setPinSaved] = useState(false);

  const saveLocations = (locs) => {
    setLocations(locs);
    localStorage.setItem('flowly-locations', JSON.stringify(locs));
  };

  const handleAdd = () => {
    if (!newLoc.name || !newLoc.address || !newLoc.lat) return;
    const icons = { personal: '📍', education: '🏫', work: '🏢', meeting: '💼', event: '📍', birthday: '🎂' };
    const loc = { ...newLoc, id: Date.now(), icon: icons[newLoc.type] || '📍' };
    saveLocations([...locations, loc]);
    setNewLoc({ name: '', address: '', type: 'personal', lat: null, lng: null });
    setShowForm(false);
    setMapPin(null);
    setPinSaved(false);
  };

  // Handle click on map canvas to place pin
  const handleMapCanvasClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const w = rect.width;
    const h = rect.height;

    // Convert pixel position to approximate lat/lng (Tashkent area: lat 41.2-41.4, lng 69.1-69.4)
    const lat = 41.4 - (y / h) * 0.2;
    const lng = 69.1 + (x / w) * 0.3;

    setMapPin({ x, y, lat: parseFloat(lat.toFixed(5)), lng: parseFloat(lng.toFixed(5)) });
    setPinSaved(false);
  };

  // Save pin - confirm the selected location
  const handleSavePin = () => {
    if (!mapPin) return;
    setNewLoc(prev => ({ ...prev, lat: mapPin.lat, lng: mapPin.lng }));
    setPinSaved(true);
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
        <button className="btn-primary flex items-center gap-2" onClick={() => { setShowForm(true); setShowMapPicker(true); setMapPin(null); setPinSaved(false); }}>
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

      {/* MAP PICKER MODAL - Full screen shadow overlay */}
      {showMapPicker && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => { setShowMapPicker(false); setShowForm(false); }}></div>
          <div className="relative w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden animate-in"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
              <div>
                <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>
                  📍 {lang === 'ru' ? 'Выберите место' : lang === 'en' ? 'Select Location' : 'Joy tanlang'}
                </h3>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {lang === 'ru' ? 'Нажмите на карту для установки метки, затем сохраните' : lang === 'en' ? 'Click on map to place pin, then save' : "Xaritaga bosib metka qo'ying, keyin saqlang"}
                </p>
              </div>
              <button onClick={() => { setShowMapPicker(false); setShowForm(false); }} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800">
                <X size={20} style={{ color: 'var(--text-secondary)' }} />
              </button>
            </div>

            {/* Interactive Map Canvas */}
            <div ref={mapRef} className="relative w-full h-[400px] cursor-crosshair select-none overflow-hidden"
              onClick={handleMapCanvasClick}
              style={{ background: 'linear-gradient(135deg, #e0f2fe 0%, #dbeafe 30%, #bfdbfe 60%, #93c5fd 100%)' }}>
              
              {/* Grid overlay */}
              <div className="absolute inset-0 opacity-15">
                <svg width="100%" height="100%">
                  <defs>
                    <pattern id="mapgrid" width="50" height="50" patternUnits="userSpaceOnUse">
                      <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#3b82f6" strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#mapgrid)"/>
                </svg>
              </div>

              {/* Roads simulation */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/3 left-0 right-0 h-[2px] bg-gray-600"></div>
                <div className="absolute top-2/3 left-0 right-0 h-[2px] bg-gray-600"></div>
                <div className="absolute left-1/4 top-0 bottom-0 w-[2px] bg-gray-600"></div>
                <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-gray-600"></div>
                <div className="absolute left-3/4 top-0 bottom-0 w-[2px] bg-gray-600"></div>
              </div>

              {/* Existing location markers */}
              {locations.map((loc, idx) => {
                const px = ((loc.lng - 69.1) / 0.3) * 100;
                const py = ((41.4 - loc.lat) / 0.2) * 100;
                return (
                  <div key={loc.id} className="absolute transform -translate-x-1/2 -translate-y-full pointer-events-none"
                    style={{ left: `${Math.max(5, Math.min(95, px))}%`, top: `${Math.max(5, Math.min(95, py))}%` }}>
                    <div className="flex flex-col items-center">
                      <span className="text-xl drop-shadow-lg">{loc.icon}</span>
                      <span className="text-[8px] font-bold px-1 rounded bg-white/80 text-gray-800 mt-0.5 whitespace-nowrap shadow">{loc.name}</span>
                    </div>
                  </div>
                );
              })}

              {/* User-placed pin (clickable metka) */}
              {mapPin && (
                <div className="absolute transform -translate-x-1/2 -translate-y-full z-20 animate-bounce"
                  style={{ left: `${mapPin.x}px`, top: `${mapPin.y}px` }}>
                  <div className="flex flex-col items-center">
                    <div className="text-3xl drop-shadow-xl">📍</div>
                    <div className="px-2 py-0.5 rounded-lg bg-blue-600 text-white text-[10px] font-bold shadow-lg mt-1 whitespace-nowrap">
                      {mapPin.lat.toFixed(4)}, {mapPin.lng.toFixed(4)}
                    </div>
                  </div>
                </div>
              )}

              {/* City label */}
              <div className="absolute bottom-3 right-3 px-2 py-1 rounded-lg text-xs font-medium shadow"
                style={{ background: 'rgba(255,255,255,0.9)', color: '#1e293b' }}>
                🏙️ Toshkent, O'zbekiston
              </div>

              {/* Click hint */}
              {!mapPin && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                  <div className="px-4 py-2 rounded-xl bg-black/50 text-white text-sm font-medium backdrop-blur-sm animate-pulse">
                    {lang === 'ru' ? '👆 Нажмите здесь' : lang === 'en' ? '👆 Click here' : '👆 Shu yerga bosing'}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom controls */}
            <div className="p-4 border-t space-y-3" style={{ borderColor: 'var(--border)' }}>
              {/* Save pin button */}
              {mapPin && !pinSaved && (
                <button onClick={handleSavePin}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold flex items-center justify-center gap-2 shadow-lg hover:from-green-600 hover:to-emerald-600 transition-all">
                  <Save size={18} />
                  {lang === 'ru' ? 'Сохранить метку' : lang === 'en' ? 'Save Pin' : 'Metkani saqlash'}
                </button>
              )}

              {/* After pin saved - show form */}
              {pinSaved && (
                <div className="space-y-3 animate-in">
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-green-50 dark:bg-green-900/10">
                    <span className="text-green-500">✓</span>
                    <span className="text-sm text-green-700 dark:text-green-400 font-medium">
                      {lang === 'ru' ? 'Метка сохранена!' : lang === 'en' ? 'Pin saved!' : 'Metka saqlandi!'} ({newLoc.lat?.toFixed(4)}, {newLoc.lng?.toFixed(4)})
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" placeholder={t('placeName')} value={newLoc.name} onChange={e => setNewLoc({...newLoc, name: e.target.value})}
                      className="px-4 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                    <input type="text" placeholder={t('placeAddress')} value={newLoc.address} onChange={e => setNewLoc({...newLoc, address: e.target.value})}
                      className="px-4 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                    <select value={newLoc.type} onChange={e => setNewLoc({...newLoc, type: e.target.value})}
                      className="px-4 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                      <option value="personal">{t('personal')}</option>
                      <option value="education">{t('education')}</option>
                      <option value="work">{t('work')}</option>
                      <option value="meeting">{t('meeting')}</option>
                      <option value="event">{t('event')}</option>
                      <option value="birthday">{t('birthday')}</option>
                    </select>
                    <button onClick={handleAdd} disabled={!newLoc.name || !newLoc.address}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
                      <Plus size={16} /> {t('add')}
                    </button>
                  </div>
                </div>
              )}

              {/* Cancel if no pin */}
              {!pinSaved && !mapPin && (
                <p className="text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {lang === 'ru' ? 'Нажмите на карту для установки метки' : lang === 'en' ? 'Click on map to place a pin' : "Xaritaga bosib metka qo'ying"}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Selected Location Detail */}
      {selectedLoc && (
        <div className="card animate-in" style={{ borderColor: 'var(--accent)' }}>
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-3xl">{selectedLoc.icon}</span>
            <div className="flex-1 min-w-[150px]">
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
