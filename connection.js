// connection.js
import pg from 'pg';
const { Pool } = pg;

// Initialize the pool with your database configuration
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'stocks_database',
    password: '1215',
    port: 5432,
});

// Export the pool instance
export default pool;