import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import pool from './connection.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/portfolio-summary', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM public.portfoliosummary');
    console.log('Fetched data:', result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching portfolio summary:', err);
    res.status(500).json({ error: 'An error occurred while fetching data' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});