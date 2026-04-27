import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';



// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Get directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware for parsing JSON and URL-encoded data
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', [
  path.join(__dirname, 'views'),
  path.join(__dirname, 'public', 'views')
]);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Express error:', err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// View Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'views', 'location_list.html'));
});

app.get('/location/edit/:id?', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'views', 'location_edit.html'));
});

app.get('/location/stats/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'views', 'location_stats.html'));
});

app.get('/leaderboard', (req, res) => {
  res.render('leaderboard');
});

app.get('/national-stats', (req, res) => {
  res.render('national_stats');
});

// Initialize in-memory leaderboard data
if (!process.leaderboardData) {
  process.leaderboardData = JSON.stringify([]);
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Server is running at http://localhost:${PORT}`);
});
