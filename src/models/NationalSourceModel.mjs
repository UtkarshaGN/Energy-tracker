import { DataModel } from './DataModel.mjs';

export class NationalSourceModel extends DataModel {
 
  constructor(data = {}) {
    super({
      state: data.state || '',
      sources: data.sources || {
        wind: 0,
        solar: 0,
        gas: 0,
        coal: 0
      }
    });
  }

   // Get energy source percentages for a state
  getSourcePercentages() {
    return this.sources;
  }
}
