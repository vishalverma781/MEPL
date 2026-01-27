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
  <div className="flex-1 min-h-screen overflow-y-auto transition-all duration-300 md:ml-50 p-10 px-8 py-6">
    {/* Header */}
    <div className="w-full bg-white px-6 py-4 mb-6 
                    shadow-md rounded-xl 
                    border-l-4 border-blue-600
                    flex flex-col sm:flex-row justify-between items-center">

      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-wide">
          MahakalInfra Esolution Pvt Ltd.
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Dashboard Overview
        </p>
      </div>

      <div className="mt-3 sm:mt-0 flex items-center gap-2 
                      bg-blue-50 text-blue-700 
                      px-4 py-2 rounded-lg 
                      text-sm font-semibold shadow-sm">
        <FaCalendarAlt />
        <span>{currentDate}</span>
      </div>
    </div>

    {/* Cards */}
    <motion.div
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {cards.map((card, idx) => (
        <motion.div
          key={idx}
          variants={cardVariants}
          className="flex flex-col items-center bg-white 
                     px-3 py-3 rounded-lg shadow-sm 
                     border border-gray-100
                     hover:shadow-md hover:border-blue-200
                     transition cursor-pointer"
        >
          <motion.div
            className="text-xl text-blue-600"
            animate={{ rotate: [0, 8, -8, 0] }}
            transition={{ repeat: Infinity, duration: 2, delay: idx * 0.15 }}
          >
            {card.icon}
          </motion.div>

          <h3 className="mt-1 text-gray-700 text-xs font-semibold text-center">
            {card.title}
          </h3>

          <p className="text-lg font-bold text-gray-900 mt-1">
            {card.value}
          </p>
        </motion.div>
      ))}
    </motion.div>

    {/* Charts */}
    <motion.div
      className="grid grid-cols-1 lg:grid-cols-2 gap-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      
      {/* Bar Chart */}
      <motion.div
        variants={chartVariants}
        className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition"
      >
        <h2 className="text-sm font-semibold text-center mb-2 text-gray-700">
          Workforce States
        </h2>

        <ResponsiveContainer width="100%" height={230}>
          <BarChart data={barData}>
            <XAxis dataKey="name" stroke="#6B7280" fontSize={10} />
            <YAxis stroke="#6B7280" fontSize={10} />
            <Tooltip />
            <Bar dataKey="count" fill="#2563EB" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Pie Chart */}
      <motion.div 
        variants={chartVariants}
        className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition"
      >
        <h2 className="text-sm font-semibold text-center mb-2 text-gray-700">
          Team Composition
        </h2>

        <ResponsiveContainer width="100%" height={230}>
          <PieChart>
            <Pie 
              data={pieData}
              dataKey="value"
              nameKey="name"
              outerRadius={85}
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: "10px" }} />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>

    </motion.div>
  </div>
);

};

export default EmployeeDashboardFull;
