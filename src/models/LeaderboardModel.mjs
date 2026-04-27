import { DataModel } from './DataModel.mjs';

export class LeaderboardModel extends DataModel {
  
  constructor(data = {}) {
    super({
      id: data.id || crypto.randomUUID(),
      locationName: data.locationName || '',
      state: data.state || '',
      totalEnergy: data.totalEnergy || 0,
      energyBySource: data.energyBySource || {
        wind: 0,
        solar: 0,
        gas: 0,
        coal: 0
      },
      renewablePercentage: data.renewablePercentage || 0,
      timestamp: data.timestamp || Date.now()
    });
  }

// Calculate renewable energy percentage 
  calculateRenewablePercentage() {
    if (this.totalEnergy === 0) return 0;
    
    const renewable = this.energyBySource.wind + this.energyBySource.solar;
    return (renewable / this.totalEnergy) * 100;
  }
}
