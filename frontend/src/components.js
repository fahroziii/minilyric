import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  RotateCcw,
  Shuffle,
  Repeat
} from 'lucide-react';

// Mock Spotify Data
const mockSpotifyData = {
  currentTrack: {
    name: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    duration: 200000, // 3:20 in milliseconds
    image: "https://i.scdn.co/image/ab67616d0000b2734c0f6fc3c887e1e9c5a24157",
    uri: "spotify:track:0VjIjW4GlUZAMYd2vXMi3b"
  },
  isPlaying: false,
  position: 0,
  volume: 0.8,
  shuffle: false,
  repeat: "off" // "off", "context", "track"
};

// Mock Lyrics Data with timestamps
const mockLyrics = [
  { time: 0, text: "Yeah, I've been tryna call" },
  { time: 3000, text: "I've been on my own for long enough" },
  { time: 6000, text: "Maybe you can show me how to love, maybe" },
  { time: 10000, text: "I feel like I'm just missing something when you're gone" },
  { time: 15000, text: "Yeah, I've been tryna call" },
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
  { time: 75000, text: "No, I can't sleep until I feel your touch" },
  { time: 80000, text: "I'm running out of time" },
  { time: 85000, text: "'Cause I can see the sun light up the sky" },
  { time: 90000, text: "So I hit the road in overdrive, baby, oh" },
  { time: 95000, text: "The city's cold and empty (Oh)" },
  { time: 100000, text: "No one's around to judge me (Oh)" },
  { time: 105000, text: "I can't see clearly when you're gone" },
  { time: 110000, text: "I said, ooh, I'm blinded by the lights" },
  { time: 115000, text: "No, I can't sleep until I feel your touch" },
  { time: 120000, text: "I said, ooh, I'm blinded by the lights" },
  { time: 125000, text: "No, I can't sleep until I feel your touch" }
];

// Theme configurations
const themes = {
  dark: {
    name: "Dark",
    primary: "#1a1a1a",
    secondary: "#2d2d2d",
    accent: "#1db954",
    text: "#ffffff",
    textSecondary: "#b3b3b3",
    background: "linear-gradient(135deg, #000000 0%, #1a1a1a 100%)",
    lyricsBackground: "rgba(0, 0, 0, 0.8)",
    playerBackground: "rgba(20, 20, 20, 0.95)"
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
    playerBackground: "rgba(26, 26, 46, 0.95)"
  },
  vintage: {
    name: "Vintage",
    primary: "#2d1b13",
    secondary: "#3d2b1f",
    accent: "#d4af37",
    text: "#f5f5dc",
    textSecondary: "#d4af37",
    background: "linear-gradient(135deg, #2d1b13 0%, #3d2b1f 100%)",
    lyricsBackground: "rgba(45, 27, 19, 0.9)",
    playerBackground: "rgba(61, 43, 31, 0.95)"
  },
  modern: {
    name: "Modern",
    primary: "#121212",
    secondary: "#282828",
    accent: "#1ed760",
    text: "#ffffff",
    textSecondary: "#b3b3b3",
    background: "linear-gradient(135deg, #121212 0%, #282828 100%)",
    lyricsBackground: "rgba(18, 18, 18, 0.9)",
    playerBackground: "rgba(40, 40, 40, 0.95)"
  }
};

