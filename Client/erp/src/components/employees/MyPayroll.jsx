import React, { useState, useEffect } from "react";
import { FaEye } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";

const MyPayroll = () => {
  const [myRecords, setMyRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // ----- Get logged-in user from JWT token -----
  const [user, setUser] = React.useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const username = payload.username || payload.fullName;
      setUser({ username });
    } catch (err) {
      console.error("Failed to parse token:", err);
    }
  }, []);

  useEffect(() => {
    const fetchPayrolls = async () => {
      if (!user || !user.username) return;
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/payrolls`,);
        const filtered = res.data.filter((rec) => rec.username === user.username);
        setMyRecords(filtered);
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to fetch payrolls", "error");
      }
    };
    fetchPayrolls();
  }, [user]);

  if (!user) {
    return (
      <div className="text-center mt-20 text-xl font-semibold text-red-500">
        Please login to view your payroll.
      </div>
    );
  }

  if (myRecords.length === 0) {
    return (
      <div className="text-center mt-20 text-xl font-semibold text-gray-700">
        No payroll records found for {user.username}.
      </div>
    );
  }

return (
  <div className="flex-1 min-h-screen overflow-y-auto transition-all duration-300 md:ml-45 px-10 sm:px-6 lg:px-8 py-6">
    
    <div className="bg-white shadow-xl rounded-xl w-full max-w-4xl mx-auto p-10 sm:p-7 border border-gray-200">

      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 text-gray-900">
        My Payroll
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 rounded-lg overflow-hidden text-sm sm:text-base">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="py-3 px-4 whitespace-nowrap text-left">Full Name</th>
              <th className="py-3 px-4 hidden sm:table-cell">Username</th>
              <th className="py-3 px-4 hidden whitespace-nowrap sm:table-cell">Phone</th>
              <th className="py-3 px-4 hidden sm:table-cell">Department</th>
              <th className="py-3 px-4">Salary</th>
              <th className="py-3 px-4">Expense</th>
              <th className="py-3 px-2 text-center">View</th>
            </tr>
          </thead>

          <tbody>
            {myRecords.map((rec) => (
              <tr
                key={rec._id}
                className="border-b border-gray-200 hover:bg-gray-50 transition"
              >
                <td className="py-3 px-4 whitespace-nowrap font-semibold">{rec.fullName}</td>
                <td className="py-3 px-4  hidden sm:table-cell">{rec.username || "-"}</td>
                <td className="py-3 px-4 hidden whitespace-nowrap sm:table-cell">{rec.phone || "-"}</td>
                <td className="py-3 px-4 whitespace-nowrap hidden sm:table-cell">{rec.department || "-"}</td>
                <td className="py-3 px-4 whitespace-nowrap font-semibold">₹ {rec.salary}</td>
                <td className="py-3 whitespace-nowrap px-4">₹ {rec.expense}</td>
                <td className="py-3 px-2 text-center">
                  <button
                    onClick={() => setSelectedRecord(rec)}
                    className="text-green-600 hover:text-green-800"
                  >
                    <FaEye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===== Modal ===== */}
      {selectedRecord && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 p-3">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md sm:max-w-2xl p-4 sm:p-6">

            <h3 className="text-lg sm:text-xl font-bold mb-3 text-center text-gray-900">
              Payroll Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-800 text-xs sm:text-sm font-medium">
              <p><b>Full Name:</b> {selectedRecord.fullName}</p>
              <p><b>Username:</b> {selectedRecord.username || "N/A"}</p>
              <p><b>Phone:</b> {selectedRecord.phone || "N/A"}</p>
              <p><b>Department:</b> {selectedRecord.department || "N/A"}</p>
              <p><b>Bank:</b> {selectedRecord.bankName || "N/A"}</p>
              <p><b>Account:</b> {selectedRecord.accountNumber || "N/A"}</p>
              <p><b>IFSC:</b> {selectedRecord.ifsc || "N/A"}</p>
              <p><b>Leaves:</b> {selectedRecord.leaves || "0"}</p>
              <p><b>Salary:</b> ₹ {selectedRecord.salary}</p>
              <p><b>Expense:</b> ₹ {selectedRecord.expense}</p>
              <p><b>Month:</b> {selectedRecord.month || "N/A"}</p>
              <p><b>Date:</b> {selectedRecord.date || "N/A"}</p>
            </div>

            <div className="mt-4 flex justify-center">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-5 py-1.5 bg-gray-800 text-white rounded-md hover:bg-gray-600 transition text-xs sm:text-sm font-semibold"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  </div>
);


};

export default MyPayroll;
