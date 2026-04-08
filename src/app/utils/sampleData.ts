// Initialize sample leaderboard data for demo purposes
export function initializeSampleData() {
  const existingData = localStorage.getItem("leaderboard");
  
  if (!existingData || JSON.parse(existingData).length === 0) {
    const sampleLeaderboard = [
      { name: "Alex Mueller", score: 1350, timestamp: new Date(Date.now() - 600000).toISOString() },
      { name: "Sarah Schmidt", score: 1280, timestamp: new Date(Date.now() - 500000).toISOString() },
      { name: "Michael Wagner", score: 1150, timestamp: new Date(Date.now() - 400000).toISOString() },
      { name: "Lisa Becker", score: 1050, timestamp: new Date(Date.now() - 300000).toISOString() },
      { name: "Thomas Fischer", score: 980, timestamp: new Date(Date.now() - 200000).toISOString() },
      { name: "Anna Weber", score: 920, timestamp: new Date(Date.now() - 100000).toISOString() },
      { name: "David Hoffmann", score: 850, timestamp: new Date(Date.now() - 50000).toISOString() },
    ];
    
    localStorage.setItem("leaderboard", JSON.stringify(sampleLeaderboard));
  }
}

// Call this on app initialization
if (typeof window !== "undefined") {
  initializeSampleData();
}
