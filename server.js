const express = require("express");
const axios = require("axios");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors());

// Load standard package versions from a file
const standardPackages = JSON.parse(fs.readFileSync("standards.json", "utf8"));

app.get("/scan-project", async (req, res) => {
    const { repoUrl } = req.query;
  
    try {
      // Extract repo details from the provided URL
      const repoPath = repoUrl.replace("https://github.com/", "");
      
      let packageJson;
      try {
        // Fetch from 'main' branch
        const response = await axios.get(
          `https://raw.githubusercontent.com/${repoPath}/main/package.json`
        );
        packageJson = response.data;
      } catch (error) {
        // Fetch from 'master' if 'main' branch fails
        const response = await axios.get(
          `https://raw.githubusercontent.com/${repoPath}/master/package.json`
        );
        packageJson = response.data;
      }
  
      const dependencies = packageJson.dependencies || {};
      const devDependencies = packageJson.devDependencies || {};
      const allDependencies = { ...dependencies, ...devDependencies };
  
      if (Object.keys(allDependencies).length === 0) {
        return res.json({
          name: packageJson.name || "Unnamed Project",
          techUsed: ["No dependencies found"],
          debtScore: 0,
          recommendations: []
        });
      }
  
      // Initialize debt score to 5 (perfect score)
      let debtScore = 5;
      const techUsed = Object.keys(allDependencies);
      const recommendations = [];
  
      Object.keys(allDependencies).forEach(pkg => {
        if (standardPackages[pkg]) {
          const projectVersion = allDependencies[pkg].replace("^", "");
          const standardVersion = standardPackages[pkg];
  
          // Split version into major, minor, and patch parts
          const [projectMajor, projectMinor] = projectVersion.split(".");
          const [standardMajor, standardMinor] = standardVersion.split(".");
  
          // Check if the project version is outdated compared to the standard
          if (projectMajor < standardMajor) {
            // Major version is behind, reduce score and recommend update
            debtScore -= 1.0;
            recommendations.push({
              package: pkg,
              currentVersion: projectVersion,
              recommendedVersion: standardVersion
            });
          } else if (projectMajor === standardMajor && projectMinor < standardMinor) {
            // Minor version is behind, reduce score slightly and recommend update
            debtScore -= 0.5;
            recommendations.push({
              package: pkg,
              currentVersion: projectVersion,
              recommendedVersion: standardVersion
            });
          }
        }
      });
  
      // Ensure the debt score doesn't go below 0
      debtScore = Math.max(debtScore, 0);
  
      res.json({
        name: packageJson.name || "Unnamed Project",
        techUsed,
        debtScore: debtScore.toFixed(2),  // rounded to 2 decimal places
        recommendations // send list of outdated packages and recommendations
      });
    } catch (error) {
      console.error("Error fetching package.json:", error.message);
      res.status(500).json({ error: "Failed to fetch package.json" });
    }
  });
  
  
  

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
