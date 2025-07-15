import React from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const BalanceAdmin = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["balance-summary"],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/balance-summary`);
      return res.data;
    },
  });

  if (isLoading) return <p className="text-center text-lg">Loading summary...</p>;
  if (isError) return <p className="text-center text-red-500">Error loading balance summary!</p>;

  // Filter out deleted trainers
  const activeTrainers = data.trainerBalances.filter((item) => !item.isDeleted);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Total Balance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-5">
          <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">Total Balance</h2>
          <p className="text-3xl font-bold text-primary">${data?.totalBalance?.toFixed(2)}</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-5">
          <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">Active Trainers</h2>
          <p className="text-3xl font-bold text-primary">{activeTrainers.length}</p>
        </div>
      </div>

      {/* Trainer Balances */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Trainer Balances</h2>
        <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-lg shadow">
          <table className="min-w-full text-sm text-gray-700 dark:text-gray-300">
            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
              <tr>
                <th className="p-3">Trainer Name</th>
                <th className="p-3">Trainer Email</th>
                <th className="p-3">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {activeTrainers.map((item) => (
                <tr key={item.trainerId} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="p-3">{item.trainerName}</td>
                  <td className="p-3">{item.trainerEmail}</td>
                  <td className="p-3">${item.totalAmount.toFixed(2)}</td>
                </tr>
              ))}
              {activeTrainers.length === 0 && (
                <tr>
                  <td colSpan="3" className="p-4 text-center text-gray-500 dark:text-gray-400">
                    No active trainers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Last Transactions */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Last 6 Transactions</h2>
        <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-lg shadow">
          <table className="min-w-full text-sm text-gray-700 dark:text-gray-300">
            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
              <tr>
                <th className="p-3">Trainer Name</th>
                <th className="p-3">User Email</th>
                <th className="p-3">Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.lastSixTransactions.map((txn) => (
                <tr key={txn._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="p-3">{txn.trainerName}</td>
                  <td className="p-3">{txn.userEmail}</td>
                  <td className="p-3">${Number(txn.packagePrice).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BalanceAdmin;
