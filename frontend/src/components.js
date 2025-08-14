import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Draggable from 'react-draggable';
import { 
  Settings,
  Minimize2,
  Maximize2,
  X,
  Search,
  Music,
  Pin,
  Eye,
  EyeOff,
  RefreshCw
} from 'lucide-react';

// Mock lyrics data
const lyricsDatabase = {
  "Sample Song 1": {
    artist: "Demo Artist",
    lyrics: [
      { time: 0, text: "🎵 Selamat datang di MiniLyrics untuk Spotify" },
      { time: 3000, text: "Aplikasi penampil lirik mengambang" },
      { time: 6000, text: "Dengan sinkronisasi waktu yang akurat" },
      { time: 10000, text: "Seperti MiniLyrics yang asli" },
      { time: 15000, text: "Anda bisa mengganti lagu dari menu" },
      { time: 18000, text: "Dan menyesuaikan tema serta transparansi" },
      { time: 21000, text: "Jendela bisa di-drag ke mana saja" },
      { time: 25000, text: "Dan di-pin agar selalu di atas" },
      { time: 30000, text: "Sempurna untuk pengguna Spotify" },
      { time: 35000, text: "Yang ingin tampilan lirik mengambang" },
      { time: 38000, text: "Dengan desain modern dan fitur lengkap" },
      { time: 41000, text: "Dibangun dengan React dan animasi" },
      { time: 45000, text: "Responsif dan dapat dikustomisasi" },
      { time: 48000, text: "Seperti MiniLyrics klasik" },
      { time: 51000, text: "Tapi dengan teknologi web modern" },
      { time: 55000, text: "Dan animasi yang indah" },
      { time: 60000, text: "Siap untuk integrasi Spotify" },
      { time: 65000, text: "Dengan sinkronisasi lirik real-time" },
      { time: 70000, text: "Solusi pengganti yang sempurna" },
      { time: 75000, text: "Untuk pecinta musik modern 🎵" }
    ]
  },
  "Sample Song 2": {
    artist: "Another Demo",
    lyrics: [
      { time: 0, text: "🎼 Ini contoh lagu kedua" },
      { time: 4000, text: "Untuk menunjukkan konten berbeda" },
      { time: 8000, text: "Dengan pola waktu yang berbeda" },
      { time: 12000, text: "Dan struktur lirik yang beragam" },
      { time: 16000, text: "Aplikasi menangani beberapa lagu" },
      { time: 20000, text: "Dengan transisi yang mulus" },
      { time: 24000, text: "Fungsi pencarian bekerja sempurna" },
      { time: 28000, text: "Dan lirik bergulir otomatis" },
      { time: 32000, text: "Dengan highlight baris saat ini" },
      { time: 36000, text: "Tampilan berwarna yang indah" },
      { time: 40000, text: "Beberapa tema untuk dipilih" },
      { time: 44000, text: "Klasik, transparan, neon, minimal" },
      { time: 48000, text: "Masing-masing dengan gaya unik" },
      { time: 52000, text: "Pengaturan transparansi yang bisa diatur" },
      { time: 56000, text: "Fungsi pin dan drag yang mudah" },
      { time: 60000, text: "Pengganti MiniLyrics yang sempurna 🎼" }
    ]
  }
};

// Theme configurations
const themes = {
  classic: {
    name: "Classic",
    primary: "#1a1a1a",
    secondary: "#2d2d2d", 
    accent: "#1db954",
    text: "#ffffff",
    textSecondary: "#b3b3b3",
    background: "linear-gradient(135deg, #000000 0%, #1a1a1a 100%)",
    lyricsBackground: "rgba(0, 0, 0, 0.9)",
    playerBackground: "rgba(20, 20, 20, 0.95)",
    border: "#333333"
  },
  neon: {
    name: "Neon",
    primary: "#0a0a0a",
    secondary: "#1a1a2e",
    accent: "#00f5ff",
    text: "#ffffff",
    textSecondary: "#a0a0a0", 
    background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)",
    lyricsBackground: "rgba(26, 26, 46, 0.9)",
    playerBackground: "rgba(26, 26, 46, 0.95)",
    border: "#00f5ff"
  }
};

