import express from 'express';
import { NationalSourcesController } from '../controllers/NationalSources.mjs';
import { NationalStatsController } from '../controllers/NationalStatsController.mjs';

const router = express.Router();

// Get all states with energy source distributions
router.get('/states', NationalSourcesController.getStates);

// Get energy source distribution for a specific state
router.get('/states/:state', NationalSourcesController.getStateSourceDistribution);

// Get national statistics
router.get('/stats', NationalStatsController.getNationalStats);

export default router;
