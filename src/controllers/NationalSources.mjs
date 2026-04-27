
export class NationalSourcesController {
    
    static getStates(req, res) {
      const states = [
        {
          state: 'Queensland',
          sources: { wind: 10, solar: 20, gas: 25, coal: 45 }
        },
        {
          state: 'New South Wales',
          sources: { wind: 15, solar: 15, gas: 30, coal: 40 }
        },
        {
          state: 'Victoria',
          sources: { wind: 20, solar: 10, gas: 40, coal: 30 }
        },
        {
          state: 'South Australia',
          sources: { wind: 35, solar: 25, gas: 30, coal: 10 }
        },
        {
          state: 'Western Australia',
          sources: { wind: 15, solar: 25, gas: 45, coal: 15 }
        },
        {
          state: 'Tasmania',
          sources: { wind: 30, solar: 10, gas: 10, coal: 50 }
        },
        {
          state: 'Northern Territory',
          sources: { wind: 5, solar: 35, gas: 50, coal: 10 }
        },
        {
          state: 'Australian Capital Territory',
          sources: { wind: 25, solar: 30, gas: 25, coal: 20 }
        }
      ];
      
      res.json(states);
    }
  
    /**
     * Get energy source distribution for a specific state
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     */
    static getStateSourceDistribution(req, res) {
      const { state } = req.params;
      
      const states = [
        {
          state: 'Queensland',
          sources: { wind: 10, solar: 20, gas: 25, coal: 45 }
        },
        {
          state: 'New South Wales',
          sources: { wind: 15, solar: 15, gas: 30, coal: 40 }
        },
        {
          state: 'Victoria',
          sources: { wind: 20, solar: 10, gas: 40, coal: 30 }
        },
        {
          state: 'South Australia',
          sources: { wind: 35, solar: 25, gas: 30, coal: 10 }
        },
        {
          state: 'Western Australia',
          sources: { wind: 15, solar: 25, gas: 45, coal: 15 }
        },
        {
          state: 'Tasmania',
          sources: { wind: 30, solar: 10, gas: 10, coal: 50 }
        },
        {
          state: 'Northern Territory',
          sources: { wind: 5, solar: 35, gas: 50, coal: 10 }
        },
        {
          state: 'Australian Capital Territory',
          sources: { wind: 25, solar: 30, gas: 25, coal: 20 }
        }
      ];
      
      const stateData = states.find(s => s.state === state);
      
      if (stateData) {
        res.json(stateData);
      } else {
        res.status(404).json({ error: 'State not found' });
      }
    }
  }
  