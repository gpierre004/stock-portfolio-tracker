import React from 'react';
import { PortfolioStockSummary } from '../types';

interface StockListProps {
  stocks: PortfolioStockSummary[];
}

const StockList: React.FC<StockListProps> = ({ stocks }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <h2 className="text-2xl font-semibold p-6">Stock List</h2>
      <table className="min-w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purchase Price</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Value</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit/Loss</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {stocks.map((stock) => (
            <tr key={stock.tickersymbol}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{stock.tickersymbol}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stock.companyname}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stock.quantity}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${Number(stock.purchaseprice).toFixed(2)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${Number(stock.currentvalue).toFixed(2)}</td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${Number(stock.profitloss) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${Number(stock.profitloss).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockList;