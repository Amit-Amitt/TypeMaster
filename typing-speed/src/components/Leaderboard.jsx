function Leaderboard({ scores, darkMode, onClose }) {
  return (
    <div className={`leaderboard-box premium-card ${darkMode ? "dark-card" : ""}`}>
      <div className="leaderboard-header">
        <h2>🏅 Leaderboard</h2>
        <button className="close-btn" onClick={onClose}>✖</button>
      </div>

      {scores.length === 0 ? (
        <p>No scores available yet.</p>
      ) : (
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>WPM</th>
              <th>Accuracy</th>
              <th>Mistakes</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((score, index) => (
              <tr key={score._id}>
                <td>{index + 1}</td>
                <td>{score.name}</td>
                <td>{score.wpm}</td>
                <td>{score.accuracy}%</td>
                <td>{score.mistakes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Leaderboard;