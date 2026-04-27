
export class LeaderboardController {

  static getLeaderboard(req, res) {
    try {
     
      const leaderboardJson = process.leaderboardData || '[]';
      let leaderboard = JSON.parse(leaderboardJson);
      
      // Sort by renewable percentage (highest first)
      leaderboard.sort((a, b) => b.renewablePercentage - a.renewablePercentage);
      
      res.json(leaderboard);
    } catch (error) {
      console.error('Error in getLeaderboard:', error);
      res.status(500).json({ error: error.message });
    }
  }

  
   // Add a new leaderboard entry 
  static addLeaderboardEntry(req, res) {
    try {
      console.log('Adding leaderboard entry, received data:', req.body);
      
      // Validate required fields
      const requiredFields = ['locationName', 'state', 'totalEnergy', 'energyBySource', 'renewablePercentage'];
      for (const field of requiredFields) {
        if (req.body[field] === undefined) {
          return res.status(400).json({ error: `Missing required field: ${field}` });
        }
      }
      
      // Validate energyBySource fields
      const requiredSourceFields = ['wind', 'solar', 'gas', 'coal'];
      for (const field of requiredSourceFields) {
        if (req.body.energyBySource[field] === undefined) {
          return res.status(400).json({ error: `Missing required energy source field: ${field}` });
        }
      }
      
      // Validate numeric fields
      if (typeof req.body.totalEnergy !== 'number' || req.body.totalEnergy <= 0) {
        return res.status(400).json({ error: 'totalEnergy must be a positive number' });
      }
      
      if (typeof req.body.renewablePercentage !== 'number' || req.body.renewablePercentage < 0 || req.body.renewablePercentage > 100) {
        return res.status(400).json({ error: 'renewablePercentage must be a number between 0 and 100' });
      }
      
      // Create entry with only the necessary data
      const entry = {
        id: req.body.id || crypto.randomUUID(),
        locationName: String(req.body.locationName),
        state: String(req.body.state),
        totalEnergy: Number(req.body.totalEnergy),
        energyBySource: {
          wind: Number(req.body.energyBySource.wind || 0),
          solar: Number(req.body.energyBySource.solar || 0),
          gas: Number(req.body.energyBySource.gas || 0),
          coal: Number(req.body.energyBySource.coal || 0)
        },
        renewablePercentage: Number(req.body.renewablePercentage),
        timestamp: req.body.timestamp || Date.now()
      };
      
      console.log('Processed entry:', entry);
      
      let leaderboard = [];
      try {
        const leaderboardJson = process.leaderboardData || '[]';
        leaderboard = JSON.parse(leaderboardJson);
      } catch (parseError) {
        console.error('Error parsing leaderboard data:', parseError);
        process.leaderboardData = '[]';
        leaderboard = [];
      }
      
      leaderboard.push(entry);
      process.leaderboardData = JSON.stringify(leaderboard);
      
      res.status(201).json(entry);
    } catch (error) {
      console.error('Error in addLeaderboardEntry:', error);
      res.status(400).json({ error: error.message });
    }
  }

   // Update a leaderboard entry
  static updateLeaderboardEntry(req, res) {
    try {
      const { id } = req.params;
    
      let leaderboard = [];
      try {
        const leaderboardJson = process.leaderboardData || '[]';
        leaderboard = JSON.parse(leaderboardJson);
      } catch (parseError) {
        console.error('Error parsing leaderboard data:', parseError);
        return res.status(500).json({ error: 'Internal server error' });
      }
      
      const index = leaderboard.findIndex(entry => entry.id === id);
      
      if (index === -1) {
        return res.status(404).json({ error: 'Leaderboard entry not found' });
      }
      
      // Update only the fields that are provided
      const updatedEntry = {
        ...leaderboard[index],
        ...req.body,
        id // Ensure ID doesn't change
      };
      
      leaderboard[index] = updatedEntry;
      process.leaderboardData = JSON.stringify(leaderboard);
      
      res.json(updatedEntry);
    } catch (error) {
      console.error('Error in updateLeaderboardEntry:', error);
      res.status(400).json({ error: error.message });
    }
  }

   // Delete a leaderboard entry
  static deleteLeaderboardEntry(req, res) {
    try {
      const { id } = req.params;
      
      let leaderboard = [];
      try {
        const leaderboardJson = process.leaderboardData || '[]';
        leaderboard = JSON.parse(leaderboardJson);
      } catch (parseError) {
        console.error('Error parsing leaderboard data:', parseError);
        return res.status(500).json({ error: 'Internal server error' });
      }
      
      const newLeaderboard = leaderboard.filter(entry => entry.id !== id);
      
      if (newLeaderboard.length === leaderboard.length) {
        return res.status(404).json({ error: 'Leaderboard entry not found' });
      }
      
      process.leaderboardData = JSON.stringify(newLeaderboard);
      
      res.status(204).send();
    } catch (error) {
      console.error('Error in deleteLeaderboardEntry:', error);
      res.status(500).json({ error: error.message });
    }
  }
}
