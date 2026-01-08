import { useState, useEffect } from 'react';
import KanaTable from './KanaTable';

const TABS = [
  { id: 'practice', label: 'Practice' },
  { id: 'hiragana', label: 'Hiragana' },
  { id: 'katakana', label: 'Katakana' },
];

const SCRIPT_OPTIONS = [
  { id: 'hiragana', label: 'Hiragana', description: 'ひらがな' },
  { id: 'katakana', label: 'Katakana', description: 'カタカナ' },
];

const CHARSET_OPTIONS = [
  { id: 'basic', label: 'Basic', description: '46 base characters (gojūon)' },
  { id: 'voiced', label: 'Voiced', description: 'Dakuten & handakuten (が, ぱ, etc.)' },
  { id: 'combos', label: 'Combos', description: 'Yōon combinations (きゃ, しゅ, etc.)' },
  { id: 'extended', label: 'Extended', description: 'Foreign loanwords (Katakana only)', katakanaOnly: true },
];

export default function Settings({ onStart, savedSettings }) {
  const [activeTab, setActiveTab] = useState('practice');
  const [scripts, setScripts] = useState(savedSettings?.scripts || []);
  const [charSets, setCharSets] = useState(savedSettings?.charSets || []);

  const hasKatakana = scripts.includes('katakana');
  const canStart = scripts.length > 0 && charSets.length > 0;

  useEffect(() => {
    if (!hasKatakana && charSets.includes('extended')) {
      setCharSets(charSets.filter((c) => c !== 'extended'));
    }
  }, [hasKatakana, charSets]);

  const toggleScript = (scriptId) => {
    setScripts((prev) =>
      prev.includes(scriptId)
        ? prev.filter((s) => s !== scriptId)
        : [...prev, scriptId]
    );
  };

  const toggleCharSet = (charSetId) => {
    setCharSets((prev) =>
      prev.includes(charSetId)
        ? prev.filter((c) => c !== charSetId)
        : [...prev, charSetId]
    );
  };

  const handleStart = (mode) => {
    if (canStart) {
      onStart({ scripts, charSets, mode });
    }
  };

  // Render Kana reference tables
  if (activeTab === 'hiragana' || activeTab === 'katakana') {
    return (
      <div className="min-h-screen bg-[#2a2e30] text-white flex flex-col">
        <div className="flex justify-center gap-2 p-4 border-b border-gray-800">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-cyan-800/50 text-cyan-100'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-auto">
          <KanaTable type={activeTab} />
        </div>
      </div>
    );
  }

  // Render Practice settings
  return (
    <div className="min-h-screen bg-[#2a2e30] text-white flex flex-col">
      <div className="flex justify-center gap-2 p-4 border-b border-gray-800">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-cyan-800/50 text-cyan-100'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full">
          <h1 className="text-5xl font-bold text-center mb-2">Kiru</h1>
          <p className="text-gray-400 text-center mb-10">
            切る — Cut through kana, one character at a time
          </p>

          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3 text-gray-300">Script</h2>
            <div className="flex gap-3">
              {SCRIPT_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => toggleScript(option.id)}
                  className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                    scripts.includes(option.id)
                      ? 'border-cyan-400 bg-cyan-400/10'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <div className="font-medium">{option.label}</div>
                  <div className="text-gray-400 text-sm">{option.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-lg font-semibold mb-3 text-gray-300">Character Sets</h2>
            <div className="grid grid-cols-2 gap-3">
              {CHARSET_OPTIONS.map((option) => {
                const isDisabled = option.katakanaOnly && !hasKatakana;
                return (
                  <button
                    key={option.id}
                    onClick={() => !isDisabled && toggleCharSet(option.id)}
                    disabled={isDisabled}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      isDisabled
                        ? 'border-gray-700 opacity-40 cursor-not-allowed'
                        : charSets.includes(option.id)
                        ? 'border-cyan-400 bg-cyan-400/10'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <div className="font-medium">{option.label}</div>
                    <div className="text-gray-400 text-xs mt-1">{option.description}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => handleStart('practice')}
            disabled={!canStart}
            className={`w-full py-4 rounded-lg font-semibold text-lg transition-all ${
              canStart
                ? 'bg-cyan-800/50 hover:bg-cyan-700/60 text-cyan-100'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
          >
            Practice
          </button>

          {!canStart && (
            <p className="text-gray-500 text-center text-sm mt-3">
              Select at least one script and one character set
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
