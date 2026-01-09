import { useState, useEffect, useRef } from 'react';
import { getCharacterPool } from '../data/kana';

export default function Game({ settings, onQuit }) {
  const isSpeedrun = settings.mode === 'speedrun';
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
    let randomIndex;
    let nextCardCandidate;

    // Avoid showing the same card twice in a row (if pool has more than 1 card)
    if (characterPool.length > 1) {
      do {
        randomIndex = Math.floor(Math.random() * characterPool.length);
        nextCardCandidate = characterPool[randomIndex];
      } while (currentCard && nextCardCandidate.kana === currentCard.kana);
    } else {
      randomIndex = 0;
      nextCardCandidate = characterPool[0];
    }

    setCurrentCard(nextCardCandidate);
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
      mode: settings.mode,
      scoreRate: minutesElapsed > 0 ? (score / minutesElapsed).toFixed(1) : '0.0',
    });
  };

  // Cards per minute rate
  const minutesElapsed = elapsedTime / 60000;
  const scoreRate = minutesElapsed > 0 ? (score / minutesElapsed).toFixed(1) : '0.0';

  const accuracy = totalAttempted > 0 ? Math.round((score / totalAttempted) * 100) : 0;

  // Format elapsed time as MM:SS
  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#2a2e30] text-white flex flex-col">
      {/* Desktop header - hidden on mobile */}
      <div className="hidden md:flex justify-between items-center p-4 border-b border-gray-800">
        <div className="flex gap-5 flex-wrap">
          <div>
            <span className="text-gray-400 text-sm">Score</span>
            <div className="text-xl font-bold">{score}</div>
          </div>
          <div>
            <span className="text-gray-400 text-sm">Accuracy</span>
            <div className="text-xl font-bold">{accuracy}%</div>
          </div>
          <div>
            <span className="text-gray-400 text-sm">Streak</span>
            <div className="text-xl font-bold">{currentStreak}</div>
          </div>
          <div>
            <span className="text-gray-400 text-sm">Time</span>
            <div className="text-xl font-bold font-mono">{formatTime(elapsedTime)}</div>
          </div>
          {isSpeedrun && (
            <div>
              <span className="text-orange-400 text-sm">Rate</span>
              <div className="text-xl font-bold text-orange-400">{scoreRate}<span className="text-xs text-orange-400/60">/min</span></div>
            </div>
          )}
        </div>
        <button
          onClick={handleQuit}
          className="px-6 py-3 text-gray-400 bg-red-900/30 active:bg-red-900/50 hover:text-white hover:bg-red-900/50 rounded-lg transition-colors text-lg"
        >
          End Session
        </button>
      </div>

      {/* Main game area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-6">
        {/* Mobile: Stats and Card on same row */}
        <div className="flex items-center justify-between w-full md:block px-4">
          {/* Left stats - Score & Accuracy (mobile only) */}
          <div className="flex flex-col gap-4 md:hidden shrink-0">
            <div className="text-center">
              <span className="text-gray-400 text-xs">Score</span>
              <div className="text-lg font-bold">{score}</div>
            </div>
            <div className="text-center">
              <span className="text-gray-400 text-xs">Accuracy</span>
              <div className="text-lg font-bold">{accuracy}%</div>
            </div>
          </div>

          {/* Card */}
          <div
            className={`text-[min(80px,15vw)] md:text-[120px] font-sans transition-all duration-200 text-center ${
              feedback === 'correct'
                ? 'text-cyan-400 scale-105'
                : feedback === 'wrong'
                ? 'text-red-400'
                : feedback === 'skip'
                ? 'text-amber-400'
                : ''
            }`}
            style={{ fontFamily: '"Noto Sans JP", sans-serif' }}
          >
            {currentCard?.kana}
          </div>

          {/* Right stats - Streak & Time (mobile only) */}
          <div className="flex flex-col gap-4 md:hidden shrink-0">
            <div className="text-center">
              <span className="text-gray-400 text-xs">Streak</span>
              <div className="text-lg font-bold">{currentStreak}</div>
            </div>
            <div className="text-center">
              <span className="text-gray-400 text-xs">Time</span>
              <div className="text-lg font-bold font-mono">{formatTime(elapsedTime)}</div>
            </div>
            {isSpeedrun && (
              <div className="text-center">
                <span className="text-orange-400 text-xs">Rate</span>
                <div className="text-lg font-bold text-orange-400">{scoreRate}<span className="text-xs text-orange-400/60">/m</span></div>
              </div>
            )}
          </div>
        </div>

        {showSkipAnswer && (
          <div className="text-amber-400 text-2xl mb-4 animate-pulse">
            {currentCard?.answers[0]}
          </div>
        )}

        {!showSkipAnswer && <div className="h-10 mb-4" />}

        {/* Input and buttons */}
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
                ? 'border-cyan-400'
                : 'border-gray-600 focus:border-gray-400'
            }`}
            style={{ fontSize: '16px' }}
          />
          <p className="text-gray-500 text-center text-sm mt-3 hidden md:block">Press Enter to submit</p>
          {/* Mobile: Skip and Quit on same row */}
          <div className="flex gap-2 mt-4 md:hidden">
            <button
              type="button"
              onClick={handleSkip}
              disabled={showSkipAnswer}
              className="flex-[3] py-3 text-gray-400 bg-gray-800 active:bg-gray-700 hover:text-amber-400 hover:bg-gray-700 rounded-lg transition-colors text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Skip
            </button>
            <button
              type="button"
              onClick={handleQuit}
              className="flex-1 py-3 text-gray-400 bg-red-900/30 active:bg-red-900/50 hover:text-white hover:bg-red-900/50 rounded-lg transition-colors text-base"
            >
              End
            </button>
          </div>
          {/* Desktop: Skip button only */}
          <button
            type="button"
            onClick={handleSkip}
            disabled={showSkipAnswer}
            className="hidden md:block w-full mt-4 py-2 text-gray-400 bg-gray-800 active:bg-gray-700 hover:text-amber-400 hover:bg-gray-700 rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Skip (Tab)
          </button>
        </form>
      </div>

    </div>
  );
}
