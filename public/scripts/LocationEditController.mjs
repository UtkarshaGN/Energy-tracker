import { LocationModel } from './LocationModel.mjs';

export class LocationEditController {
  constructor() {
    this.locationId = this.getLocationIdFromUrl();
    this.location = null;
    
    this.nameInput = document.getElementById('location-name');
    this.stateSelect = document.getElementById('location-state');
    this.applianceList = document.getElementById('appliance-list');
    this.applianceTypeSelect = document.getElementById('appliance-type');
    this.applianceQuantityInput = document.getElementById('appliance-quantity');
    this.applianceHoursInput = document.getElementById('appliance-hours');
    this.addApplianceButton = document.getElementById('add-appliance-button');
    this.saveButton = document.getElementById('save-button');
    this.backButton = document.getElementById('back-button');
    this.deleteButton = document.getElementById('delete-button');
    
    this.init();
  }

 
  async init() {
    try {
      // Load states and appliance types
      await Promise.all([
        this.loadStates(),
        this.loadApplianceTypes()
      ]);
      
      // Load location data if editing existing location
      if (this.locationId) {
        this.loadLocation();
        console.log('Editing location with ID:', this.locationId);
      } else {
        // Create new location
        this.location = new LocationModel();
        
        // Hide delete button for new locations
        if (this.deleteButton) {
          this.deleteButton.style.display = 'none';
        }
      }
      
      // Add event listeners
      this.addApplianceButton.addEventListener('click', () => this.handleAddAppliance());
      this.saveButton.addEventListener('click', () => this.handleSave());
      this.backButton.addEventListener('click', () => this.handleBack());
      
      // Add delete button event listener
      if (this.deleteButton) {
        this.deleteButton.addEventListener('click', () => this.handleDelete());
      }
    } catch (error) {
      console.error('Error initializing controller:', error);
    }
  }


   // Get location ID from URL - returns {string|null} : Location ID or null if creating new location   
  getLocationIdFromUrl() {
    const path = window.location.pathname;
    const match = path.match(/\/location\/edit\/([^\/]+)/);
    return match ? match[1] : null;
  }


  async loadStates() {
    try {
      console.log('Loading states...');
      
      //  states
      const states = [
        { state: 'Queensland' },
        { state: 'New South Wales' },
        { state: 'Victoria' },
        { state: 'South Australia' },
        { state: 'Western Australia' },
        { state: 'Tasmania' },
        { state: 'Northern Territory' },
        { state: 'Australian Capital Territory' }
      ];
      
      this.stateSelect.innerHTML = '<option value="">Select a state</option>';
      
      // Add state options
      states.forEach(state => {
        const option = document.createElement('option');
        option.value = state.state;
        option.textContent = state.state;
        this.stateSelect.appendChild(option);
      });
    } catch (error) {
      console.error('Error in loadStates:', error);
    }
  }

  
   // Load appliance types 
  async loadApplianceTypes() {
    try {
      console.log('Loading appliance types...');
      
      //  appliance types
      const types = [
        { type: 'Refrigerator', energyPerHour: 0.15 },
        { type: 'Air Conditioner', energyPerHour: 1.5 },
        { type: 'Television', energyPerHour: 0.1 },
        { type: 'Washing Machine', energyPerHour: 0.5 },
        { type: 'Dishwasher', energyPerHour: 1.2 },
        { type: 'Computer', energyPerHour: 0.2 },
        { type: 'Microwave', energyPerHour: 1.0 },
        { type: 'Electric Oven', energyPerHour: 2.0 },
        { type: 'Water Heater', energyPerHour: 4.0 },
        { type: 'Lighting', energyPerHour: 0.06 }
      ];
      
      this.applianceTypeSelect.innerHTML = '<option value="">Select an appliance type</option>';
      
      // Add type options
      types.forEach(type => {
        const option = document.createElement('option');
        option.value = type.type;
        option.textContent = type.type;
        option.dataset.energyPerHour = type.energyPerHour;
        this.applianceTypeSelect.appendChild(option);
      });
    } catch (error) {
      console.error('Error in loadApplianceTypes:', error);
    }
  }

  
   // Load location data
  loadLocation() {
    this.location = LocationModel.getById(this.locationId);
    
    if (!this.location) {
      alert('Location not found');
      window.location.href = '/';
      return;
    }
    
    // Fill form with location data
    this.nameInput.value = this.location.name;
    this.stateSelect.value = this.location.state;
    
    // Render appliances
    this.renderAppliances();
  }

  
   
