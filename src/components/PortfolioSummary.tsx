import React, { useState } from 'react';
import { PortfolioStockSummary } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PortfolioSummaryProps {
  stocks: PortfolioStockSummary[];
}

const PortfolioSummary: React.FC<PortfolioSummaryProps> = ({ stocks }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalInvestment = stocks.reduce((sum, stock) => sum + Number(stock.totalinvestment), 0);
  const currentValue = stocks.reduce((sum, stock) => sum + Number(stock.currentvalue), 0);
  const totalProfitLoss = currentValue - totalInvestment;
  const percentageChange = totalInvestment !== 0 ? ((currentValue - totalInvestment) / totalInvestment) * 100 : 0;

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStocks = stocks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(stocks.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-semibold mb-4">Portfolio Summary</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-600">Total Investment</p>
          <p className="text-xl font-bold">${totalInvestment.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Current Value</p>
          <p className="text-xl font-bold">${currentValue.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Profit/Loss</p>
          <p className={`text-xl font-bold ${totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${totalProfitLoss.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Percentage Change</p>
          <p className={`text-xl font-bold ${percentageChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {percentageChange.toFixed(2)}%
          </p>
        </div>
      </div>

      <table className="min-w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purchase Price</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Investment</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Value</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit/Loss</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {currentStocks.map((stock) => (
            <tr key={stock.tickersymbol}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{stock.tickersymbol}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stock.companyname}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stock.quantity}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${Number(stock.purchaseprice).toFixed(2)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${Number(stock.totalinvestment).toFixed(2)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${Number(stock.currentvalue).toFixed(2)}</td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${Number(stock.profitloss) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${Number(stock.profitloss).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default PortfolioSummary;