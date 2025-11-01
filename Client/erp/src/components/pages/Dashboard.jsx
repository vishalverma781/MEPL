import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { FaUsers, FaProjectDiagram, FaBuilding, FaUserTie, FaUserShield, FaCalendarAlt } from "react-icons/fa";

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
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/dashboard/counts`);

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

  return (
    <div className="min-h-screen w-full px-6 py-10 overflow-auto font-sans ">
      <div className="w-full bg-white p-6 mb-6 shadow-lg rounded-xl border-l-8 border-blue-500 flex flex-col sm:flex-row justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 tracking-wide">MahakalInfra Esolution Pvt Ltd.</h1>
          <p className="text-gray-500 mt-1">Dashboard Overview</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-xl shadow">
          <FaCalendarAlt className="text-xl" />
          <span className="font-medium">{currentDate}</span>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 justify-items-center mb-16">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-md w-48 transform transition duration-300 hover:scale-105 hover:shadow-2xl hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50"
          >
            {card.icon}
            <h3 className="mt-3 text-gray-700 text-lg font-semibold">{card.title}</h3>
            <p className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="flex flex-col lg:flex-row gap-12 w-full mb-16">
        <div className="flex-1 bg-white p-6 shadow-lg rounded-xl hover:shadow-2xl transition">
          <h2 className="text-2xl font-semibold text-center mb-4 text-gray-700">Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis dataKey="name" stroke="#4B5563" />
              <YAxis stroke="#4B5563" />
              <Tooltip />
              <Bar dataKey="count" fill="#4F46E5" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 bg-white p-6 shadow-lg rounded-xl hover:shadow-2xl transition">
          <h2 className="text-2xl font-semibold text-center mb-4 text-gray-700">Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={120} label>
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
