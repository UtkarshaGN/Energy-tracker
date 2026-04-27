
export class ApplianceController {
    static getApplianceTypes(req, res) {
      const applianceTypes = [
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
      
      res.json(applianceTypes);
    }
  

     // Create a new appliance
    static createAppliance(req, res) {
      try {
        const applianceData = req.body;
        const appliance = {
          id: crypto.randomUUID(),
          type: applianceData.type,
          quantity: applianceData.quantity,
          hoursPerDay: applianceData.hoursPerDay,
          energyPerHour: applianceData.energyPerHour
        };
        
        res.status(201).json(appliance);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    }
  }
  