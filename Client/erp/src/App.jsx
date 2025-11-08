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

      // ✅ intro video state
  const [showIntro, setShowIntro] = useState(true);
  const videoRef = useRef(null);

    useEffect(() => {
    if (showIntro && videoRef.current) {
      videoRef.current.play();
      videoRef.current.addEventListener("ended", () => setShowIntro(false));
    }
  }, [showIntro]);

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


  // ✅ If intro video still showing
if (showIntro) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black z-50 p-2 sm:p-0">
      <video
        ref={videoRef}
        src="/src/assets/intro.mp4"
        className="w-full max-w-full h-auto sm:h-full object-contain sm:object-cover rounded-lg"
        muted
        autoPlay
        playsInline
      />
    </div>
  );
}


 return (
  <div
    className="flex justify-center items-center min-h-screen bg-cover bg-center px-4 sm:px-6 lg:px-8"
    style={{ backgroundImage: "url('/src/assets/bg.png')" }}
  >
    <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl lg:w-[700px] bg-white/10 backdrop-blur-xl p-6 sm:p-8 md:p-10 lg:p-12 rounded-3xl shadow-2xl text-white text-center">
      
      <div className="flex justify-center items-center mb-6">
        <img
          src={logo}
          alt="Logo"
          className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 object-contain shadow-lg rounded-full bg-white p-2 sm:p-3"
        />
      </div>

      {/* Admin / Employee Toggle */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 rounded-xl overflow-hidden text-base sm:text-lg">
        <button
          type="button"
          onClick={() => setIsAdmin(true)}
          className={`flex-1 py-3 sm:py-4 font-semibold transition-all ${
            isAdmin ? "bg-white text-gray-800" : "bg-white/20 text-white"
          }`}
        >
          Admin Login
        </button>
        <button
          type="button"
          onClick={() => setIsAdmin(false)}
          className={`flex-1 py-3 sm:py-4 font-semibold transition-all ${
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
          className="w-full p-4 sm:p-5 mb-4 rounded-lg bg-white/85 text-gray-700 text-base sm:text-lg focus:outline-none"
        />

        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 sm:p-5 pr-12 rounded-lg bg-white/85 text-gray-700 text-base sm:text-lg focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-600"
          >
            {showPassword ? (
              <EyeSlashIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            ) : (
              <EyeIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            )}
          </button>
        </div>

        <button
          type="submit"
          className="w-full py-4 sm:py-5 bg-white text-gray-800 text-base sm:text-lg font-bold rounded-lg hover:bg-gray-200 transition transform hover:scale-105"
        >
          {isAdmin ? "Login as Admin" : "Login as Employee"}
        </button>
      </form>
    </div>
  </div>
);
}

export default App;
