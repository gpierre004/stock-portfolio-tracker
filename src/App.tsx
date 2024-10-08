import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Grid } from '@mui/material';
import PortfolioSummary from './components/PortfolioSummary';
import StockList from './components/StockList';
import TransactionHistory from './components/TransactionHistory';
import TransactionForm from './components/TransactionForm';
import Watchlist from './components/Watchlist';
import ErrorBoundary from './components/ErrorBoundary';
import { PortfolioStockSummary, Transaction } from './types';
import { LineChart } from 'lucide-react';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const App: React.FC = () => {
  const [stocks, setStocks] = useState<PortfolioStockSummary[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPortfolioSummary = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/portfolio-summary');
        if (!response.ok) {
          throw new Error('Failed to fetch portfolio summary');
        }
        const data = await response.json();
        console.log('Fetched data:', data);
        setStocks(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching portfolio summary:', error);
        setError('Failed to load portfolio data. Please try again later.');
        setLoading(false);
      }
    };

    fetchPortfolioSummary();
    // TODO: Implement fetchTransactions when the API is available
  }, []);

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-600">{error}</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex items-center">
            <LineChart className="w-8 h-8 text-blue-600 mr-4" />
            <h1 className="text-3xl font-bold text-gray-900">Stock Portfolio Tracker</h1>
          </div>
        </header>
        <main className="max-w-7x2 mx-auto py-6 sm:px-6 lg:px-8">
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <ErrorBoundary>
                <PortfolioSummary stocks={stocks} />
              </ErrorBoundary>
              <div className="mt-8">
                <ErrorBoundary>
                  <StockList stocks={stocks} />
                </ErrorBoundary>
              </div>
              <div className="mt-8">
                <ErrorBoundary>
                  <TransactionHistory transactions={transactions} />
                </ErrorBoundary>
              </div>
              <div className="mt-8">
                <ErrorBoundary>
                  <Watchlist stocks={stocks} />
                </ErrorBoundary>
              </div>
            </Grid>
            <Grid item xs={12} md={4}>
              <ErrorBoundary>
                <TransactionForm />
              </ErrorBoundary>
            </Grid>
          </Grid>
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;