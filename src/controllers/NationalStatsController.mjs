import { LeaderboardModel } from '../models/LeaderboardModel.mjs';


export class NationalStatsController {
  static getNationalStats(req, res) {
    try {
      const leaderboardJson = process.leaderboardData || '[]';
      const leaderboard = JSON.parse(leaderboardJson);
      
      // Initialize statistics
      const stats = {
        totalEnergy: 0,
        energyBySource: {
          wind: 0,
          solar: 0,
          gas: 0,
          coal: 0
        },
        renewablePercentage: 0,
        entryCount: leaderboard.length
      };
      
      // Aggregate data
      leaderboard.forEach(entry => {
        stats.totalEnergy += entry.totalEnergy;
        stats.energyBySource.wind += entry.energyBySource.wind;
        stats.energyBySource.solar += entry.energyBySource.solar;
        stats.energyBySource.gas += entry.energyBySource.gas;
        stats.energyBySource.coal += entry.energyBySource.coal;
      });
      
      // Calculate renewable percentage
      if (stats.totalEnergy > 0) {
        const renewable = stats.energyBySource.wind + stats.energyBySource.solar;
        stats.renewablePercentage = (renewable / stats.totalEnergy) * 100;
      }
      
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
