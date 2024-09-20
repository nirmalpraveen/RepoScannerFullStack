import React, { useState } from 'react';
import axios from 'axios';
import ChartComponent from './ChartComponent'; // Assuming this is the chart for the technologies used

const TechDebtScanner = () => {
  const [repoUrl, setRepoUrl] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleScan = async () => {
    try {
      setError(null);
      const response = await axios.get(`/scan-project?repoUrl=${repoUrl}`);
      setResult(response.data);
    } catch (err) {
      setError("Failed to scan the project. Please check the URL.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Technical Debt Scanner</h2>
      <input
        type="text"
        placeholder="Enter GitHub Repo URL"
        value={repoUrl}
        onChange={(e) => setRepoUrl(e.target.value)}
        style={{ padding: "10px", width: "300px" }}
      />
      <button onClick={handleScan} style={{ padding: "10px", marginLeft: "10px" }}>Scan Project</button>

      {error && <div style={{ color: "red" }}>{error}</div>}

      {result && (
        <div style={{ marginTop: "20px" }}>
          <h3>Project: {result.name}</h3>
          <h4>Technical Debt Score: {result.debtScore} / 5</h4>

          <h4>Technologies Used:</h4>
          <ul>
            {result.techUsed.map((tech, index) => (
              <li key={index}>{tech}</li>
            ))}
          </ul>

          {result.recommendations.length > 0 ? (
            <>
              <h4>Recommendations:</h4>
              <ul>
                {result.recommendations.map((rec, index) => (
                  <li key={index}>
                    <strong>{rec.package}:</strong> Current Version: {rec.currentVersion}, Recommended Version: {rec.recommendedVersion}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p>All dependencies are up to date!</p>
          )}

          {/* Pie Chart for technologies */}
          <ChartComponent techUsed={result.techUsed} />
        </div>
      )}
    </div>
  );
};

export default TechDebtScanner;
