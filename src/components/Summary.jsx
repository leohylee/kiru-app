function formatDuration(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }
  return `${seconds}s`;
}

export default function Summary({ stats, onPlayAgain, onReset }) {
  const { score, totalAttempted, bestStreak, struggledCards, duration, mode, scoreRate } = stats;
  const accuracy = totalAttempted > 0 ? Math.round((score / totalAttempted) * 100) : 0;
  const isSpeedrun = mode === 'speedrun';

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full">
        <h1 className="text-4xl font-bold text-center mb-2">
          {isSpeedrun ? 'Speedrun Complete' : 'Session Complete'}
        </h1>
        <p className="text-gray-400 text-center mb-10">
          {isSpeedrun ? 'Great speed!' : 'Great practice!'}
        </p>

        {isSpeedrun && (
          <div className="bg-gray-800 rounded-lg p-6 text-center mb-6">
            <div className="text-5xl font-bold text-orange-400">{scoreRate}</div>
            <div className="text-orange-400/70 text-sm mt-1">cards per minute</div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className={`text-3xl font-bold ${isSpeedrun ? '' : 'text-cyan-400'}`}>{score}</div>
            <div className="text-gray-400 text-sm">Score</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold">{accuracy}%</div>
            <div className="text-gray-400 text-sm">Accuracy</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold">{bestStreak}</div>
            <div className="text-gray-400 text-sm">Best Streak</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold">{totalAttempted}</div>
            <div className="text-gray-400 text-sm">Cards Attempted</div>
          </div>
        </div>

        {duration && (
          <div className="text-center text-gray-400 mb-8">
            Session duration: {formatDuration(duration)}
          </div>
        )}

        {struggledCards.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3 text-gray-300">Cards to Review</h2>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="grid grid-cols-3 gap-3">
                {struggledCards.map((card, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl mb-1" style={{ fontFamily: '"Noto Sans JP", sans-serif' }}>
                      {card.kana}
                    </div>
                    <div className="text-gray-400 text-sm">{card.answers[0]}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onPlayAgain}
            className={`flex-1 py-4 rounded-lg font-semibold transition-colors ${
              isSpeedrun
                ? 'bg-orange-800/50 hover:bg-orange-700/60 text-orange-100'
                : 'bg-cyan-800/50 hover:bg-cyan-700/60 text-cyan-100'
            }`}
          >
            Play Again
          </button>
          <button
            onClick={onReset}
            className="flex-1 py-4 rounded-lg font-semibold bg-gray-700 hover:bg-gray-600 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
