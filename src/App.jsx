import { useState } from 'react';
import Settings from './components/Settings';
import Game from './components/Game';
import Summary from './components/Summary';

const SCREENS = {
  SETTINGS: 'settings',
  GAME: 'game',
  SUMMARY: 'summary',
};

export default function App() {
  const [screen, setScreen] = useState(SCREENS.SETTINGS);
  const [settings, setSettings] = useState(null);
  const [gameStats, setGameStats] = useState(null);

  const handleStart = (newSettings) => {
    setSettings(newSettings);
    setScreen(SCREENS.GAME);
  };

  const handleQuit = (stats) => {
    setGameStats(stats);
    setScreen(SCREENS.SUMMARY);
  };

  const handlePlayAgain = () => {
    setScreen(SCREENS.GAME);
  };

  const handleReset = () => {
    setSettings(null);
    setScreen(SCREENS.SETTINGS);
  };

  return (
    <>
      {screen === SCREENS.SETTINGS && (
        <Settings onStart={handleStart} savedSettings={settings} />
      )}
      {screen === SCREENS.GAME && (
        <Game settings={settings} onQuit={handleQuit} />
      )}
      {screen === SCREENS.SUMMARY && (
        <Summary
          stats={gameStats}
          onPlayAgain={handlePlayAgain}
          onReset={handleReset}
        />
      )}
    </>
  );
}
