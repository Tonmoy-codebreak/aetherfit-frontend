import React from "react";

import { useQuery } from "@tanstack/react-query";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'; // Import Recharts components
import { FaDollarSign, FaUsers, FaChartPie, FaChartBar } from 'react-icons/fa'; // Icons for better UI
import useAxios from "../../hooks/useAxios";

const BalanceAdmin = () => {
  const axiosSecure = useAxios()
  const { data, isLoading, isError } = useQuery({
    queryKey: ["balance-summary"],
    queryFn: async () => {
      const res = await axiosSecure.get(`${import.meta.env.VITE_API_URL}/admin/balance-summary`);
      return res.data;
    },
  });

  // New query for user statistics
  const { data: userStats, isLoading: isUserStatsLoading, isError: isUserStatsError } = useQuery({
    queryKey: ["user-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get(`${import.meta.env.VITE_API_URL}/admin/user-stats`);
      return res.data;
    },
  });

  // Overall loading/error states
  if (isLoading || isUserStatsLoading) return (
    <div className="flex justify-center items-center min-h-screen bg-zinc-950">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-[#faba22]"></div>
      <p className="text-[#faba22] ml-4 text-xl font-inter">Loading summary and user stats...</p>
    </div>
  );
  if (isError || isUserStatsError) return (
    <div className="flex justify-center items-center min-h-screen bg-zinc-950">
      <p className="text-red-500 text-xl font-inter">Error loading balance or user statistics!</p>
    </div>
  );

  // Filter out deleted trainers
  const activeTrainers = data.trainerBalances.filter((item) => !item.isDeleted);

  // Prepare data for the pie chart
  const chartData = [
    { name: 'Newsletter Subscribers', value: userStats.totalNewsletterSubscribers || 0 },
    { name: 'Paid Members', value: userStats.totalPaidMembers || 0 },
  ];

  const COLORS = ['#faba22', '#4CAF50']; // Colors for the pie chart segments

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-inter p-8 sm:p-12 lg:p-16">
      <h1 className="text-5xl md:text-6xl font-bold font-funnel text-center mb-12 text-[#faba22] drop-shadow-lg">
        Admin Balance & User Overview
      </h1>

      {/* Total Balance & Active Trainers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-zinc-900 rounded-2xl shadow-xl p-8 border border-zinc-800 flex flex-col items-center justify-center text-center">
          <FaDollarSign className="text-[#faba22] text-5xl mb-4" />
          <h2 className="text-2xl font-semibold mb-2 text-white">Total Balance</h2>
          <p className="text-4xl font-bold text-[#faba22]">${data?.totalBalance?.toFixed(2)}</p>
        </div>

        <div className="bg-zinc-900 rounded-2xl shadow-xl p-8 border border-zinc-800 flex flex-col items-center justify-center text-center">
          <FaUsers className="text-[#faba22] text-5xl mb-4" />
          <h2 className="text-2xl font-semibold mb-2 text-white">Active Trainers</h2>
          <p className="text-4xl font-bold text-[#faba22]">{activeTrainers.length}</p>
        </div>
      </div>

      {/* Newsletter Subscribers vs Paid Members Chart */}
      <div className="bg-zinc-900 rounded-2xl shadow-xl p-8 border border-zinc-800 mb-12">
        <h2 className="text-3xl font-semibold mb-6 text-white text-center flex items-center justify-center gap-3">
          <FaChartPie className="text-[#faba22]" />
          User Demographics
        </h2>
        <div className="h-80 w-full"> {/* Responsive container for the chart */}
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                nameKey="name" // Use nameKey for tooltip and legend
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#3f3f46', borderColor: '#faba22', borderRadius: '8px', color: '#fff' }}
                itemStyle={{ color: '#fff' }}
                formatter={(value, name) => [`${value}`, name]} // Show value and name
              />
              <Legend
                wrapperStyle={{ color: '#fff' }} // Style legend text
                formatter={(value) => <span style={{ color: '#fff' }}>{value}</span>} // Ensure legend text is white
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Trainer Balances Table */}
      <div className="bg-zinc-900 rounded-2xl shadow-xl p-8 border border-zinc-800 mb-12">
        <h2 className="text-3xl font-semibold mb-6 text-white text-center">Trainer Balances</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-700">
            <thead className="bg-zinc-800">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-zinc-400 uppercase tracking-wider rounded-tl-lg">
                  Trainer Name
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-zinc-400 uppercase tracking-wider">
                  Trainer Email
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-zinc-400 uppercase tracking-wider rounded-tr-lg">
                  Total Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {activeTrainers.length > 0 ? (
                activeTrainers.map((item) => (
                  <tr key={item.trainerId} className="bg-zinc-900 hover:bg-zinc-800 transition-colors duration-200">
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-zinc-300">{item.trainerName || 'N/A'}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-zinc-300">{item.trainerEmail || 'N/A'}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-zinc-300">${item.totalAmount.toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="p-4 text-center text-zinc-400 italic">
                    No active trainers with balances found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Last Transactions Table */}
      <div className="bg-zinc-900 rounded-2xl shadow-xl p-8 border border-zinc-800">
        <h2 className="text-3xl font-semibold mb-6 text-white text-center">Last 6 Transactions</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-700">
            <thead className="bg-zinc-800">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-zinc-400 uppercase tracking-wider rounded-tl-lg">
                  Trainer Name
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-zinc-400 uppercase tracking-wider">
                  User Email
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-zinc-400 uppercase tracking-wider rounded-tr-lg">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {data.lastSixTransactions.length > 0 ? (
                data.lastSixTransactions.map((txn) => (
                  <tr key={txn._id} className="bg-zinc-900 hover:bg-zinc-800 transition-colors duration-200">
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-zinc-300">{txn.trainerName || 'N/A'}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-zinc-300">{txn.userEmail || 'N/A'}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-zinc-300">${Number(txn.packagePrice).toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="p-4 text-center text-zinc-400 italic">
                    No recent transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BalanceAdmin;
