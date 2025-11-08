import React, { useState, useEffect } from "react";
import { FaUserCircle, FaSignOutAlt, FaCog, FaBell, FaBars } from "react-icons/fa";

const Header = ({ onLogout, isSidebarOpen, lightMode }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState({ username: "", position: "" });

  // Fetch logged-in user info from JWT token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      // Admin ya Employee dono ke liye robust
      const username = payload.username || payload.fullName || "Unknown";
      const position = payload.role || payload.position || "Employee";

      setUser({ username, position });
    } catch (err) {
      console.error("Failed to parse token:", err);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    onLogout();
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full flex items-center justify-between px-6 h-[70px] transition-all duration-300 shadow-lg backdrop-blur-md
        ${
          lightMode
            ? "bg-white/90 text-gray-800 border-b border-gray-300"
            : "bg-gray-900/70 text-white border-b border-slate-700"
        }
        ${isSidebarOpen ? "md:pl-64" : "md:pl-20"}
      `}
    >
      {/* Left Section (App Name / Logo) */}
      <div className="flex items-center gap-3">
        <h1
          className={`text-xl font-semibold tracking-wide ${
            lightMode ? "text-gray-700" : "text-slate-200"
          }`}
        >
        
        </h1>
      </div>

      {/* Right Section (Profile Menu Only) */}
      <div className="relative flex items-center gap-3">
        {/* Hamburger for mobile */}
        {/* <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-3 rounded-md bg-gray-800/60 hover:bg-gray-700/70 transition duration-300"
        >
          <FaBars className="text-2xl text-white" />
        </button> */}

        {/* Profile Icon */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-2 px-3 py-2 rounded-full bg-gray-900 hover:bg-gray-700 backdrop-blur-md transition-all duration-300 shadow-md"
        >
          <FaUserCircle className="text-blue-400 text-3xl" />
          <div className="hidden md:flex flex-col text-left">
            <span className="font-semibold text-base">{user.username}</span>
            {/* <span className="text-xs text-gray-400">{user.position}</span> */}
          </div>
        </button>

        {/* Dropdown Menu */}
        {menuOpen && (
          <div
            className={`absolute top-[75px] right-0 w-60 rounded-xl shadow-2xl p-4 flex flex-col gap-3 z-50 backdrop-blur-md
              ${
                lightMode
                  ? "bg-white/90 text-gray-800 border border-gray-300"
                  : "bg-gray-900/80 text-white border border-gray-700"
              }`}
          >
            <div className="flex flex-col gap-1 border-b border-gray-600 pb-2">
              <div className="flex items-center gap-2">
                <FaUserCircle className="text-blue-400 text-2xl" />
                <div className="flex flex-col">
                  <span className="font-semibold">{user.username}</span>
                  <span className="text-xs text-gray-400">{user.position}</span>
                </div>
              </div>
            </div>

            <button className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-700/50 transition">
              <FaBell className="text-yellow-400" /> Notifications
            </button>

            <button className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-700/50 transition">
              <FaCog className="text-green-400" /> Settings
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 transition"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
