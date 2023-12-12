// server.js
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use('/api', express.static(join(__dirname, 'app', 'api')));

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
