import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Draggable from 'react-draggable';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  Settings, 
  Heart,
  Minimize2,
  Maximize2,
  X,
  Search,
  Music,
  Pin,
  Eye,
  EyeOff,
  RefreshCw,
  Download
} from 'lucide-react';

// Mock lyrics data for demonstration
const lyricsDatabase = {
  "Sample Song 1": {
    artist: "Demo Artist",
    lyrics: [
      { time: 0, text: "This is a sample lyric line" },
      { time: 3000, text: "Demonstrating the floating display" },
      { time: 6000, text: "With synchronized timing and scrolling" },
      { time: 10000, text: "Just like the original MiniLyrics" },
      { time: 15000, text: "You can change songs from the menu" },
      { time: 18000, text: "And adjust themes and opacity" },
      { time: 21000, text: "The window can be dragged around" },
      { time: 25000, text: "And pinned to stay on top" },
      { time: 30000, text: "Perfect for Spotify users" },
      { time: 35000, text: "Who want floating lyrics display" },
      { time: 38000, text: "With modern design and features" },
      { time: 41000, text: "Built with React and Framer Motion" },
      { time: 45000, text: "Responsive and customizable" },
      { time: 48000, text: "Just like the classic MiniLyrics" },
      { time: 51000, text: "But with modern web technology" },
      { time: 55000, text: "And beautiful animations" },
      { time: 60000, text: "Ready for Spotify integration" },
      { time: 65000, text: "With real-time lyrics sync" },
      { time: 70000, text: "Perfect replacement solution" },
      { time: 75000, text: "For modern music lovers" }
    ]
  },
  "Sample Song 2": {
    artist: "Another Demo Artist",
    lyrics: [
      { time: 0, text: "Here's another sample track" },
      { time: 4000, text: "To show different content" },
      { time: 8000, text: "With different timing patterns" },
      { time: 12000, text: "And various lyric structures" },
      { time: 16000, text: "The application handles multiple songs" },
      { time: 20000, text: "With smooth transitions between them" },
      { time: 24000, text: "Search functionality works perfectly" },
      { time: 28000, text: "And lyrics scroll automatically" },
      { time: 32000, text: "With highlighted current lines" },
      { time: 36000, text: "Beautiful color-coded display" },
      { time: 40000, text: "Multiple themes to choose from" },
      { time: 44000, text: "Classic, translucent, neon, minimal" },
      { time: 48000, text: "Each with unique styling" },
      { time: 52000, text: "Adjustable opacity settings" },
      { time: 56000, text: "Pin and drag functionality" },
      { time: 60000, text: "Perfect MiniLyrics replacement" }
    ]
  },
  "Sample Song 3": {
    artist: "Third Demo Artist",
    lyrics: [
      { time: 0, text: "Third demonstration track" },
      { time: 4000, text: "Shows variety in content" },
      { time: 8000, text: "Different lyric timing patterns" },
      { time: 12000, text: "Smooth scrolling animations" },
      { time: 16000, text: "Real-time highlight effects" },
      { time: 20000, text: "Customizable appearance options" },
      { time: 24000, text: "Draggable floating window" },
      { time: 28000, text: "Always-on-top functionality" },
      { time: 32000, text: "Modern web-based solution" },
      { time: 36000, text: "Compatible with all browsers" },
      { time: 40000, text: "Responsive design for all screens" },
      { time: 44000, text: "Easy to use interface" },
      { time: 48000, text: "Built for Spotify users" },
      { time: 52000, text: "Perfect lyrics display solution" }
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
  const [selectedSong, setSelectedSong] = useState('Blinding Lights');
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