// Floating Lyrics Component
export const FloatingLyrics = ({ theme, lyrics, currentPosition, isVisible, onClose, onPin, isPinned, opacity }) => {
  const [currentLyricIndex, setCurrentLyricIndex] = useState(0);
  const lyricsRef = useRef(null);

  useEffect(() => {
    const currentIndex = lyrics.findIndex((lyric, index) => {
      const nextLyric = lyrics[index + 1];
      return currentPosition >= lyric.time && (!nextLyric || currentPosition < nextLyric.time);
    });
    
    if (currentIndex !== -1) {
      setCurrentLyricIndex(currentIndex);
    }
  }, [currentPosition, lyrics]);

  if (!isVisible) return null;

  return (
    <Draggable handle=".drag-handle" disabled={isPinned}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: opacity, scale: 1 }}
        className="fixed z-50 shadow-2xl rounded-lg overflow-hidden"
        style={{ 
          background: theme.lyricsBackground,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${theme.border}`,
          minWidth: '400px',
          maxWidth: '600px',
          top: '50px',
          left: '50px'
        }}
      >
        {/* Header */}
        <div 
          className="drag-handle flex items-center justify-between p-3 cursor-move"
          style={{ backgroundColor: theme.secondary }}
        >
          <div className="flex items-center space-x-2">
            <Music size={16} style={{ color: theme.accent }} />
            <span className="text-sm font-semibold" style={{ color: theme.text }}>
              MiniLyrics untuk Spotify
            </span>
          </div>
          
          <div className="flex items-center space-x-1">
            <button
              onClick={onPin}
              className={`p-1.5 rounded transition-colors ${isPinned ? 'bg-blue-600' : 'hover:bg-gray-600'}`}
              title={isPinned ? 'Lepas pin' : 'Pin ke atas'}
            >
              <Pin size={12} style={{ color: isPinned ? '#ffffff' : theme.textSecondary }} />
            </button>
            
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-red-600 rounded transition-colors"
              title="Tutup"
            >
              <X size={12} style={{ color: theme.textSecondary }} />
            </button>
          </div>
        </div>

        {/* Lyrics Content */}
        <div className="p-6">
          <div 
            ref={lyricsRef}
            className="max-h-96 overflow-y-auto scrollbar-thin"
            style={{ minHeight: '300px' }}
          >
            {lyrics.map((lyric, index) => (
              <motion.div
                key={index}
                animate={{ 
                  opacity: index === currentLyricIndex ? 1 : 0.6,
                  scale: index === currentLyricIndex ? 1.05 : 1,
                  color: index === currentLyricIndex ? theme.accent : theme.text
                }}
                className="text-center py-3 px-4 rounded-lg transition-all duration-500"
                style={{ 
                  fontSize: index === currentLyricIndex ? '1.2rem' : '1rem',
                  fontWeight: index === currentLyricIndex ? 'bold' : 'normal',
                  backgroundColor: index === currentLyricIndex ? `${theme.accent}20` : 'transparent'
                }}
              >
                {lyric.text}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </Draggable>
  );
};

// Control Panel Component  
export const ControlPanel = ({ theme, onSongSelect, onThemeChange, onToggleLyrics, onToggleSettings, isLyricsVisible, isSettingsVisible, opacity, onOpacityChange }) => {
  const [selectedSong, setSelectedSong] = useState('Sample Song 1');
  const [showSearch, setShowSearch] = useState(false);

  const handleSongSelect = (songKey) => {
    setSelectedSong(songKey);
    onSongSelect(songKey);
    setShowSearch(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-6 right-6 z-40 rounded-lg shadow-2xl"
      style={{ 
        background: theme.playerBackground,
        backdropFilter: 'blur(10px)',
        border: `1px solid ${theme.border}`,
        width: '350px'
      }}
    >
      <div className="p-6">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold mb-2" style={{ color: theme.text }}>
            🎵 MiniLyrics
          </h2>
          <p className="text-sm" style={{ color: theme.textSecondary }}>
            Penampil lirik mengambang untuk Spotify
          </p>
        </div>

        <div className="space-y-4">
          {/* Song Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold" style={{ color: theme.text }}>
                Lagu Saat Ini:
              </span>
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="text-sm px-3 py-1.5 rounded-full transition-colors font-medium"
                style={{ 
                  backgroundColor: theme.accent,
                  color: theme.primary
                }}
              >
                <Search size={14} className="inline mr-1" />
                Ganti Lagu
              </button>
            </div>

            {showSearch && (
              <div className="mb-4 p-4 rounded-lg border" style={{ borderColor: theme.border, backgroundColor: theme.secondary }}>
                {Object.keys(lyricsDatabase).map((songKey) => (
                  <div
                    key={songKey}
                    onClick={() => handleSongSelect(songKey)}
                    className="p-3 mb-2 rounded cursor-pointer hover:bg-opacity-80 transition-colors"
                    style={{ 
                      backgroundColor: selectedSong === songKey ? theme.accent + '30' : theme.primary,
                      border: `1px solid ${theme.border}`
                    }}
                  >
                    <div className="font-medium text-sm" style={{ color: theme.text }}>
                      {songKey}
                    </div>
                    <div className="text-xs" style={{ color: theme.textSecondary }}>
                      {lyricsDatabase[songKey].artist}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="text-sm p-3 rounded" style={{ backgroundColor: theme.secondary, color: theme.textSecondary }}>
              <strong style={{ color: theme.text }}>{selectedSong}</strong><br/>
              oleh {lyricsDatabase[selectedSong]?.artist}
            </div>
          </div>

          {/* Controls */}
          <div className="flex space-x-3">
            <button
              onClick={onToggleLyrics}
              className="flex-1 px-4 py-3 rounded-lg text-sm font-semibold transition-colors"
              style={{
                backgroundColor: isLyricsVisible ? '#10b981' : '#6b7280',
                color: '#ffffff'
              }}
            >
              {isLyricsVisible ? <EyeOff size={16} className="inline mr-2" /> : <Eye size={16} className="inline mr-2" />}
              {isLyricsVisible ? 'Sembunyikan' : 'Tampilkan'}
            </button>
            
            <button
              onClick={onToggleSettings}
              className="px-4 py-3 rounded-lg text-sm font-semibold transition-colors"
              style={{ 
                backgroundColor: isSettingsVisible ? theme.accent : theme.secondary,
                color: isSettingsVisible ? theme.primary : theme.text
              }}
            >
              <Settings size={16} />
            </button>
          </div>

          {/* Settings */}
          {isSettingsVisible && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-4 p-4 rounded-lg" 
              style={{ backgroundColor: theme.secondary }}
            >
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: theme.text }}>
                  Tema:
                </label>
                <select
                  onChange={(e) => onThemeChange(e.target.value)}
                  className="w-full p-2.5 rounded-lg text-sm"
                  style={{ 
                    backgroundColor: theme.primary,
                    color: theme.text,
                    border: `1px solid ${theme.border}`
                  }}
                >
                  {Object.entries(themes).map(([key, themeOption]) => (
                    <option key={key} value={key}>{themeOption.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: theme.text }}>
                  Transparansi: {Math.round(opacity * 100)}%
                </label>
                <input
                  type="range"
                  min="0.3"
                  max="1"
                  step="0.1"
                  value={opacity}
                  onChange={(e) => onOpacityChange(parseFloat(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, ${theme.accent} 0%, ${theme.accent} ${opacity * 100}%, #4a4a4a ${opacity * 100}%, #4a4a4a 100%)`
                  }}
                />
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Main MiniLyrics Component
export const MiniLyrics = () => {
  const [currentTheme, setCurrentTheme] = useState('classic');
  const [selectedSong, setSelectedSong] = useState('Sample Song 1');
  const [isLyricsVisible, setIsLyricsVisible] = useState(true);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [opacity, setOpacity] = useState(0.95);
  const [position, setPosition] = useState(0);

  const theme = themes[currentTheme];
  const currentLyrics = lyricsDatabase[selectedSong]?.lyrics || [];
  const intervalRef = useRef(null);

  // Simulate playback progress
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setPosition(prev => {
        const maxTime = currentLyrics.length > 0 ? currentLyrics[currentLyrics.length - 1].time + 5000 : 80000;
        const newPosition = prev + 1000;
        return newPosition >= maxTime ? 0 : newPosition;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [currentLyrics]);

  const handleSongSelect = (songKey) => {
    setSelectedSong(songKey);
    setPosition(0);
  };

  return (
    <div className="relative min-h-screen" style={{ background: theme.background }}>
      {/* Background */}
      <div 
        className="fixed inset-0 z-0"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1453090927415-5f45085b65c0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzh8MHwxfHNlYXJjaHwxfHxkYXJrJTIwbXVzaWN8ZW58MHx8fGJsYWNrfDE3NTI1NzExNTh8MA&ixlib=rb-4.1.0&q=85')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.2
        }}
      />

      {/* Floating Lyrics */}
      <AnimatePresence>
        <FloatingLyrics
          theme={theme}
          lyrics={currentLyrics}
          currentPosition={position}
          isVisible={isLyricsVisible}
          onClose={() => setIsLyricsVisible(false)}
          onPin={() => setIsPinned(!isPinned)}
          isPinned={isPinned}
          opacity={opacity}
        />
      </AnimatePresence>

      {/* Control Panel */}
      <ControlPanel
        theme={theme}
        onSongSelect={handleSongSelect}
        onThemeChange={setCurrentTheme}
        onToggleLyrics={() => setIsLyricsVisible(!isLyricsVisible)}
        onToggleSettings={() => setIsSettingsVisible(!isSettingsVisible)}
        isLyricsVisible={isLyricsVisible}
        isSettingsVisible={isSettingsVisible}
        opacity={opacity}
        onOpacityChange={setOpacity}
      />
    </div>
  );
};

