// src/components/admin/AdminLeave.jsx
import React, { useState, useEffect } from "react";
import { FaEye } from "react-icons/fa";
import axios from "axios";

// ✅ Date formatter
const formatDate = (date) => {
  if (!date) return "";
  const options = { day: "2-digit", month: "short", year: "numeric" };
  return new Date(date).toLocaleDateString("en-GB", options);
};

// ✅ Status colors
const statusColor = {
  Approved: "text-green-600",
  Rejected: "text-red-600",
  Pending: "text-yellow-600",
};

const AdminLeave = () => {
  const [leaves, setLeaves] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editableLeave, setEditableLeave] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState("");
  const leavesPerPage = 5;

  // ✅ Fetch all leaves for admin
 // ✅ Fetch all leaves for admin
  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/leaves/all`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );


        // Latest first
        const sortedLeaves = res.data.sort(
          (a, b) => new Date(b.startDate) - new Date(a.startDate)
        );

        setLeaves(sortedLeaves);
        setCurrentPage(1);
      } catch (err) {
        console.error("Error fetching leaves:", err);
        setLeaves([]);
      }
    };

    fetchLeaves();
  }, []);

  // ✅ Pagination logic
  const totalPages = Math.ceil(leaves.length / leavesPerPage);
  const indexOfLast = currentPage * leavesPerPage;
  const indexOfFirst = indexOfLast - leavesPerPage;
  const currentLeaves = leaves.slice(indexOfFirst, indexOfLast);

  const handleNext = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);
  const handlePrev = () =>
    currentPage > 1 && setCurrentPage(currentPage - 1);

  // ✅ Update leave status
  const handleStatusChange = async () => {
    if (!statusUpdate || !editableLeave) return;
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_API_URL}/leaves/update/${editableLeave._id}`,
        { status: statusUpdate },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update locally
      setLeaves((prev) =>
        prev.map((leave) =>
          leave._id === editableLeave._id
            ? { ...leave, status: statusUpdate }
            : leave
        )
      );

      alert("✅ Status updated successfully!");
      setEditableLeave(null);
    } catch (err) {
      console.error("Error updating status:", err);
      alert("❌ Failed to update status");
    }
  };

return (
  <div className="flex-1 min-h-screen overflow-y-auto transition-all duration-300 md:ml-50 p-10 px-8 py-6">
    <div className="bg-white shadow-xl rounded-xl p-10 w-full max-w-6xl">

      <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 text-gray-900">
        All Leave Applications
      </h2>

      {leaves.length === 0 ? (
        <p className="text-center text-gray-500 text-sm">
          No leave records found.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-800 text-white text-xs sm:text-sm">
                <th className="p-2 whitespace-nowrap text-left">Full Name</th>
                <th className="p-2 hidden sm:table-cell">From</th>
                <th className="p-2 hidden sm:table-cell">To</th>
                <th className="p-2 text-left">Days</th>
                <th className="p-2 hidden sm:table-cell">Reason</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-center">View</th>
              </tr>
            </thead>

            <tbody>
              {currentLeaves.map((leave) => (
                <tr
                  key={leave._id}
                  className="border-b border-gray-200 hover:bg-gray-50 text-xs sm:text-sm"
                >
                  <td className="p-2 whitespace-nowrap font-semibold">
                    {leave.fullName || leave.username}
                  </td>
                  <td className="p-2 hidden sm:table-cell">
                    {formatDate(leave.startDate)}
                  </td>
                  <td className="p-2 hidden sm:table-cell">
                    {formatDate(leave.endDate)}
                  </td>
                  <td className="p-2">{leave.numberOfDays}</td>
                  <td className="p-2 hidden sm:table-cell">
                    {leave.reason.length > 30
                      ? leave.reason.substring(0, 30) + "..."
                      : leave.reason}
                  </td>
                  <td className={`p-2 font-semibold ${statusColor[leave.status]}`}>
                    {leave.status}
                  </td>
                  <td className="p-2 text-center">
                    <button
                      onClick={() => {
                        setEditableLeave(leave);
                        setStatusUpdate(leave.status);
                      }}
                      className="text-green-600 hover:text-green-800"
                    >
                      <FaEye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}

      {/* Pagination */}
      {leaves.length > leavesPerPage && (
        <div className="flex justify-center items-center mt-4 gap-3">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded text-xs text-white ${
              currentPage === 1
                ? "bg-gray-400"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Previous
          </button>

          <span className="text-xs text-gray-700">
            Page {currentPage} of {totalPages || 1}
          </span>

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded text-xs text-white ${
              currentPage === totalPages
                ? "bg-gray-400"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>

    {/* ===== Modal ===== */}
    {editableLeave && (
      <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-3">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-5 text-xs sm:text-sm">

          <h3 className="text-lg font-bold mb-3 text-center">
            Leave Application
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-800">
            <p><b>Full Name:</b> {editableLeave.fullName || editableLeave.username}</p>

            <div>
              <b>Status:</b>
              <select
                value={statusUpdate}
                onChange={(e) => setStatusUpdate(e.target.value)}
                className="w-full border rounded-md px-2 py-1 text-xs mt-1"
              >
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <p><b>Date From:</b> {formatDate(editableLeave.startDate)}</p>
            <p><b>Date To:</b> {formatDate(editableLeave.endDate)}</p>
            <p><b>No. of Days:</b> {editableLeave.numberOfDays}</p>

            <div className="sm:col-span-2">
              <b>Description:</b>
              <p className="mt-1 text-gray-700">
                {editableLeave.reason}
              </p>
            </div>
          </div>

          <div className="mt-4 flex justify-center gap-3">
            <button
              onClick={handleStatusChange}
              className="px-4 py-1.5 bg-green-600 text-white rounded text-xs hover:bg-green-700"
            >
              Update
            </button>
            <button
              onClick={() => setEditableLeave(null)}
              className="px-4 py-1.5 bg-gray-800 text-white rounded text-xs hover:bg-gray-600"
            >
              Close
            </button>
          </div>

        </div>
      </div>
    )}
  </div>
);
};

export default AdminLeave;