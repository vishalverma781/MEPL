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
      className={`fixed top-0 left-0 w-full flex items-center justify-between px-6 h-27.5 transition-all duration-300 shadow-md
        ${lightMode 
          ? "bg-white text-gray-800 border-b border-gray-300" 
          : "bg-gradient-to-b from-gray-900 to-gray-800 text-white border-b border-white"}
        ${isSidebarOpen ? "pl-64" : "pl-20"}`}
    >
      <div className="text-xl font-bold"></div>

      {/* Desktop Actions */}
      <div className="hidden md:flex items-center gap-4">
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800/40 hover:bg-gray-700/70 backdrop-blur-sm shadow-md transition duration-300">
          <FaBell className="text-yellow-400" />
          <span className="hidden sm:inline font-medium">Notifications</span>
        </button>

        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-gray-800/40 hover:bg-gray-700/70 backdrop-blur-sm shadow-md transition duration-300">
          <FaUserCircle className="text-blue-400 text-2xl" />
          <div className="flex flex-col">
            <span className="hidden sm:inline font-semibold">{user.username}</span>
            {/* <span className="hidden sm:inline text-sm text-gray-300">{user.position}</span> */}
          </div>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800/40 hover:bg-gray-700/70 backdrop-blur-sm shadow-md transition duration-300">
          <FaCog className="text-green-400" />
          <span className="hidden sm:inline font-medium">Settings</span>
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 shadow-lg transition duration-300"
        >
          <FaSignOutAlt />
          <span className="hidden sm:inline font-medium">Logout</span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden">
        <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-lg hover:bg-gray-700/50 transition duration-300">
          <FaBars size={24} />
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div
          className={`absolute top-20 right-4 w-56 rounded-xl shadow-lg p-4 flex flex-col gap-3 z-50
            ${lightMode ? "bg-white text-gray-800" : "bg-gray-900 text-white"}`}
        >
          <div className="flex flex-col gap-2 px-3 py-2 rounded-lg hover:bg-gray-700/50">
            <div className="flex items-center gap-2">
              <FaUserCircle className="text-blue-400 text-xl" /> {user.username}
            </div>
            <span className="text-sm text-gray-300">{user.position}</span>
          </div>
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-700/50">
            <FaBell className="text-yellow-400" /> Notifications
          </button>
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-700/50">
            <FaCog className="text-green-400" /> Settings
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
