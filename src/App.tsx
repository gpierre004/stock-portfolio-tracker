import React, { useState, useEffect } from 'react';
import PortfolioSummary from './components/PortfolioSummary';
import StockList from './components/StockList';
import TransactionHistory from './components/TransactionHistory';
import Watchlist from './components/Watchlist';
import ErrorBoundary from './components/ErrorBoundary';
import { PortfolioStockSummary, Transaction } from './types';
import { LineChart } from 'lucide-react';

function App() {
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
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex items-center">
          <LineChart className="w-8 h-8 text-blue-600 mr-4" />
          <h1 className="text-3xl font-bold text-gray-900">Stock Portfolio Tracker</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
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
      </main>
    </div>
  );
}

export default App;