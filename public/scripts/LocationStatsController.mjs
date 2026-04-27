import { LocationModel } from './LocationModel.mjs';

export class LocationStatsController {
  constructor() {
    this.locationId = this.getLocationIdFromUrl();
    this.location = null;
    this.stateSourceDistribution = null;
    
    this.locationNameElement = document.getElementById('location-name');
    this.statsContainer = document.getElementById('stats-container');
    this.energySourcesContainer = document.getElementById('energy-sources');
    this.totalEnergyElement = document.getElementById('total-energy');
    this.postButton = document.getElementById('post-button');
    this.backButton = document.getElementById('back-button');
    
    this.init();
  }

  init() {
    // Load location data
    if (this.locationId) {
      this.loadLocation();
    } else {
      alert('No location specified');
      window.location.href = '/';
    }
    
    // Add event listeners
    this.postButton.addEventListener('click', () => this.handlePost());
    this.backButton.addEventListener('click', () => this.handleBack());
  }

  
   // Get location ID from URL - returns : {string|null} Location ID
  getLocationIdFromUrl() {
    const urlParts = window.location.pathname.split('/');
    return urlParts[urlParts.length - 1];
  }

  
   // Load location data 
  async loadLocation() {
    this.location = LocationModel.getById(this.locationId);
    
    if (!this.location) {
      alert('Location not found');
      window.location.href = '/';
      return;
    }
    
    // Load state source distribution
    await this.loadStateSourceDistribution();
    
    // Display location name
    this.locationNameElement.textContent = `${this.location.name} - ${this.location.state}`;
    
    // Calculate and display statistics
    this.calculateAndDisplayStatistics();
  }

   // Load state source distribution
  async loadStateSourceDistribution() {
    try {
      console.log('Loading state source distribution for:', this.location.state);
    
      // Hardcoded state energy sources
      const stateSourceData = {
        'Queensland': { wind: 10, solar: 20, gas: 25, coal: 45 },
        'New South Wales': { wind: 15, solar: 15, gas: 30, coal: 40 },
        'Victoria': { wind: 20, solar: 10, gas: 40, coal: 30 },
        'South Australia': { wind: 35, solar: 25, gas: 30, coal: 10 },
        'Western Australia': { wind: 15, solar: 25, gas: 45, coal: 15 },
        'Tasmania': { wind: 30, solar: 10, gas: 10, coal: 50 },
        'Northern Territory': { wind: 5, solar: 35, gas: 50, coal: 10 },
        'Australian Capital Territory': { wind: 25, solar: 30, gas: 25, coal: 20 }
      };
      
      // Use the state data or default if not found
      const sources = stateSourceData[this.location.state] || 
                     { wind: 25, solar: 25, gas: 25, coal: 25 };
      
      this.stateSourceDistribution = {
        state: this.location.state,
        sources: sources
      };
      
      console.log('Using state source distribution:', this.stateSourceDistribution);
    } catch (error) {
      console.error('Error loading state source distribution:', error);
      
      // Use default distribution if all else fails
      this.stateSourceDistribution = {
        state: this.location.state,
        sources: { wind: 25, solar: 25, gas: 25, coal: 25 }
      };
    }
  }


   // Calculate and display statistics   
  calculateAndDisplayStatistics() {
    if (!this.location || !this.stateSourceDistribution) return;
    
    // Calculate total energy
    const totalEnergy = this.location.calculateTotalEnergy();
    this.totalEnergyElement.textContent = `${totalEnergy.toFixed(2)} KWh/day`;
    
    // Calculate energy by source
    const sources = this.stateSourceDistribution.sources;
    const energyBySource = {
      wind: (sources.wind / 100) * totalEnergy,
      solar: (sources.solar / 100) * totalEnergy,
      gas: (sources.gas / 100) * totalEnergy,
      coal: (sources.coal / 100) * totalEnergy
    };
    
    // Display energy sources
    this.energySourcesContainer.innerHTML = '';
    
    // Wind
    this.createSourceBar('Wind', energyBySource.wind, sources.wind, '#6E9EEB');
    
    // Solar
    this.createSourceBar('Solar', energyBySource.solar, sources.solar, '#F9D56E');
    
    // Gas
    this.createSourceBar('Gas', energyBySource.gas, sources.gas, '#F9966E');
    
    // Coal
    this.createSourceBar('Coal', energyBySource.coal, sources.coal, '#8C8C8C');
    
    // Create pie chart
    this.createPieChart(sources);
  }