  renderAppliances() {
    // Clear current list
    this.applianceList.innerHTML = '';
    
    if (!this.location.appliances || this.location.appliances.length === 0) {
      this.applianceList.innerHTML = '<div class="empty-message">No appliances added</div>';
      return;
    }
    
    // Create appliance items
    this.location.appliances.forEach(appliance => {
      const item = this.createApplianceItem(appliance);
      this.applianceList.appendChild(item);
    });
  }

  
  createApplianceItem(appliance) {
    const item = document.createElement('div');
    item.className = 'appliance-item';
    
    const dailyEnergy = appliance.quantity * appliance.hoursPerDay * appliance.energyPerHour;
    
    item.innerHTML = `
      <div class="appliance-info">
        <span class="appliance-type">${appliance.type}</span>
        <span class="appliance-details">
          Quantity: ${appliance.quantity}, 
          Hours: ${appliance.hoursPerDay}, 
          Energy: ${dailyEnergy.toFixed(2)} KWh/day
        </span>
      </div>
      <button class="delete-button" data-id="${appliance.id}">Delete</button>
    `;
    
    // Add event listener for delete button
    item.querySelector('.delete-button').addEventListener('click', (e) => {
      const id = e.target.getAttribute('data-id');
      this.handleDeleteAppliance(id);
    });
    
    return item;
  }


   // Handle add appliance button click
  handleAddAppliance() {
    // Get form values
    const typeOption = this.applianceTypeSelect.options[this.applianceTypeSelect.selectedIndex];
    const type = typeOption ? typeOption.value : '';
    const energyPerHour = typeOption ? parseFloat(typeOption.dataset.energyPerHour) : 0;
    const quantity = parseInt(this.applianceQuantityInput.value, 10);
    const hoursPerDay = parseFloat(this.applianceHoursInput.value);
    
    // Validate input
    if (!type) {
      alert('Please select an appliance type');
      return;
    }
    
    if (isNaN(quantity) || quantity <= 0) {
      alert('Please enter a valid quantity (greater than 0)');
      return;
    }
    
    if (isNaN(hoursPerDay) || hoursPerDay <= 0 || hoursPerDay > 24) {
      alert('Please enter valid hours (between 0 and 24)');
      return;
    }
    
    // Create appliance
    const appliance = {
      id: crypto.randomUUID(),
      type,
      quantity,
      hoursPerDay,
      energyPerHour
    };
    
    // Add to location
    if (!this.location.appliances) {
      this.location.appliances = [];
    }
    
    this.location.appliances.push(appliance);
    this.location.calculateTotalEnergy();
    
    // Reset form
    this.applianceTypeSelect.selectedIndex = 0;
    this.applianceQuantityInput.value = '1';
    this.applianceHoursInput.value = '';
    
    // Render appliances
    this.renderAppliances();
  }

 
  handleDeleteAppliance(id) {
    this.location.removeAppliance(id);
    this.renderAppliances();
  }

 
  handleSave() {
    // Get form values
    const name = this.nameInput.value.trim();
    const state = this.stateSelect.value;
    
    // Validate input
    if (!name) {
      alert('Please enter a location name');
      return;
    }
    
    if (!state) {
      alert('Please select a state');
      return;
    }
    
    // Update location
    this.location.name = name;
    this.location.state = state;
    
    // Save location
    this.location.save();
    
    // Redirect to location list
    window.location.href = '/';
  }

  
   // Handle back button click
   
  handleBack() {
    window.location.href = '/';
  }
  
  
  handleDelete() {
    console.log('Delete button clicked for location ID:', this.locationId);
    
    if (!this.locationId) {
      console.error('No location ID found');
      return;
    }
    
    try {
      // Delete the location
      const deleted = LocationModel.deleteById(this.locationId);
      console.log('Location deleted:', deleted);
      
      // Redirect to location list
      window.location.href = '/';
    } catch (error) {
      console.error('Error deleting location:', error);
      alert('Failed to delete location: ' + error.message);
    }
  }
}

// Initialize controller when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new LocationEditController();
});
