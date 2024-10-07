import pg from 'pg';
import pool from './connection.js';


export async function updatePortfolioStockPrices() {
    const client = await pool.connect();
  
    try {
      await client.query('BEGIN');
  
      const updateQuery = `
        UPDATE PortfolioStocks ps
        SET currentprice = ph.closeprice
        FROM (
          SELECT StockID, closeprice
          FROM PriceHistory
          WHERE (StockID, Date) IN (
            SELECT StockID, MAX(Date) as MaxDate
            FROM PriceHistory
            GROUP BY StockID
          )
        ) ph
        WHERE ps.StockID = ph.StockID
      `;
  
      const result = await client.query(updateQuery);
      console.log(`Updated ${result.rowCount} rows in PortfolioStocks table.`);
  
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error updating PortfolioStocks:', error);
    } finally {
      client.release();
    }
  }