  createSourceBar(name, energy, percentage, color) {
    const sourceDiv = document.createElement('div');
    sourceDiv.className = 'energy-source';
    
    sourceDiv.innerHTML = `
      <div class="source-name">${name}:</div>
      <div class="source-bar-container">
        <div class="source-bar" style="width: ${percentage}%; background-color: ${color};"></div>
      </div>
      <div class="source-value">${energy.toFixed(2)} KWh/day</div>
    `;
    
    this.energySourcesContainer.appendChild(sourceDiv);
  }


   // Create a pie chart - param {Object} sources - Energy source percentages   
  createPieChart(sources) {
    const canvas = document.createElement('canvas');
    canvas.id = 'pie-chart';
    canvas.width = 200;
    canvas.height = 200;
    
    this.statsContainer.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.8;
    
    // Draw pie slices
    let startAngle = 0;
    const sourceColors = {
      wind: '#6E9EEB',
      solar: '#F9D56E',
      gas: '#F9966E',
      coal: '#8C8C8C'
    };
    
    Object.entries(sources).forEach(([source, percentage]) => {
      const endAngle = startAngle + (percentage / 100) * 2 * Math.PI;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      
      ctx.fillStyle = sourceColors[source];
      ctx.fill();
      
      startAngle = endAngle;
    });
    
    // Draw legend
    const legendContainer = document.createElement('div');
    legendContainer.className = 'chart-legend';
    
    Object.entries(sourceColors).forEach(([source, color]) => {
      const percentage = sources[source];
      const legendItem = document.createElement('div');
      legendItem.className = 'legend-item';
      
      legendItem.innerHTML = `
        <div class="legend-color" style="background-color: ${color};"></div>
        <div class="legend-label">${source.charAt(0).toUpperCase() + source.slice(1)}: ${percentage}%</div>
      `;
      
      legendContainer.appendChild(legendItem);
    });
    
    this.statsContainer.appendChild(legendContainer);
  }

  
   // Handle post button click
  handlePost() {
    if (!this.location || !this.stateSourceDistribution) return;
    
    try {
      // Calculate total energy
      const totalEnergy = this.location.calculateTotalEnergy();
      
      // Calculate energy by source
      const sources = this.stateSourceDistribution.sources;
      const energyBySource = {
        wind: Math.round((sources.wind / 100) * totalEnergy * 100),
        solar: Math.round((sources.solar / 100) * totalEnergy * 100),
        gas: Math.round((sources.gas / 100) * totalEnergy * 100),
        coal: Math.round((sources.coal / 100) * totalEnergy * 100)
      };
      
      // Create leaderboard entry
      const entry = {
        id: crypto.randomUUID(),
        state: this.location.state,
        wind: energyBySource.wind,
        solar: energyBySource.solar,
        gas: energyBySource.gas,
        coal: energyBySource.coal
      };
      
      // Get existing leaderboard data or create new array
      let leaderboard = [];
      try {
        const leaderboardData = localStorage.getItem('leaderboard');
        if (leaderboardData) {
          leaderboard = JSON.parse(leaderboardData);
        }
      } catch (error) {
        console.error('Error parsing leaderboard data:', error);
      }
      
      // Add new entry
      leaderboard.push(entry);
      
      // Save to localStorage
      localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
      
      alert('Posted to leaderboard successfully');
      window.location.href = '/leaderboard';
    } catch (error) {
      console.error('Error posting to leaderboard:', error);
      alert(`Failed to post to leaderboard: ${error.message}`);
    }
  }

  
   // Handle back button click
  handleBack() {
    window.location.href = '/';
  }
}

// Initialize controller when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new LocationStatsController();
});
