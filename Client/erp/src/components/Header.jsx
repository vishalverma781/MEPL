import React, { useState, useEffect } from "react";
import { FaUserCircle, FaSignOutAlt, FaCog, FaBell, FaBars, FaSun, FaMoon } from "react-icons/fa";

const Header = ({ onLogout, isSidebarOpen, lightMode, toggleMode }) => {
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
    className={`fixed top-0 left-0 w-full flex items-center justify-between 
      px-3 sm:px-4 h-[56px] 
      transition-all duration-300 shadow-md backdrop-blur-md
      ${
        lightMode
          ? "bg-white/90 text-gray-800 border-b border-gray-300"
          : "bg-gray-900/80 text-white border-b border-slate-700"
      }
      ${isSidebarOpen ? "md:pl-64" : "md:pl-20"}
    `}
  >
    {/* Left Section */}
    <div className="flex items-center gap-2">
      <h1
        className={`text-base font-semibold tracking-wide ${
          lightMode ? "text-gray-700" : "text-slate-200"
        }`}
      >
        {/* App Name / Logo */}
      </h1>
    </div>

    {/* Right Section */}
    <div className="relative flex items-center gap-2 sm:gap-3">
      {/* Light / Dark Toggle */}
      <button
        onClick={toggleMode}
        className={`flex items-center justify-center 
          w-8 h-8 rounded-full transition-all shadow
          ${lightMode ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-200 hover:bg-gray-300"}
        `}
      >
        {lightMode ? (
          <FaMoon className="text-white text-sm" />
        ) : (
          <FaSun className="text-yellow-500 text-sm" />
        )}
      </button>

      {/* Profile */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex items-center gap-2 px-2 py-1.5 
        rounded-full bg-gray-800 hover:bg-gray-700 
        transition shadow"
      >
        <FaUserCircle className="text-blue-400 text-2xl" />
        <div className="hidden md:flex flex-col text-left">
          <span className="font-semibold text-sm">
            {user.username}
          </span>
        </div>
      </button>

      {/* Dropdown */}
      {menuOpen && (
        <div
          className={`absolute top-[58px] right-0 w-52 
            rounded-xl shadow-xl p-3 flex flex-col gap-2 z-50
            ${
              lightMode
                ? "bg-white text-gray-800 border border-gray-300"
                : "bg-gray-900 text-white border border-gray-700"
            }`}
        >
          <div className="flex items-center gap-2 border-b border-gray-600 pb-2">
            <FaUserCircle className="text-blue-400 text-xl" />
            <div>
              <span className="font-semibold text-sm">
                {user.username}
              </span>
              {/* <span className="text-xs text-gray-400">
                {user.position}
              </span> */}
            </div>
          </div>

          <button className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-gray-700/40 text-sm">
            <FaBell className="text-yellow-400" /> Notifications
          </button>

          <button className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-gray-700/40 text-sm">
            <FaCog className="text-green-400" /> Settings
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm
            bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600"
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