// Mini Player Component
export const MiniPlayer = ({ theme, isPlaying, currentTrack, onPlayPause, onNext, onPrevious, position, duration, volume, onVolumeChange, shuffle, repeat, onShuffleToggle, onRepeatToggle }) => {
  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (position / duration) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-lg shadow-2xl"
      style={{ 
        background: theme.playerBackground,
        backdropFilter: 'blur(10px)',
        border: `1px solid ${theme.secondary}` 
      }}
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1602848597941-0d3d3a2c1241?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwxfHx2aW55bCUyMHJlY29yZHxlbnwwfHx8YmxhY2t8MTc1MjQ3ODE3OXww&ixlib=rb-4.1.0&q=85')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />

      <div className="relative z-10 p-4">
        {/* Track Info */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 rounded-lg overflow-hidden shadow-lg">
            <img 
              src={currentTrack.image} 
              alt={currentTrack.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate" style={{ color: theme.text }}>
              {currentTrack.name}
            </h3>
            <p className="text-xs truncate" style={{ color: theme.textSecondary }}>
              {currentTrack.artist}
            </p>
          </div>
          <button className="p-1 hover:bg-gray-600 rounded-full transition-colors">
            <Heart size={16} style={{ color: theme.textSecondary }} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs mb-1" style={{ color: theme.textSecondary }}>
            <span>{formatTime(position)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <div className="w-full bg-gray-600 rounded-full h-1">
            <div 
              className="h-1 rounded-full transition-all duration-300"
              style={{ 
                width: `${progressPercentage}%`,
                background: theme.accent
              }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={onShuffleToggle}
            className={`p-2 rounded-full transition-colors ${shuffle ? 'bg-gray-600' : 'hover:bg-gray-600'}`}
          >
            <Shuffle size={16} style={{ color: shuffle ? theme.accent : theme.textSecondary }} />
          </button>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={onPrevious}
              className="p-2 hover:bg-gray-600 rounded-full transition-colors"
            >
              <SkipBack size={18} style={{ color: theme.text }} />
            </button>
            
            <button 
              onClick={onPlayPause}
              className="p-3 rounded-full transition-colors"
              style={{ backgroundColor: theme.accent }}
            >
              {isPlaying ? <Pause size={20} color="black" /> : <Play size={20} color="black" />}
            </button>
            
            <button 
              onClick={onNext}
              className="p-2 hover:bg-gray-600 rounded-full transition-colors"
            >
              <SkipForward size={18} style={{ color: theme.text }} />
            </button>
          </div>

          <button 
            onClick={onRepeatToggle}
            className={`p-2 rounded-full transition-colors ${repeat !== 'off' ? 'bg-gray-600' : 'hover:bg-gray-600'}`}
          >
            <Repeat size={16} style={{ color: repeat !== 'off' ? theme.accent : theme.textSecondary }} />
          </button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center space-x-2">
          <Volume2 size={16} style={{ color: theme.textSecondary }} />
          <div className="flex-1">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="w-full h-1 bg-gray-600 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, ${theme.accent} 0%, ${theme.accent} ${volume * 100}%, #4a4a4a ${volume * 100}%, #4a4a4a 100%)`
              }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Lyrics Display Component
export const LyricsDisplay = ({ theme, lyrics, currentPosition, isVisible }) => {
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

  useEffect(() => {
    if (lyricsRef.current) {
      const currentElement = lyricsRef.current.children[currentLyricIndex];
      if (currentElement) {
        currentElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }
  }, [currentLyricIndex]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none"
    >
      <div 
        className="w-full max-w-2xl mx-4 rounded-lg shadow-2xl pointer-events-auto"
        style={{ 
          background: theme.lyricsBackground,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${theme.secondary}`
        }}
      >
        {/* Background Image */}
        <div 
          className="absolute inset-0 opacity-10 rounded-lg"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1635776062360-af423602aff3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NjZ8MHwxfHNlYXJjaHwxfHxncmFkaWVudCUyMHRleHR1cmV8ZW58MHx8fGJsYWNrfDE3NTI1NzExNjd8MA&ixlib=rb-4.1.0&q=85')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />

        <div className="relative z-10 p-6">
          <div className="text-center mb-4">
            <h2 className="text-lg font-semibold mb-1" style={{ color: theme.text }}>
              {mockSpotifyData.currentTrack.name}
            </h2>
            <p className="text-sm" style={{ color: theme.textSecondary }}>
              {mockSpotifyData.currentTrack.artist}
            </p>
          </div>

          <div 
            ref={lyricsRef}
            className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
          >
            {lyrics.map((lyric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0.5 }}
                animate={{ 
                  opacity: index === currentLyricIndex ? 1 : 0.5,
                  scale: index === currentLyricIndex ? 1.05 : 1,
                  color: index === currentLyricIndex ? theme.accent : theme.text
                }}
                className="text-center py-2 px-4 rounded-lg transition-all duration-300 cursor-pointer hover:bg-gray-700"
                style={{ 
                  fontSize: index === currentLyricIndex ? '1.125rem' : '1rem',
                  fontWeight: index === currentLyricIndex ? 'bold' : 'normal'
                }}
              >
                {lyric.text}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Theme Selector Component
export const ThemeSelector = ({ currentTheme, onThemeChange, isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">Choose Theme</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {Object.entries(themes).map(([key, theme]) => (
            <motion.button
              key={key}
              onClick={() => onThemeChange(key)}
              className={`p-4 rounded-lg border-2 transition-all ${
                currentTheme === key ? 'border-blue-500' : 'border-gray-600'
              }`}
              style={{ background: theme.background }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-center">
                <div className="w-full h-8 rounded mb-2" style={{ background: theme.accent }}></div>
                <p className="text-sm font-medium" style={{ color: theme.text }}>{theme.name}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

// Control Panel Component
export const ControlPanel = ({ theme, onToggleLyrics, onToggleSettings, isLyricsVisible, onMinimize, onMaximize, onClose, isMinimized }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-between p-2 border-b"
      style={{ borderColor: theme.secondary }}
    >
      <div className="flex items-center space-x-2">
        <motion.button
          onClick={onToggleLyrics}
          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
            isLyricsVisible ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-300'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Lyrics
        </motion.button>
        
        <motion.button
          onClick={onToggleSettings}
          className="p-1 hover:bg-gray-600 rounded transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Settings size={16} style={{ color: theme.textSecondary }} />
        </motion.button>
      </div>

      <div className="flex items-center space-x-1">
        <motion.button
          onClick={onMinimize}
          className="p-1 hover:bg-gray-600 rounded transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Minimize2 size={14} style={{ color: theme.textSecondary }} />
        </motion.button>
        
        <motion.button
          onClick={onMaximize}
          className="p-1 hover:bg-gray-600 rounded transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Maximize2 size={14} style={{ color: theme.textSecondary }} />
        </motion.button>
        
        <motion.button
          onClick={onClose}
          className="p-1 hover:bg-red-600 rounded transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X size={14} style={{ color: theme.textSecondary }} />
        </motion.button>
      </div>
    </motion.div>
  );
};

// Main MiniLyrics Component
export const MiniLyrics = () => {
  const [currentTheme, setCurrentTheme] = useState('dark');
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState('off');
  const [isLyricsVisible, setIsLyricsVisible] = useState(true);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const theme = themes[currentTheme];
  const intervalRef = useRef(null);

  // Simulate playback progress
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setPosition(prev => {
          const newPosition = prev + 1000;
          if (newPosition >= mockSpotifyData.currentTrack.duration) {
            setIsPlaying(false);
            return 0;
          }
          return newPosition;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isPlaying]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setPosition(0);
    // In a real app, this would change to the next track
  };

  const handlePrevious = () => {
    setPosition(0);
    // In a real app, this would change to the previous track
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
  };

  const handleShuffleToggle = () => {
    setShuffle(!shuffle);
  };

  const handleRepeatToggle = () => {
    const repeatModes = ['off', 'context', 'track'];
    const currentIndex = repeatModes.indexOf(repeat);
    const nextIndex = (currentIndex + 1) % repeatModes.length;
    setRepeat(repeatModes[nextIndex]);
  };

  const handleThemeChange = (newTheme) => {
    setCurrentTheme(newTheme);
    setIsSettingsVisible(false);
  };

  return (
    <div className="relative">
      {/* Background */}
      <div 
        className="fixed inset-0 z-0"
        style={{ background: theme.background }}
      >
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1453090927415-5f45085b65c0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzh8MHwxfHNlYXJjaHwxfHxkYXJrJTIwbXVzaWN8ZW58MHx8fGJsYWNrfDE3NTI1NzExNTh8MA&ixlib=rb-4.1.0&q=85')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
      </div>

      {/* Main Player Window */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ 
          opacity: 1, 
          scale: isMinimized ? 0.8 : 1,
          y: isMinimized ? 20 : 0 
        }}
        className="fixed top-4 right-4 z-30 w-80"
        style={{ 
          background: theme.primary,
          border: `1px solid ${theme.secondary}`,
          borderRadius: '8px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
        }}
      >
        <ControlPanel
          theme={theme}
          onToggleLyrics={() => setIsLyricsVisible(!isLyricsVisible)}
          onToggleSettings={() => setIsSettingsVisible(!isSettingsVisible)}
          isLyricsVisible={isLyricsVisible}
          onMinimize={() => setIsMinimized(!isMinimized)}
          onMaximize={() => setIsMinimized(false)}
          onClose={() => {}}
          isMinimized={isMinimized}
        />

        {!isMinimized && (
          <div className="p-4">
            <MiniPlayer
              theme={theme}
              isPlaying={isPlaying}
              currentTrack={mockSpotifyData.currentTrack}
              onPlayPause={handlePlayPause}
              onNext={handleNext}
              onPrevious={handlePrevious}
              position={position}
              duration={mockSpotifyData.currentTrack.duration}
              volume={volume}
              onVolumeChange={handleVolumeChange}
              shuffle={shuffle}
              repeat={repeat}
              onShuffleToggle={handleShuffleToggle}
              onRepeatToggle={handleRepeatToggle}
            />
          </div>
        )}
      </motion.div>

      {/* Lyrics Display */}
      <AnimatePresence>
        <LyricsDisplay
          theme={theme}
          lyrics={mockLyrics}
          currentPosition={position}
          isVisible={isLyricsVisible}
        />
      </AnimatePresence>

      {/* Theme Selector */}
      <AnimatePresence>
        <ThemeSelector
          currentTheme={currentTheme}
          onThemeChange={handleThemeChange}
          isVisible={isSettingsVisible}
          onClose={() => setIsSettingsVisible(false)}
        />
      </AnimatePresence>
    </div>
  );
};

export { themes, mockSpotifyData, mockLyrics };