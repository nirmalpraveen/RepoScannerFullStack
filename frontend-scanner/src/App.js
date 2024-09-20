import React, { useState } from "react";
import axios from "axios";
import ChartComponent from "./ChartComponent"; // Import the chart component

const App = () => {
  const [repoUrl, setRepoUrl] = useState("");
  const [projectData, setProjectData] = useState(null);

  const scanProject = async () => {
    try {
      const response = await axios.get("http://localhost:4000/scan-project", {
        params: { repoUrl },
      });
      setProjectData(response.data);
    } catch (error) {
      console.error("Error fetching project data", error);
    }
  };

  return (
    <div>
      <h1>Project Technical Debt Scanner</h1>
      <input
        type="text"
        value={repoUrl}
        onChange={(e) => setRepoUrl(e.target.value)}
        placeholder="Enter GitHub repo URL"
      />
      <button onClick={scanProject}>Scan Project</button>

      {projectData && (
        <div>
          <h2>Project: {projectData.name}</h2>
          <p>Technical Debt Score: {projectData.debtScore}</p>
          <h3>Technologies Used</h3>
          <ChartComponent techUsed={projectData.techUsed} />
        </div>
      )}
    </div>
  );
};

export default App;
