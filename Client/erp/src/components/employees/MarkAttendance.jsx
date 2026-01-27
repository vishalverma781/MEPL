import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { format } from "date-fns";
import axios from "axios";

const MarkAttendance = () => {
  const [status] = useState("Present"); // future me dropdown add kar sakte ho
  const [todayMarked, setTodayMarked] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState("Employee");
  const [username, setUsername] = useState("employee");

  // JWT parse safely
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setCurrentUser(payload.fullName || payload.username || "Employee");
        setUsername(payload.username || "employee"); // ye backend me bhejenge
      } catch (err) {
        console.error("Failed to parse token:", err);
      }
    }
  }, []);

  // Live clock
  useEffect(() => {
    const interval = setInterval(() => setCurrentDate(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleMark = async () => {
    if (todayMarked || loading) return;
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

       const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/attendance`, // ✅ Fixed backticks
        { markedBy: username },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );

      if (res.status === 200 || res.status === 201) {
        setTodayMarked(true);
        Swal.fire({
          icon: "success",
          title: "Attendance Marked! ✅",
          text: `Hello ${currentUser}, your attendance is marked as "${status}"`,
          showConfirmButton: false,
          timer: 2000,
          background: "#f0fff4",
          iconColor: "#16a34a",
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err?.response?.data?.message || err.message, "error");
    } finally {
      setLoading(false);
    }
  };

return (
<div className="flex-1 min-h-screen overflow-y-auto transition-all duration-300 md:ml-80 px-10 sm:px-6 lg:px-8 py-6">

    <div className="bg-white shadow-xl rounded-2xl 
                    w-full max-w-md 
                    p-10 sm:p-8 
                    border border-gray-200 
                    flex flex-col items-center space-y-4">

      <h1 className="text-xl sm:text-2xl font-bold text-center text-gray-800">
        Mark Attendance
      </h1>

      <p className="text-center text-gray-700 text-sm sm:text-base font-semibold">
        Hello, {currentUser}
      </p>

      <p className="text-center text-gray-500 text-xs sm:text-sm">
        {format(currentDate, "EEEE, MMMM do yyyy, h:mm:ss a")}
      </p>

      <button
        onClick={handleMark}
        disabled={todayMarked || loading}
        className={`w-full py-2.5 sm:py-3 rounded-xl 
                    text-white font-semibold text-sm sm:text-base
                    transition-all duration-300 ${
          todayMarked || loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gray-800 hover:bg-black hover:shadow-lg hover:scale-[1.02]"
        }`}
      >
        {loading 
          ? "Marking..." 
          : todayMarked 
            ? "Already Marked" 
            : "Mark Attendance"}
      </button>

    </div>
  </div>
);

};

export default MarkAttendance;
