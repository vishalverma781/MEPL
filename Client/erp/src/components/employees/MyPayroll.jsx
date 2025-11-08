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
  <div className="w-full min-h-screen flex justify-center items-start sm:p-10">
    <div className="bg-white shadow-2xl rounded-2xl p-6 w-full max-w-7xl">
      <h2 className="text-4xl font-bold text-center mb-6 text-gray-900">
        My Payroll
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 rounded-xl overflow-hidden text-lg">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="py-5 px-6 text-left text-lg">Full Name</th>
              <th className="py-5 px-6 text-left text-lg hidden sm:table-cell">Username</th>
              <th className="py-5 px-6 text-left text-lg hidden sm:table-cell">Phone</th>
              <th className="py-5 px-6 text-left text-lg hidden sm:table-cell">Department</th>
              <th className="py-5 px-6 text-left text-lg">Salary</th>
              <th className="py-5 px-6 text-left text-lg">Expense</th>
              <th className="py-3 px-2 text-center text-lg">View</th>
            </tr>
          </thead>
          <tbody>
            {myRecords.map((rec) => (
              <tr
                key={rec._id}
                className="border-b border-gray-200 hover:bg-gray-100 transition text-lg"
              >
                <td className="py-5 px-6 font-bold text-lg">{rec.fullName}</td>
                <td className="py-5 px-6 text-lg hidden sm:table-cell">{rec.username || "-"}</td>
                <td className="py-5 px-6 text-lg hidden sm:table-cell">{rec.phone || "-"}</td>
                <td className="py-5 px-6 text-lg hidden sm:table-cell">{rec.department || "-"}</td>
                <td className="py-5 px-6 font-bold text-lg">₹ {rec.salary}</td>
                <td className="py-5 px-6 text-lg">₹ {rec.expense}</td>
                <td className="py-5 px-6 text-center">
                  <button
                    onClick={() => setSelectedRecord(rec)}
                    className="text-green-600 hover:text-green-800 transition"
                  >
                    <FaEye size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedRecord && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 p-4">
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-lg sm:max-w-3xl">
            <h3 className="text-2xl sm:text-3xl font-extrabold mb-6 text-center text-gray-900">
              Payroll Details
            </h3>
            <div className="space-y-3 text-gray-800 text-lg font-medium">
              <p><span className="font-bold">Full Name:</span> {selectedRecord.fullName}</p>
              <p><span className="font-bold">Username:</span> {selectedRecord.username || "N/A"}</p>
              <p><span className="font-bold">Phone:</span> {selectedRecord.phone || "N/A"}</p>
              <p><span className="font-bold">Bank Name:</span> {selectedRecord.bankName || "N/A"}</p>
              <p><span className="font-bold">Account Number:</span> {selectedRecord.accountNumber || "N/A"}</p>
              <p><span className="font-bold">IFSC:</span> {selectedRecord.ifsc || "N/A"}</p>
              <p><span className="font-bold">Department:</span> {selectedRecord.department || "N/A"}</p>
              <p><span className="font-bold">Leaves:</span> {selectedRecord.leaves || "0"}</p>
              <p><span className="font-bold">Salary:</span> ₹ {selectedRecord.salary}</p>
              <p><span className="font-bold">Expense:</span> ₹ {selectedRecord.expense}</p>
              <p><span className="font-bold">Month:</span> {selectedRecord.month || "N/A"}</p>
              <p><span className="font-bold">Date:</span> {selectedRecord.date || "N/A"}</p>
            </div>
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-10 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-xl font-semibold"
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
