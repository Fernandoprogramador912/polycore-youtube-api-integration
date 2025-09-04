import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Compat para __dirname en ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware JSON
app.use(express.json());

// Servir el HTML principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'complete_frontend_html 1.html'));
});

// Montar el handler de API en /api/subtitles
// Import dinámico para mantener ESModules
app.get('/api/subtitles', async (req, res) => {
  try {
    const mod = await import('./api/subtitles.js');
    const handler = mod.default;
    // Express pasa req,res compatibles con Next handlers simples
    return handler(req, res);
  } catch (err) {
    console.error('Error loading API handler:', err);
    res.status(500).json({ success: false, error: 'Server error loading API' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


