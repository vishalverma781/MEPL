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
    <div className="ml-64 px-4 sm:px-6 lg:px-8 min-h-screen bg-gradient-to-br flex items-start justify-center pt-24 pb-16">
      <div className="bg-white shadow-2xl rounded-3xl w-full max-w-lg p-16 border border-gray-200 flex flex-col items-center space-y-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800">Mark Attendance</h1>
        <p className="text-center text-gray-700 text-lg md:text-xl font-semibold">Hello, {currentUser}</p>
        <p className="text-center text-gray-600 text-lg md:text-xl">{format(currentDate, "EEEE, MMMM do yyyy, h:mm:ss a")}</p>
        <button
          onClick={handleMark}
          disabled={todayMarked || loading}
          className={`w-full py-5 md:py-6 rounded-3xl text-white font-bold text-lg md:text-xl transition-all duration-300 transform ${
            todayMarked || loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black shadow-xl hover:scale-105 hover:shadow-2xl"
          }`}
        >
          {loading ? "Marking..." : todayMarked ? "Already Marked" : "Mark Attendance"}
        </button>
      </div>
    </div>
  );
};

export default MarkAttendance;
