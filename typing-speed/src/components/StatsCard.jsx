function StatsCard({ timeLeft, wpm, accuracy, mistakes, darkMode }) {
  return (
    <div className="stats-grid">
      <div className={`stat-box premium-card ${darkMode ? "dark-card" : ""}`}>
        <h4>⏱ Time</h4>
        <p>{timeLeft}s</p>
      </div>

      <div className={`stat-box premium-card ${darkMode ? "dark-card" : ""}`}>
        <h4>⚡ WPM</h4>
        <p>{wpm}</p>
      </div>

      <div className={`stat-box premium-card ${darkMode ? "dark-card" : ""}`}>
        <h4>🎯 Accuracy</h4>
        <p>{accuracy}%</p>
      </div>

      <div className={`stat-box premium-card ${darkMode ? "dark-card" : ""}`}>
        <h4>❌ Mistakes</h4>
        <p>{mistakes}</p>
      </div>
    </div>
  );
}

export default StatsCard;