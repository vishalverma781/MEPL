import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { FaUsers, FaProjectDiagram, FaBuilding, FaUserTie, FaUserShield, FaCalendarAlt } from "react-icons/fa";
import { motion } from "framer-motion";

const Dashboard = () => {
  const [stats, setStats] = useState({
    employees: 0,
    engineers: 0,
    projects: 0,
    plazas: 0,
    roles: 0,
    admins: 0,
  });

  const [currentDate, setCurrentDate] = useState("");

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#9A66FF", "#FF6666"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/dashboard/counts`);

        const count = res.data.employees; // employees ka count
        setStats({
          employees: count,
          engineers: count,
          projects: res.data.projects,
          plazas: res.data.plazas,
          roles: res.data.roles,
          admins: res.data.admins,
        });
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };

    fetchData();

    // Set current date in professional format
    const today = new Date();
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    setCurrentDate(today.toLocaleDateString("en-US", options));
  }, []);

  const barData = [
    { name: "Employees", count: stats.employees },
    { name: "Engineers", count: stats.engineers },
    { name: "Projects", count: stats.projects },
    { name: "Plazas", count: stats.plazas },
    { name: "Roles", count: stats.roles },
    { name: "Admins", count: stats.admins },
  ];

  const pieData = [
    { name: "Employees", value: stats.employees },
    { name: "Engineers", value: stats.engineers },
    { name: "Projects", value: stats.projects },
    { name: "Plazas", value: stats.plazas },
    { name: "Roles", value: stats.roles },
    { name: "Admins", value: stats.admins },
  ];

  const cards = [
    { title: "Employees", value: stats.employees, icon: <FaUsers className="text-blue-500 text-5xl" /> },
    { title: "Engineers", value: stats.engineers, icon: <FaUserTie className="text-green-500 text-5xl" /> },
    { title: "Projects", value: stats.projects, icon: <FaProjectDiagram className="text-purple-500 text-5xl" /> },
    { title: "Plazas", value: stats.plazas, icon: <FaBuilding className="text-orange-500 text-5xl" /> },
    { title: "Roles", value: stats.roles, icon: <FaUserShield className="text-teal-500 text-5xl" /> },
    { title: "Admins", value: stats.admins, icon: <FaUserShield className="text-red-500 text-5xl" /> },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.8, rotateX: 10 },
    visible: { opacity: 1, y: 0, scale: 1, rotateX: 0, transition: { type: "spring", stiffness: 120, damping: 15 } },
  };

  const chartVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 100, damping: 20 } },
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
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5 mb-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {cards.map((card, idx) => (
        <motion.div
          key={idx}
          variants={cardVariants}
          className="flex flex-col items-center 
                     bg-white 
                     p-3 rounded-xl 
                     shadow-sm border border-gray-100
                     hover:shadow-md hover:border-blue-200
                     transition cursor-pointer"
        >
          <motion.div
            className="text-2xl text-blue-600"
            animate={{ rotate: [0, 8, -8, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, delay: idx * 0.2 }}
          >
            {card.icon}
          </motion.div>

          <h3 className="mt-2 text-gray-700 text-sm font-semibold text-center">
            {card.title}
          </h3>

          <p className="text-xl font-bold text-gray-900 mt-1">
            {card.value}
          </p>
        </motion.div>
      ))}
    </motion.div>

    {/* Charts */}
    <motion.div 
      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >

      {/* Bar Chart */}
      <motion.div 
        variants={chartVariants}
        className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition"
      >
        <h2 className="text-base font-semibold text-center mb-3 text-gray-700">
          Company Growth
        </h2>

        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={barData}>
            <XAxis dataKey="name" stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <Tooltip />
            <Bar dataKey="count" fill="#2563EB" radius={[5,5,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Pie Chart */}
      <motion.div 
        variants={chartVariants}
        className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition"
      >
        <h2 className="text-base font-semibold text-center mb-3 text-gray-700">
          Team Composition
        </h2>

        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie 
              data={pieData} 
              dataKey="value" 
              nameKey="name" 
              outerRadius={95} 
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

export default Dashboard;
