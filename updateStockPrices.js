import yahooFinance from 'yahoo-finance2';
import pool from './connection.js';
import { updatePortfolioStockPrices } from './update-portfolio-stock-prices.js';

async function getStocks() {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT StockID, TickerSymbol FROM Stocks');
    return result.rows;
  } finally {
    client.release();
  }
}

async function getLatestPriceDate(stockId) {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT MAX(Date) as latestDate FROM PriceHistory WHERE StockID = $1', [stockId]);
    return result.rows[0].latestdate;
  } finally {
    client.release();
  }
}

async function updatePriceHistory(stockId, priceData) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const data of priceData) {
      await client.query(`
        INSERT INTO PriceHistory (StockID, Date, OpenPrice, ClosePrice, HighPrice, LowPrice, Volume)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (StockID, Date)
        DO UPDATE SET
          OpenPrice = EXCLUDED.OpenPrice,
          ClosePrice = EXCLUDED.ClosePrice,
          HighPrice = EXCLUDED.HighPrice,
          LowPrice = EXCLUDED.LowPrice,
          Volume = EXCLUDED.Volume
      `, [stockId, data.date, data.open, data.close, data.high, data.low, data.volume]);
    }
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function fetchYahooFinanceData(symbol, startDate) {
  const endDate = new Date();
  startDate = new Date(startDate);
  
  // Ensure startDate is not in the future
  if (startDate > endDate) {
    startDate = new Date(endDate.getTime() - 24 * 60 * 60 * 1000); // Set to yesterday
  }
  
  const queryOptions = {
    period1: startDate,
    period2: endDate,
  };
  
  try {
    const result = await yahooFinance.historical(symbol, queryOptions);
    return result.map(item => ({
      date: item.date,
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
      volume: item.volume
    }));
  } catch (error) {
    console.error(`Error fetching data for ${symbol}:`, error);
    return [];
  }
}

async function updateAllStocks() {
  const stocks = await getStocks();
  for (const stock of stocks) {
    console.log(`Updating data for ${stock.tickersymbol}`);
    const latestDate = await getLatestPriceDate(stock.stockid);
    let startDate = latestDate ? new Date(latestDate) : new Date('2000-01-01');
    startDate.setDate(startDate.getDate() + 1); // Start from the next day
    
    const priceData = await fetchYahooFinanceData(stock.tickersymbol, startDate);
    if (priceData.length > 0) {
      await updatePriceHistory(stock.stockid, priceData);
      console.log(`Updated ${priceData.length} records for ${stock.tickersymbol}`);
    } else {
      console.log(`No new data for ${stock.tickersymbol}`);
    }
  }

  // Call updatePortfolioStockPrices after updating all stocks
  console.log('Updating portfolio stock prices...');
  await updatePortfolioStockPrices();
  console.log('Portfolio stock prices updated successfully');
}

updateAllStocks().then(() => {
  console.log('All stocks updated successfully');
  pool.end(); // Close the database connection
}).catch(error => {
  console.error('Error updating stocks:', error);
  pool.end(); // Close the database connection
  process.exit(1);
});