export { themes, lyricsDatabase };

// Theme configurations
const themes = {
  classic: {
    name: "Classic",
    primary: "#1a1a1a",
    secondary: "#2d2d2d",
    accent: "#1db954",
    text: "#ffffff",
    textSecondary: "#b3b3b3",
    background: "linear-gradient(135deg, #000000 0%, #1a1a1a 100%)",
    lyricsBackground: "rgba(0, 0, 0, 0.9)",
    playerBackground: "rgba(20, 20, 20, 0.95)",
    border: "#333333"
  },
  translucent: {
    name: "Translucent",
    primary: "rgba(26, 26, 26, 0.8)",
    secondary: "rgba(45, 45, 45, 0.8)",
    accent: "#1db954",
    text: "#ffffff",
    textSecondary: "#b3b3b3",
    background: "linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(26, 26, 26, 0.7) 100%)",
    lyricsBackground: "rgba(0, 0, 0, 0.6)",
    playerBackground: "rgba(20, 20, 20, 0.7)",
    border: "rgba(51, 51, 51, 0.8)"
  },
  neon: {
    name: "Neon",
    primary: "#0a0a0a",
    secondary: "#1a1a2e",
    accent: "#00f5ff",
    text: "#ffffff",
    textSecondary: "#a0a0a0",
    background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)",
    lyricsBackground: "rgba(26, 26, 46, 0.9)",
    playerBackground: "rgba(26, 26, 46, 0.95)",
    border: "#00f5ff"
  },
  minimal: {
    name: "Minimal",
    primary: "#ffffff",
    secondary: "#f5f5f5",
    accent: "#1db954",
    text: "#000000",
    textSecondary: "#666666",
    background: "linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)",
    lyricsBackground: "rgba(255, 255, 255, 0.95)",
    playerBackground: "rgba(255, 255, 255, 0.98)",
    border: "#e0e0e0"
  }
};

