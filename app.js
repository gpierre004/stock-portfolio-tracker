// app.js
import express from 'express';
import pool from './connection.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// GET endpoints

app.get('/portfolio_summary/:portfolioId', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM PortfolioStockSummary WHERE PortfolioID = $1', [req.params.portfolioId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while fetching the portfolio summary' });
  }
});

app.get('/transaction_history/:portfolioId', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM TransactionHistory WHERE PortfolioID = $1', [req.params.portfolioId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while fetching the transaction history' });
  }
});

app.get('/stock_price_history/:tickerSymbol', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM StockPriceHistory WHERE TickerSymbol = $1', [req.params.tickerSymbol]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while fetching the stock price history' });
  }
});

app.get('/portfolio_performance/:portfolioId', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM PortfolioPerformance WHERE PortfolioID = $1', [req.params.portfolioId]);
    res.json(rows[0] || null);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while fetching the portfolio performance' });
  }
});

// POST endpoints

app.post('/add_transaction', async (req, res) => {
  const { TransactionType, Quantity, TransactionPrice, TransactionDate, PortfolioStockID } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO Transactions (TransactionType, Quantity, TransactionPrice, TransactionDate, PortfolioStockID) VALUES ($1, $2, $3, $4, $5) RETURNING TransactionID',
      [TransactionType, Quantity, TransactionPrice, TransactionDate, PortfolioStockID]
    );
    res.status(201).json({ message: 'Transaction added successfully', TransactionID: rows[0].TransactionID });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'An error occurred while adding the transaction' });
  }
});

app.post('/update_stock_price', async (req, res) => {
  const { CurrentPrice, TickerSymbol } = req.body;
  try {
    const { rowCount } = await pool.query(
      'UPDATE PortfolioStocks SET CurrentPrice = $1 WHERE StockID = (SELECT StockID FROM Stocks WHERE TickerSymbol = $2)',
      [CurrentPrice, TickerSymbol]
    );
    res.json({ message: `Updated ${rowCount} portfolio stocks` });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'An error occurred while updating the stock price' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});