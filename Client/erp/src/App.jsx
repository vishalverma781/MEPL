import { useState } from "react";
import logo from "./assets/logo.png";
import "./index.css";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import Swal from "sweetalert2";
import axios from "axios";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

function App() {
  const [isAdmin, setIsAdmin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [lightMode, setLightMode] = useState(false);

  // ✅ input states
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const url = isAdmin
  ? `${import.meta.env.VITE_API_URL}/user/login`
  : `${import.meta.env.VITE_API_URL}/employees/login`;

    const res = await axios.post(url, { identifier, password });

    // Role check
    if (isAdmin && !(res.data.role === "Admin" || res.data.role === "SuperAdmin")) {
      Swal.fire({ title: "Error", text: "Not an admin!", icon: "error" });
      return;
    }

    if (!isAdmin && res.data.role !== "Employee") {
      Swal.fire({ title: "Error", text: "Not an employee!", icon: "error" });
      return;
    }

    // ✅ Success case
    setLoggedIn(true);
    setRole(res.data.role);

    // ✅ Set token & role
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("role", res.data.role);
    localStorage.setItem("userId", res.data.user);

    // ✅ Set userType for Sidebar dual login
    localStorage.setItem("userType", isAdmin ? "admin" : "employee");

    // ✅ Add currentUser info (admin ya employee dono ke liye)
    localStorage.setItem(
      "currentUser",
      JSON.stringify({
        _id: res.data.user,
        username: isAdmin
          ? identifier
          : res.data.username || res.data.fullName, // employee ke liye username ya fullName
        role: res.data.role,
      })
    );

    Swal.fire({
      title: "Login Successful!",
      text: `Welcome, ${res.data.role}`,
      icon: "success",
      confirmButtonText: "OK",
    });
  } catch (err) {
    Swal.fire({
      title: "Login Failed",
      text: err.response?.data?.message || "Server error",
      icon: "error",
      confirmButtonText: "OK",
    });
  }
};
  // ✅ Login ke baad Sidebar + Dashboard khulega
  if (loggedIn) {
    return (
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <Header
          onLogout={() => {
            setLoggedIn(false);
            setRole("");
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            localStorage.removeItem("userId");
            
          }}
          isSidebarOpen={isSidebarOpen}
          lightMode={lightMode}
        />

        {/* Main content + Sidebar */}
        <div className="flex flex-1 mt-16">
          <Sidebar />
          <div className="flex-1 p-6">
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center p-6"
       style={{ backgroundColor: "#1f2937" }}
    >
      <div className="w-[700px] max-w-[95%] bg-white/10 backdrop-blur-xl p-12 rounded-3xl shadow-2xl text-white text-center">
        <div className="flex justify-center items-center mb-6">
          <img
            src={logo}
            alt="Logo"
            className="w-32 h-32 object-contain shadow-lg rounded-full bg-white p-3"
          />
        </div>

        {/* Admin / Employee Toggle */}
        <div className="flex gap-4 mb-8 rounded-xl overflow-hidden text-lg">
          <button
            type="button"
            onClick={() => setIsAdmin(true)}
            className={`flex-1 py-4 font-semibold transition-all ${
              isAdmin ? "bg-white text-gray-800" : "bg-white/20 text-white"
            }`}
          >
            Admin Login
          </button>
          <button
            type="button"
            onClick={() => setIsAdmin(false)}
            className={`flex-1 py-4 font-semibold transition-all ${
              !isAdmin ? "bg-white text-gray-800" : "bg-white/20 text-white"
            }`}
          >
            Employee Login
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username or Email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="w-full p-5 mb-4 rounded-lg bg-white/85 text-gray-700 text-lg focus:outline-none"
          />

          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-5 pr-12 rounded-lg bg-white/85 text-gray-700 text-lg focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600"
            >
              {showPassword ? (
                <EyeSlashIcon className="w-6 h-6" />
              ) : (
                <EyeIcon className="w-6 h-6" />
              )}
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-5 bg-white text-gray-800 text-lg font-bold rounded-lg hover:bg-gray-200 transition transform hover:scale-105"
          >
            {isAdmin ? "Login as Admin" : "Login as Employee"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
