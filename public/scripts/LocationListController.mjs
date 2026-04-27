import { LocationModel } from './LocationModel.mjs';

export class LocationListController {
  constructor() {
    this.searchInput = document.getElementById('search-input');
    this.createButton = document.getElementById('create-button');
    this.locationList = document.getElementById('location-list');
    
    this.init();
  }


  init() {
    // Add event listeners
    this.searchInput.addEventListener('input', () => this.handleSearch());
    this.createButton.addEventListener('click', () => this.handleCreate());
    
    // Initial render
    this.renderLocations();
  }

   // Handle search input
  handleSearch() {
    const query = this.searchInput.value;
    this.renderLocations(query);
  }


   // Handle create button click
  handleCreate() {
    window.location.href = '/location/edit/';
  }

  renderLocations(query = '') {
    // Clear current list
    this.locationList.innerHTML = '';
    
    // Get locations based on search query
    const locations = LocationModel.search(query);
    
    if (locations.length === 0) {
      this.locationList.innerHTML = '<div class="empty-message">No locations found</div>';
      return;
    }
    
    // Create location cards
    locations.forEach(location => {
      const card = this.createLocationCard(location);
      this.locationList.appendChild(card);
    });
  }


   // Create a location card element
   
  createLocationCard(location) {
    const card = document.createElement('div');
    card.className = 'location-card';
    
    // Calculate total energy and appliance count
    const totalEnergy = location.totalEnergy || 0;
    const applianceCount = location.appliances ? location.appliances.length : 0;
    
    card.innerHTML = `
      <h3>${location.name}</h3>
      <div class="state-badge">${location.state}</div>
      
      <div class="energy-info">
        Daily Energy: <span class="energy-value">${totalEnergy > 0 ? totalEnergy.toFixed(2) + ' kWh' : 'NaN kWh'}</span>
      </div>
      
      <div class="appliance-count">
        ${applianceCount} Appliance${applianceCount !== 1 ? 's' : ''}
      </div>
      
      <div class="card-actions">
        <button class="edit-button" data-id="${location.id}">Edit</button>
        <button class="stats-button" data-id="${location.id}">Statistics</button>
      </div>
    `;
    
    // Add event listeners
    card.querySelector('.edit-button').addEventListener('click', (e) => {
      const id = e.target.getAttribute('data-id');
      window.location.href = `/location/edit/${id}`;
    });
    
    card.querySelector('.stats-button').addEventListener('click', (e) => {
      const id = e.target.getAttribute('data-id');
      window.location.href = `/location/stats/${id}`;
    });
    
    return card;
  }
}

// Initialize controller when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new LocationListController();
});
