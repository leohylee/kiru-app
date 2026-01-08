import { useState, useEffect, useRef } from 'react';
import { getCharacterPool } from '../data/kana';

export default function Game({ settings, onQuit }) {
  const [characterPool] = useState(() => getCharacterPool(settings.scripts, settings.charSets));
  const [currentCard, setCurrentCard] = useState(null);
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [totalAttempted, setTotalAttempted] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [attemptedThisCard, setAttemptedThisCard] = useState(false);
  const [struggledCards, setStruggledCards] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [showSkipAnswer, setShowSkipAnswer] = useState(false);
  const [startTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const inputRef = useRef(null);
  const touchStartX = useRef(null);

  useEffect(() => {
    nextCard();
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, [currentCard]);

  // Update timer every second
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(Date.now() - startTime);
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  const nextCard = () => {
    const randomIndex = Math.floor(Math.random() * characterPool.length);
    setCurrentCard(characterPool[randomIndex]);
    setAttemptedThisCard(false);
    setShowSkipAnswer(false);
    setInput('');
  };

  const handleSkip = () => {
    if (!currentCard) return;

    // Show the answer briefly before moving on
    setShowSkipAnswer(true);
    setFeedback('skip');

    // Count as incorrect if not already attempted
    if (!attemptedThisCard) {
      setTotalAttempted((t) => t + 1);
      setStruggledCards((prev) => {
        if (!prev.find((c) => c.kana === currentCard.kana)) {
          return [...prev, currentCard];
        }
        return prev;
      });
    }

    setCurrentStreak(0);

    // Move to next card after showing the answer
    setTimeout(() => {
      setFeedback(null);
      nextCard();
    }, 1000);
  };

  // Keyboard shortcut for skip (Tab key)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Tab' && !showSkipAnswer) {
        e.preventDefault();
        handleSkip();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentCard, attemptedThisCard, showSkipAnswer]);

  const checkAnswer = (answer) => {
    const trimmed = answer.trim().toLowerCase();
    return currentCard.answers.some((a) => a.toLowerCase() === trimmed);
  };

  // Check if input could still potentially match any answer (prefix match)
  const couldMatchAnswer = (partialInput) => {
    const trimmed = partialInput.trim().toLowerCase();
    if (!trimmed) return true;
    return currentCard.answers.some((a) => a.toLowerCase().startsWith(trimmed));
  };

  const handleCorrect = () => {
    setFeedback('correct');
    setTimeout(() => setFeedback(null), 300);

    if (!attemptedThisCard) {
      setScore((s) => s + 1);
      setTotalAttempted((t) => t + 1);
    }

    const newStreak = currentStreak + 1;
    setCurrentStreak(newStreak);
    if (newStreak > bestStreak) {
      setBestStreak(newStreak);
    }

    nextCard();
  };

  const handleWrong = () => {
    setFeedback('wrong');
    setTimeout(() => setFeedback(null), 300);

    if (!attemptedThisCard) {
      setTotalAttempted((t) => t + 1);
      setAttemptedThisCard(true);
      setStruggledCards((prev) => {
        if (!prev.find((c) => c.kana === currentCard.kana)) {
          return [...prev, currentCard];
        }
        return prev;
      });
    }

    setCurrentStreak(0);
    setInput('');
  };

  // Auto-check for kana: wrong as soon as input doesn't match any prefix
  const handleInputChange = (e) => {
    const newInput = e.target.value;
    if (!currentCard || showSkipAnswer) return;

    setInput(newInput);

    if (!newInput.trim()) return;

    // Check if it's an exact match (correct answer)
    if (checkAnswer(newInput)) {
      handleCorrect();
      return;
    }

    // Check if input could still match (is a valid prefix)
    if (!couldMatchAnswer(newInput)) {
      handleWrong();
    }
  };

  // Keep Enter submit for future language flashcards
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || !currentCard) return;

    if (checkAnswer(input)) {
      handleCorrect();
    } else {
      handleWrong();
    }
  };

  const handleQuit = () => {
    onQuit({
      score,
      totalAttempted,
      bestStreak,
      struggledCards,
      duration: Date.now() - startTime,
    });
  };

  const accuracy = totalAttempted > 0 ? Math.round((score / totalAttempted) * 100) : 0;

  // Format elapsed time as MM:SS
  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Cards per minute rate
  const minutesElapsed = elapsedTime / 60000;
  const scoreRate = minutesElapsed > 0 ? (score / minutesElapsed).toFixed(1) : '0.0';

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white flex flex-col">
      <div className="flex justify-between items-center p-3 md:p-4 border-b border-gray-800">
        <div className="flex gap-3 md:gap-5 flex-wrap">
          <div>
            <span className="text-gray-400 text-xs md:text-sm">Score</span>
            <div className="text-lg md:text-xl font-bold">{score}</div>
          </div>
          <div>
            <span className="text-gray-400 text-xs md:text-sm">Accuracy</span>
            <div className="text-lg md:text-xl font-bold">{accuracy}%</div>
          </div>
          <div>
            <span className="text-gray-400 text-xs md:text-sm">Streak</span>
            <div className="text-lg md:text-xl font-bold">{currentStreak}</div>
          </div>
          <div>
            <span className="text-gray-400 text-xs md:text-sm">Time</span>
            <div className="text-lg md:text-xl font-bold font-mono">{formatTime(elapsedTime)}</div>
          </div>
          <div>
            <span className="text-gray-400 text-xs md:text-sm">Rate</span>
            <div className="text-lg md:text-xl font-bold">{scoreRate}<span className="text-xs text-gray-500">/min</span></div>
          </div>
        </div>
        <button
          onClick={handleQuit}
          className="px-3 py-2 md:px-4 text-gray-400 hover:text-white active:bg-gray-800 hover:bg-gray-800 rounded-lg transition-colors"
        >
          Quit
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div
          className={`text-[100px] md:text-[120px] font-sans mb-4 transition-all duration-200 ${
            feedback === 'correct'
              ? 'text-green-400 scale-105'
              : feedback === 'wrong'
              ? 'text-red-400'
              : feedback === 'skip'
              ? 'text-yellow-400'
              : ''
          }`}
          style={{ fontFamily: '"Noto Sans JP", sans-serif' }}
        >
          {currentCard?.kana}
        </div>

        {showSkipAnswer && (
          <div className="text-yellow-400 text-2xl mb-4 animate-pulse">
            {currentCard?.answers[0]}
          </div>
        )}

        {!showSkipAnswer && <div className="h-10 mb-4" />}

        <form onSubmit={handleSubmit} className="w-full max-w-xs">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Type romaji..."
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck="false"
            className={`w-full px-4 py-3 text-base md:text-xl text-center bg-gray-800 border-2 rounded-lg outline-none transition-all duration-200 ${
              feedback === 'wrong'
                ? 'border-red-500 animate-shake'
                : feedback === 'correct'
                ? 'border-green-500'
                : 'border-gray-600 focus:border-gray-400'
            }`}
            style={{ fontSize: '16px' }}
          />
          <p className="text-gray-500 text-center text-sm mt-3 hidden md:block">Press Enter to submit</p>
          <button
            type="button"
            onClick={handleSkip}
            disabled={showSkipAnswer}
            className="w-full mt-4 py-3 md:py-2 text-gray-400 bg-gray-800 active:bg-gray-700 hover:text-yellow-400 hover:bg-gray-700 rounded-lg transition-colors text-base md:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Skip<span className="hidden md:inline"> (Tab)</span>
          </button>
        </form>
      </div>

      <div className="p-4 text-center">
        <button
          onClick={handleQuit}
          className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
        >
          End Session
        </button>
      </div>
    </div>
  );
}
