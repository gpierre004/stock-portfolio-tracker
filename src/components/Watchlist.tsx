import React from 'react';
import { PortfolioStockSummary } from '../types';

interface WatchlistProps {
  stocks: PortfolioStockSummary[];
}

const Watchlist: React.FC<WatchlistProps> = ({ stocks }) => {
  const totalQuantity = stocks.reduce((sum, stock) => sum + stock.quantity, 0);
  const totalProfitLoss = stocks.reduce((sum, stock) => sum + stock.profitloss, 0);
  const percentageChange = stocks.reduce((sum, stock) => sum + stock.totalinvestment, 0) !== 0
    ? (totalProfitLoss / stocks.reduce((sum, stock) => sum + stock.totalinvestment, 0)) * 100
    : 0;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Watchlist</h2>
      <div>
        <p className="text-sm text-gray-600">Total Quantity</p>
        <p className="text-xl font-bold">{totalQuantity}</p>
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-600">Total Profit/Loss</p>
        <p className={`text-xl font-bold ${totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          ${totalProfitLoss.toFixed(2)} ({percentageChange.toFixed(2)}%)
        </p>
      </div>
    </div>
  );
};

export default Watchlist;