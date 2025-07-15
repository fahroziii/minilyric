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

// Mock lyrics data for different songs
const lyricsDatabase = {
  "Blinding Lights": {
    artist: "The Weeknd",
    lyrics: [
      { time: 0, text: "Yeah, I've been trying to call" },
      { time: 3000, text: "I've been on my own for long enough" },
      { time: 6000, text: "Maybe you can show me how to love, maybe" },
      { time: 10000, text: "I feel like I'm just missing something when you're gone" },
      { time: 15000, text: "Yeah, I've been trying to call" },
      { time: 18000, text: "I've been on my own for long enough" },
      { time: 21000, text: "Maybe you can show me how to love, maybe" },
      { time: 25000, text: "I feel like I'm just missing something when you're gone" },
      { time: 30000, text: "And I feel like I'm just missing something when you're gone" },
      { time: 35000, text: "'Cause I wanna be in love" },
      { time: 38000, text: "And I wanna taste her" },
      { time: 41000, text: "And I wanna make her feel like she's mine" },
      { time: 45000, text: "And I wanna be in love" },
      { time: 48000, text: "And I wanna taste her" },
      { time: 51000, text: "And I wanna make her feel like she's mine" },
      { time: 55000, text: "I can't sleep until I feel your touch" },
      { time: 60000, text: "I said, ooh, I'm blinded by the lights" },
      { time: 65000, text: "No, I can't sleep until I feel your touch" },
      { time: 70000, text: "I said, ooh, I'm blinded by the lights" },
      { time: 75000, text: "No, I can't sleep until I feel your touch" }
    ]
  },
  "Shape of You": {
    artist: "Ed Sheeran",
    lyrics: [
      { time: 0, text: "The club isn't the best place to find a lover" },
      { time: 4000, text: "So the bar is where I go" },
      { time: 8000, text: "Me and my friends at the table doing shots" },
      { time: 12000, text: "Drinking fast and then we talk slow" },
      { time: 16000, text: "Come over and start up a conversation with just me" },
      { time: 20000, text: "And trust me I'll give it a chance now" },
      { time: 24000, text: "Take my hand, stop, put Van the Man on the jukebox" },
      { time: 28000, text: "And then we start to dance, and now I'm singing like" },
      { time: 32000, text: "Girl, you know I want your love" },
      { time: 36000, text: "Your love was handmade for somebody like me" },
      { time: 40000, text: "Come on now, follow my lead" },
      { time: 44000, text: "I may be crazy, don't mind me" },
      { time: 48000, text: "Say, boy, let's not talk too much" },
      { time: 52000, text: "Grab on my waist and put that body on me" },
      { time: 56000, text: "Come on now, follow my lead" },
      { time: 60000, text: "Come, come on now, follow my lead" }
    ]
  },
  "Bad Guy": {
    artist: "Billie Eilish",
    lyrics: [
      { time: 0, text: "White shirt now red, my bloody nose" },
      { time: 4000, text: "Sleepin', you're on your tippy toes" },
      { time: 8000, text: "Creepin' around like no one knows" },
      { time: 12000, text: "Think you're so criminal" },
      { time: 16000, text: "Bruises on both my knees for you" },
      { time: 20000, text: "Don't say thank you or please" },
      { time: 24000, text: "I do what I want when I'm wanting to" },
      { time: 28000, text: "My soul? So cynical" },
      { time: 32000, text: "So you're a tough guy" },
      { time: 34000, text: "Like it really rough guy" },
      { time: 36000, text: "Just can't get enough guy" },
      { time: 38000, text: "Chest always so puffed guy" },
      { time: 40000, text: "I'm that bad type" },
      { time: 42000, text: "Make your mama sad type" },
      { time: 44000, text: "Make your girlfriend mad tight" },
      { time: 46000, text: "Might seduce your dad type" },
      { time: 48000, text: "I'm the bad guy, duh" }
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
  const [selectedSong, setSelectedSong] = useState('Blinding Lights');
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