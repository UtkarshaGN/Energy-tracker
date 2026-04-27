import { DataModel } from './DataModel.mjs';


export class ApplianceModel extends DataModel {
 
  constructor(data = {}) {
    super({
      id: data.id || crypto.randomUUID(),
      type: data.type || '',
      quantity: data.quantity || 1,
      hoursPerDay: data.hoursPerDay || 0,
      energyPerHour: data.energyPerHour || 0
    });
  }

  getDailyEnergyUsage() {
    return this.quantity * this.hoursPerDay * this.energyPerHour;
  }
}
