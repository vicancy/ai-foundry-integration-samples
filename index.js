// Simple static file server 
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Initialize express
const app = express();
const PORT = process.env.PORT || 8080;

// Serve static files from the root directory - this is the main functionality
app.use(express.static(__dirname, {dotfiles: "allow"}));

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Serving files statically from the root directory`);
  console.log(`Example URLs:`);
  console.log(`- http://localhost:${PORT}/index.json`);
});