import React from 'react';
import { Transaction } from '../types';

interface TransactionHistoryProps {
  transactions: Transaction[];
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden mt-6">
      <h2 className="text-2xl font-bold p-6 bg-gray-100">Transaction History</h2>
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {transactions.map((transaction) => (
            <tr key={transaction.TransactionID}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(transaction.TransactionDate).toLocaleDateString()}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.TransactionType}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{transaction.TickerSymbol}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.Quantity}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${transaction.TransactionPrice.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionHistory;