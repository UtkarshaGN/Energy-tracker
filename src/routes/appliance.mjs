import express from 'express';
import { ApplianceController } from '../controllers/ApplianceController.mjs';

const router = express.Router();

// Get all appliance types
router.get('/types', ApplianceController.getApplianceTypes);

// Create a new appliance
router.post('/', ApplianceController.createAppliance);

export default router;
