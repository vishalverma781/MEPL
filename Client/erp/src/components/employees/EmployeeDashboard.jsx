import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { FaCalendarAlt, FaBug, FaMoneyCheckAlt } from "react-icons/fa";
import { motion } from "framer-motion";

const EmployeeDashboardFull = () => {
  const [stats, setStats] = useState({
    attendance: 0,
    leaves: 0,
    trackIssues: 0,
    payrolls: 0,
  });
  const [currentDate, setCurrentDate] = useState("");

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/dashboard/employee-counts`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setStats(res.data);
      } catch (err) {
        console.error("Error fetching employee dashboard data:", err);
      }
    };

    fetchData();

    // Set current date in professional format
    const today = new Date();
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    setCurrentDate(today.toLocaleDateString("en-US", options));
  }, []);

  const barData = [
    { name: "Attendance", count: stats.attendance },
    { name: "Leaves", count: stats.leaves },
    { name: "Track Issues", count: stats.trackIssues },
    { name: "Payrolls", count: stats.payrolls },
  ];

  const pieData = [
    { name: "Attendance", value: stats.attendance },
    { name: "Leaves", value: stats.leaves },
    { name: "Track Issues", value: stats.trackIssues },
    { name: "Payrolls", value: stats.payrolls },
  ];

  const cards = [
    {
      title: "Attendance",
      value: stats.attendance,
      icon: <FaCalendarAlt className="text-blue-500 text-5xl" />,
    },
    {
      title: "Leaves",
      value: stats.leaves,
      icon: <FaCalendarAlt className="text-red-500 text-5xl" />,
    },
    {
      title: "Track Issues",
      value: stats.trackIssues,
      icon: <FaBug className="text-orange-500 text-5xl" />,
    },
    {
      title: "Payrolls",
      value: stats.payrolls,
      icon: <FaMoneyCheckAlt className="text-green-500 text-5xl" />,
    },
  ];

 const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 120, damping: 15 },
    },
  };

  const chartVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 20 },
    },
  };

  return (
    <div className="min-h-screen w-full px-6 py-10 overflow-auto font-sans">
      {/* Header */}
      <div className="w-full bg-white p-6 mb-6 shadow-lg rounded-xl border-l-8 border-blue-500 flex flex-col sm:flex-row justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 tracking-wide">
            MahakalInfra Esolution Pvt Ltd.
          </h1>
          <p className="text-gray-500 mt-1">Dashboard Overview</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-xl shadow">
          <FaCalendarAlt className="text-xl" />
          <span className="font-medium">{currentDate}</span>
        </div>
      </div>

      {/* Cards */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 justify-items-center mb-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {cards.map((card, idx) => (
          <motion.div
            key={idx}
            className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-md w-48 transform transition duration-300 hover:scale-105 hover:shadow-2xl hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50"
            variants={cardVariants}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2, delay: idx * 0.3 }}
            >
              {card.icon}
            </motion.div>
            <h3 className="mt-3 text-gray-700 text-lg font-semibold">
              {card.title}
            </h3>
            <p className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">
              {card.value}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts */}
      <motion.div
        className="flex flex-col lg:flex-row gap-12 w-full mb-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="flex-1 bg-white p-6 shadow-lg rounded-xl hover:shadow-2xl transition"
          variants={chartVariants}
        >
          <h2 className="text-2xl font-semibold text-center mb-4 text-gray-700">
            Workforce States
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis dataKey="name" stroke="#4B5563" />
              <YAxis stroke="#4B5563" />
              <Tooltip />
              <Bar dataKey="count" fill="#4F46E5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          className="flex-1 bg-white p-6 shadow-lg rounded-xl hover:shadow-2xl transition"
          variants={chartVariants}
        >
          <h2 className="text-2xl font-semibold text-center mb-4 text-gray-700">
            Team Composition
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={120}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default EmployeeDashboardFull;