// Song Search Component
export const SongSearch = ({ onSongSelect, theme }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    
    // Simulate search delay
    setTimeout(() => {
      const results = Object.keys(lyricsDatabase).filter(song => 
        song.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lyricsDatabase[song].artist.toLowerCase().includes(searchTerm.toLowerCase())
      ).map(song => ({
        title: song,
        artist: lyricsDatabase[song].artist,
        key: song
      }));
      
      setSearchResults(results);
      setIsSearching(false);
    }, 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex space-x-2">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Search for songs or artists..."
          className="flex-1 px-3 py-2 rounded text-sm"
          style={{ 
            backgroundColor: theme.secondary,
            color: theme.text,
            border: `1px solid ${theme.border}`
          }}
        />
        <button
          onClick={handleSearch}
          disabled={isSearching}
          className="px-4 py-2 rounded text-sm font-medium transition-colors"
          style={{ 
            backgroundColor: theme.accent,
            color: theme.primary
          }}
        >
          {isSearching ? <RefreshCw size={16} className="animate-spin" /> : <Search size={16} />}
        </button>
      </div>

      {searchResults.length > 0 && (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {searchResults.map((result, index) => (
            <div
              key={index}
              onClick={() => onSongSelect(result.key)}
              className="p-3 rounded cursor-pointer hover:bg-opacity-80 transition-colors"
              style={{ 
                backgroundColor: theme.secondary,
                border: `1px solid ${theme.border}`
              }}
            >
              <div className="font-medium text-sm" style={{ color: theme.text }}>
                {result.title}
              </div>
              <div className="text-xs" style={{ color: theme.textSecondary }}>
                {result.artist}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Floating Lyrics Display Component
export const FloatingLyricsDisplay = ({ theme, lyrics, currentPosition, isVisible, onClose, onPin, isPinned, opacity }) => {
  const [currentLyricIndex, setCurrentLyricIndex] = useState(0);
  const lyricsRef = useRef(null);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    const currentIndex = lyrics.findIndex((lyric, index) => {
      const nextLyric = lyrics[index + 1];
      return currentPosition >= lyric.time && (!nextLyric || currentPosition < nextLyric.time);
    });
    
    if (currentIndex !== -1) {
      setCurrentLyricIndex(currentIndex);
    }
  }, [currentPosition, lyrics]);

  useEffect(() => {
    if (lyricsRef.current && !isMinimized) {
      const currentElement = lyricsRef.current.children[currentLyricIndex];
      if (currentElement) {
        currentElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }
  }, [currentLyricIndex, isMinimized]);

  if (!isVisible) return null;

  return (
    <Draggable
      handle=".drag-handle"
      bounds="parent"
      disabled={isPinned}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: opacity, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed z-50 shadow-2xl rounded-lg overflow-hidden"
        style={{ 
          background: theme.lyricsBackground,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${theme.border}`,
          minWidth: '320px',
          maxWidth: '500px',
          top: '20px',
          left: '20px'
        }}
      >
        {/* Header */}
        <div 
          className="drag-handle flex items-center justify-between p-2 cursor-move"
          style={{ backgroundColor: theme.secondary }}
        >
          <div className="flex items-center space-x-2">
            <Music size={16} style={{ color: theme.accent }} />
            <span className="text-sm font-medium" style={{ color: theme.text }}>
              MiniLyrics
            </span>
          </div>
          
          <div className="flex items-center space-x-1">
            <button
              onClick={onPin}
              className={`p-1 rounded transition-colors ${isPinned ? 'bg-blue-600' : 'hover:bg-gray-600'}`}
              title={isPinned ? 'Unpin' : 'Pin to top'}
            >
              <Pin size={12} style={{ color: isPinned ? '#ffffff' : theme.textSecondary }} />
            </button>
            
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 hover:bg-gray-600 rounded transition-colors"
              title={isMinimized ? 'Restore' : 'Minimize'}
            >
              {isMinimized ? <Maximize2 size={12} /> : <Minimize2 size={12} />}
            </button>
            
            <button
              onClick={onClose}
              className="p-1 hover:bg-red-600 rounded transition-colors"
              title="Close"
            >
              <X size={12} style={{ color: theme.textSecondary }} />
            </button>
          </div>
        </div>

        {/* Content */}
        {!isMinimized && (
          <div className="p-4">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold mb-1" style={{ color: theme.text }}>
                Current Song
              </h3>
              <p className="text-sm" style={{ color: theme.textSecondary }}>
                Auto-detecting from Spotify...
              </p>
            </div>

            <div 
              ref={lyricsRef}
              className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
              style={{ minHeight: '200px' }}
            >
              {lyrics.map((lyric, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0.5 }}
                  animate={{ 
                    opacity: index === currentLyricIndex ? 1 : 0.6,
                    scale: index === currentLyricIndex ? 1.02 : 1,
                    color: index === currentLyricIndex ? theme.accent : theme.text
                  }}
                  className="text-center py-2 px-4 rounded-lg transition-all duration-300"
                  style={{ 
                    fontSize: index === currentLyricIndex ? '1.1rem' : '1rem',
                    fontWeight: index === currentLyricIndex ? 'bold' : 'normal',
                    backgroundColor: index === currentLyricIndex ? `${theme.accent}20` : 'transparent'
                  }}
                >
                  {lyric.text}
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </Draggable>
  );
};

// Main Control Panel
export const ControlPanel = ({ theme, onSongSelect, onThemeChange, onToggleLyrics, onToggleSettings, isLyricsVisible, isSettingsVisible, opacity, onOpacityChange }) => {
  const [selectedSong, setSelectedSong] = useState('Sample Song 1');
  const [showSearch, setShowSearch] = useState(false);

  const handleSongSelect = (songKey) => {
    setSelectedSong(songKey);
    onSongSelect(songKey);
    setShowSearch(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 right-4 z-40 rounded-lg shadow-2xl"
      style={{ 
        background: theme.playerBackground,
        backdropFilter: 'blur(10px)',
        border: `1px solid ${theme.border}`,
        width: '320px'
      }}
    >
      <div className="p-4">
        <div className="text-center mb-4">
          <h2 className="text-lg font-semibold mb-2" style={{ color: theme.text }}>
            MiniLyrics for Spotify
          </h2>
          <p className="text-xs" style={{ color: theme.textSecondary }}>
            Floating lyrics display
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium" style={{ color: theme.text }}>
              Current Song:
            </span>
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="text-sm px-3 py-1 rounded transition-colors"
              style={{ 
                backgroundColor: theme.accent,
                color: theme.primary
              }}
            >
              <Search size={14} className="inline mr-1" />
              Change Song
            </button>
          </div>

          {showSearch && (
            <div className="border rounded-lg" style={{ borderColor: theme.border }}>
              <SongSearch onSongSelect={handleSongSelect} theme={theme} />
            </div>
          )}

          <div className="text-sm" style={{ color: theme.textSecondary }}>
            <strong style={{ color: theme.text }}>{selectedSong}</strong> by {lyricsDatabase[selectedSong]?.artist}
          </div>

          <div className="flex space-x-2">
            <button
              onClick={onToggleLyrics}
              className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-colors ${
                isLyricsVisible ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-300'
              }`}
            >
              {isLyricsVisible ? <EyeOff size={16} className="inline mr-1" /> : <Eye size={16} className="inline mr-1" />}
              {isLyricsVisible ? 'Hide Lyrics' : 'Show Lyrics'}
            </button>
            
            <button
              onClick={onToggleSettings}
              className="px-3 py-2 rounded text-sm font-medium transition-colors"
              style={{ 
                backgroundColor: isSettingsVisible ? theme.accent : theme.secondary,
                color: isSettingsVisible ? theme.primary : theme.text
              }}
            >
              <Settings size={16} />
            </button>
          </div>

          {isSettingsVisible && (
            <div className="space-y-3 p-3 rounded" style={{ backgroundColor: theme.secondary }}>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: theme.text }}>
                  Theme
                </label>
                <select
                  onChange={(e) => onThemeChange(e.target.value)}
                  className="w-full p-2 rounded text-sm"
                  style={{ 
                    backgroundColor: theme.primary,
                    color: theme.text,
                    border: `1px solid ${theme.border}`
                  }}
                >
                  {Object.entries(themes).map(([key, theme]) => (
                    <option key={key} value={key}>{theme.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: theme.text }}>
                  Opacity: {Math.round(opacity * 100)}%
                </label>
                <input
                  type="range"
                  min="0.3"
                  max="1"
                  step="0.1"
                  value={opacity}
                  onChange={(e) => onOpacityChange(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Main MiniLyrics Component
export const MiniLyrics = () => {
  const [currentTheme, setCurrentTheme] = useState('classic');
  const [selectedSong, setSelectedSong] = useState('Sample Song 1');
  const [isLyricsVisible, setIsLyricsVisible] = useState(true);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [opacity, setOpacity] = useState(0.9);
  const [position, setPosition] = useState(0);

  const theme = themes[currentTheme];
  const currentLyrics = lyricsDatabase[selectedSong]?.lyrics || [];
  const intervalRef = useRef(null);

  // Simulate playback progress
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setPosition(prev => {
        const maxTime = currentLyrics.length > 0 ? currentLyrics[currentLyrics.length - 1].time + 5000 : 80000;
        const newPosition = prev + 1000;
        return newPosition >= maxTime ? 0 : newPosition;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [currentLyrics]);

  const handleSongSelect = (songKey) => {
    setSelectedSong(songKey);
    setPosition(0);
  };

  const handleThemeChange = (newTheme) => {
    setCurrentTheme(newTheme);
  };

  const handleToggleLyrics = () => {
    setIsLyricsVisible(!isLyricsVisible);
  };

  const handleToggleSettings = () => {
    setIsSettingsVisible(!isSettingsVisible);
  };

  const handlePin = () => {
    setIsPinned(!isPinned);
  };

  const handleCloseLyrics = () => {
    setIsLyricsVisible(false);
  };

  return (
    <div className="relative min-h-screen" style={{ background: theme.background }}>
      {/* Background */}
      <div 
        className="fixed inset-0 z-0"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1453090927415-5f45085b65c0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzh8MHwxfHNlYXJjaHwxfHxkYXJrJTIwbXVzaWN8ZW58MHx8fGJsYWNrfDE3NTI1NzExNTh8MA&ixlib=rb-4.1.0&q=85')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.3
        }}
      />

      {/* Floating Lyrics Display */}
      <AnimatePresence>
        <FloatingLyricsDisplay
          theme={theme}
          lyrics={currentLyrics}
          currentPosition={position}
          isVisible={isLyricsVisible}
          onClose={handleCloseLyrics}
          onPin={handlePin}
          isPinned={isPinned}
          opacity={opacity}
        />
      </AnimatePresence>

      {/* Control Panel */}
      <ControlPanel
        theme={theme}
        onSongSelect={handleSongSelect}
        onThemeChange={handleThemeChange}
        onToggleLyrics={handleToggleLyrics}
        onToggleSettings={handleToggleSettings}
        isLyricsVisible={isLyricsVisible}
        isSettingsVisible={isSettingsVisible}
        opacity={opacity}
        onOpacityChange={setOpacity}
      />
    </div>
  );
};

export { themes, lyricsDatabase };