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

// New endpoint to fetch stocks
app.get('/api/stocks', async (req, res) => {
  try {
    const result = await pool.query('SELECT StockID, TickerSymbol, CompanyName FROM Stocks');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching stocks:', err);
    res.status(500).json({ error: 'An error occurred while fetching stocks' });
  }
});

// New endpoint to create a transaction and update PortfolioStocks
app.post('/api/transactions', async (req, res) => {
  const { stockId, transactionType, quantity, transactionPrice, transactionDate, purchasePrice, purchaseDate } = req.body;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Check if the stock exists in PortfolioStocks
    const portfolioStockResult = await client.query(
      'SELECT PortfolioStockID, Quantity FROM PortfolioStocks WHERE StockID = $1',
      [stockId]
    );

    let portfolioStockId;
    if (portfolioStockResult.rows.length === 0) {
      // If the stock doesn't exist in PortfolioStocks, create a new entry
      const newPortfolioStock = await client.query(
        'INSERT INTO PortfolioStocks (PortfolioID, StockID, Quantity, PurchasePrice, PurchaseDate) VALUES ($1, $2, $3, $4, $5) RETURNING PortfolioStockID',
        [1, stockId, quantity, purchasePrice, purchaseDate] // Assuming PortfolioID is 1 for now
      );
      portfolioStockId = newPortfolioStock.rows[0].portfoliostockid;
    } else {
      // If the stock exists, update the quantity
      portfolioStockId = portfolioStockResult.rows[0].portfoliostockid;
      const currentQuantity = portfolioStockResult.rows[0].quantity;
      const newQuantity = transactionType === 'Buy' ? currentQuantity + parseInt(quantity) : currentQuantity - parseInt(quantity);
      
      await client.query(
        'UPDATE PortfolioStocks SET Quantity = $1, UpdatedAt = CURRENT_TIMESTAMP WHERE PortfolioStockID = $2',
        [newQuantity, portfolioStockId]
      );
    }

    // Create the transaction
    const transactionResult = await client.query(
      'INSERT INTO Transactions (PortfolioStockID, TransactionType, Quantity, TransactionPrice, TransactionDate) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [portfolioStockId, transactionType, quantity, transactionPrice, transactionDate]
    );

    await client.query('COMMIT');
    res.status(201).json(transactionResult.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error creating transaction:', err);
    res.status(500).json({ error: 'An error occurred while creating the transaction' });
  } finally {
    client.release();
  }
});

// New endpoint to create a stock
app.post('/api/stocks', async (req, res) => {
  const { tickerSymbol, companyName, market, sector } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO Stocks (TickerSymbol, CompanyName, Market, Sector) VALUES ($1, $2, $3, $4) RETURNING *',
      [tickerSymbol, companyName, market, sector]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating stock:', err);
    res.status(500).json({ error: 'An error occurred while creating the stock' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});