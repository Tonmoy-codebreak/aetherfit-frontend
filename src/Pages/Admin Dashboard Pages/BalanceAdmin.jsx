import React from "react";
import { useQuery } from "@tanstack/react-query";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { FaDollarSign, FaUsers, FaChartPie, FaNewspaper, FaCreditCard } from 'react-icons/fa';
import useAxios from "../../hooks/useAxios";

const BalanceAdmin = () => {
  const axiosSecure = useAxios();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["balance-summary"],
    queryFn: async () => {
      const res = await axiosSecure.get(`${import.meta.env.VITE_API_URL}/admin/balance-summary`);
      return res.data;
    },
  });

  const { data: userStats, isLoading: isUserStatsLoading, isError: isUserStatsError } = useQuery({
    queryKey: ["user-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get(`${import.meta.env.VITE_API_URL}/admin/user-stats`);
      return res.data;
    },
  });

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

  const activeTrainers = data.trainerBalances.filter(item => !item.isDeleted);

  const chartData = [
    { name: 'Newsletter Subscribers', value: userStats.totalNewsletterSubscribers || 0 },
    { name: 'Paid Members', value: userStats.totalPaidMembers || 0 },
  ];

  const COLORS = ['#faba22', '#4CAF50'];

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-inter p-4 sm:p-8 lg:p-16">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold font-funnel text-center mb-12 text-[#faba22] drop-shadow-lg">
          Admin Balance & User Overview
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-3xl shadow-2xl p-8 lg:p-10 border border-zinc-700 flex flex-col items-center justify-center text-center transition-transform duration-300 hover:scale-[1.01]">
            <FaDollarSign className="text-[#faba22] text-6xl mb-6" />
            <h2 className="text-2xl sm:text-3xl font-semibold mb-3 text-white">Total Balance</h2>
            <p className="text-3xl lg:text-3xl font-extrabold text-[#faba22]">${data?.totalBalance?.toFixed(2)}</p>
          </div>

          <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-3xl shadow-2xl p-8 lg:p-10 border border-zinc-700 flex flex-col items-center justify-center text-center transition-transform duration-300 hover:scale-[1.01]">
            <FaUsers className="text-[#faba22] text-6xl mb-6" />
            <h2 className="text-2xl sm:text-3xl font-semibold mb-3 text-white">Active Trainers</h2>
            <p className="text-3xl font-extrabold text-[#faba22]">{activeTrainers.length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 bg-zinc-900 rounded-2xl shadow-xl p-6 sm:p-8 border border-zinc-800 flex flex-col">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-white text-center flex items-center justify-center gap-3">
              <FaChartPie className="text-[#faba22]" /> User Demographics
            </h2>
            <div className="flex-grow h-72 sm:h-80 w-full">
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
                    nameKey="name"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#3f3f46', borderColor: '#faba22', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value, name) => [`${value}`, name]}
                  />
                  <Legend wrapperStyle={{ color: '#fff', paddingTop: '16px' }} formatter={(value) => <span style={{ color: '#fff' }}>{value}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8">
            <div className="bg-zinc-900 rounded-2xl shadow-md p-6 border border-zinc-800 flex flex-col items-center justify-center text-center">
              <FaNewspaper className="text-[#faba22] text-4xl mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-white">Newsletter Subscribers</h3>
              <p className="text-3xl font-bold text-[#faba22]">{userStats.totalNewsletterSubscribers || 0}</p>
            </div>

            <div className="bg-zinc-900 rounded-2xl shadow-md p-6 border border-zinc-800 flex flex-col items-center justify-center text-center">
              <FaCreditCard className="text-[#4CAF50] text-4xl mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-white">Paid Members</h3>
              <p className="text-3xl font-bold text-[#4CAF50]">{userStats.totalPaidMembers || 0}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-zinc-900 rounded-2xl shadow-xl md:p-6  border border-zinc-800 flex flex-col">
            <h2 className="text-2xl pt-3 sm:text-3xl font-semibold mb-6 text-white text-center">Trainer Balances</h2>
            <div className="overflow-x-auto flex-grow">
              <table className="min-w-full divide-y divide-zinc-700 rounded-lg overflow-hidden text-xs sm:text-sm">
                <thead className="bg-zinc-800">
                  <tr>
                    <th className="px-2 py-2 sm:px-4 sm:py-3 text-left font-medium text-zinc-400 uppercase tracking-wider hidden md:block rounded-tl-lg">Trainer Name</th>
                    <th className="px-2 py-2 sm:px-4 sm:py-3 text-left font-medium text-zinc-400 uppercase tracking-wider">Trainer Email</th>
                    <th className="px-2 py-2 sm:px-4 sm:py-3 text-left font-medium text-zinc-400 uppercase tracking-wider rounded-tr-lg">Total Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {activeTrainers.length > 0 ? (
                    activeTrainers.map((item) => (
                      <tr key={item.trainerId} className="bg-zinc-900 hover:bg-zinc-800 transition-colors duration-200">
                        <td className="px-2 py-2 hidden md:block  sm:px-4 sm:py-4 whitespace-nowrap text-zinc-300">{item.trainerName || 'N/A'}</td>
                        <td className="px-2 py-2 sm:px-4 sm:py-4 whitespace-nowrap text-zinc-300">{item.trainerEmail || 'N/A'}</td>
                        <td className="px-2 py-2 sm:px-4 sm:py-4 whitespace-nowrap text-zinc-300">${item.totalAmount.toFixed(2)}</td>
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

          <div className="bg-zinc-900 rounded-2xl shadow-xl md:p-6 border border-zinc-800 flex flex-col">
            <h2 className="text-2xl pt-3 sm:text-3xl font-semibold mb-6 text-white text-center">Last 6 Transactions</h2>
            <div className="overflow-x-auto flex-grow">
              <table className="min-w-full divide-y divide-zinc-700 rounded-lg overflow-hidden text-xs sm:text-sm">
                <thead className="bg-zinc-800">
                  <tr>
                    <th className="px-2 py-2 sm:px-4 sm:py-3 text-left font-medium text-zinc-400 uppercase tracking-wider hidden md:block  rounded-tl-lg">Trainer Name</th>
                    <th className="px-2 py-2 sm:px-4 sm:py-3 text-left font-medium text-zinc-400 uppercase tracking-wider">User Email</th>
                    <th className="px-2 py-2 sm:px-4 sm:py-3 text-left font-medium text-zinc-400 uppercase tracking-wider rounded-tr-lg">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {data.lastSixTransactions.length > 0 ? (
                    data.lastSixTransactions.map((txn) => (
                      <tr key={txn._id} className="bg-zinc-900 hover:bg-zinc-800 transition-colors duration-200">
                        <td className="px-2 py-2 hidden md:block  sm:px-4 sm:py-4 whitespace-nowrap text-zinc-300">{txn.trainerName || 'N/A'}</td>
                        <td className="px-2 py-2 sm:px-4 sm:py-4 whitespace-nowrap text-zinc-300">{txn.userEmail || 'N/A'}</td>
                        <td className="px-2 py-2 sm:px-4 sm:py-4 whitespace-nowrap text-zinc-300">${Number(txn.packagePrice).toFixed(2)}</td>
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
      </div>
    </div>
  );
};

export default BalanceAdmin;
