import express from 'express';
import { LeaderboardController } from '../controllers/LeaderboardController.mjs';

const router = express.Router();

// Get all leaderboard entries
router.get('/', LeaderboardController.getLeaderboard);

// Add a new leaderboard entry
router.post('/', LeaderboardController.addLeaderboardEntry);

// Update a leaderboard entry
router.put('/:id', LeaderboardController.updateLeaderboardEntry);

// Delete a leaderboard entry
router.delete('/:id', LeaderboardController.deleteLeaderboardEntry);

export default router;
