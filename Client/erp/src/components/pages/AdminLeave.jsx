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
    <div className="w-full min-h-screen flex justify-center items-start p-4 sm:p-10">
      <div className="bg-white shadow-2xl rounded-2xl p-6 sm:p-8 w-full max-w-7xl">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-900">
          All Leave Applications
        </h2>

        {leaves.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            No leave records found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-gray-800 text-white text-base sm:text-lg">
                  <th className="p-4 text-left">Full Name</th>
                  <th className="p-4 text-left">From</th>
                  <th className="p-4 text-left">To</th>
                  <th className="p-4 text-left">No. of Days</th>
                  <th className="p-4 text-left">Description</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-center">View</th>
                </tr>
              </thead>
              <tbody>
                {currentLeaves.map((leave) => (
                  <tr
                    key={leave._id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition text-base sm:text-lg"
                  >
                    <td className="py-4 px-3 font-bold text-gray-800">
                      {leave.fullName || leave.username}
                    </td>
                    <td className="py-4 px-3">{formatDate(leave.startDate)}</td>
                    <td className="py-4 px-3">{formatDate(leave.endDate)}</td>
                    <td className="py-4 px-3">{leave.numberOfDays}</td>
                    <td className="py-4 px-3" title={leave.reason}>
                      {leave.reason.length > 35
                        ? leave.reason.substring(0, 35) + "..."
                        : leave.reason}
                    </td>
                    <td
                      className={`py-4 px-3 font-semibold ${
                        statusColor[leave.status]
                      }`}
                    >
                      {leave.status}
                    </td>
                    <td className="py-4 px-3 text-center">
                      <button
                        onClick={() => {
                          setEditableLeave(leave);
                          setStatusUpdate(leave.status);
                        }}
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
        )}

        {/* Pagination */}
        {leaves.length > leavesPerPage && (
          <div className="flex justify-center items-center mt-6 space-x-4">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className={`px-4 sm:px-6 py-2 rounded-lg text-white font-medium ${
                currentPage === 1
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              Previous
            </button>
            <span className="text-gray-700 font-medium">
              Page {currentPage} of {totalPages || 1}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={`px-4 sm:px-6 py-2 rounded-lg text-white font-medium ${
                currentPage === totalPages
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {editableLeave && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-6 sm:p-8">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-center text-gray-900">
              Leave Application
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-800 text-sm sm:text-base font-medium">
              <p>
                <span className="font-bold">Full Name:</span>{" "}
                <span className="font-bold text-gray-900">
                  {editableLeave.fullName || editableLeave.username}
                </span>
              </p>

             <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3">
  <span className="font-bold text-gray-800 text-sm sm:text-base">Status:</span>

  <div className="relative w-full sm:w-56 mt-2 sm:mt-0">
    <select
      value={statusUpdate}
      onChange={(e) => setStatusUpdate(e.target.value)}
      className={`w-full appearance-none bg-white border border-gray-300 text-gray-900 rounded-lg px-4 py-2.5 pr-10 font-semibold transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 ${
        statusUpdate === "Approved"
          ? "text-green-600"
          : statusUpdate === "Rejected"
          ? "text-red-600"
          : statusUpdate === "Not Approved"
          ? "text-gray-700"
          : "text-yellow-600"
      }`}
    >
      <option value="Pending" className="text-yellow-600">Pending</option>
      <option value="Approved" className="text-green-600">Approved</option>
      {/* <option value="Not Approved" className="text-gray-700">Not Approved</option> */}
      <option value="Rejected" className="text-red-600">Rejected</option>
    </select>

    {/* Custom dropdown icon */}
    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
      <svg
        className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  </div>
</div>


              <p>
                <span className="font-bold">Date From:</span>{" "}
                {formatDate(editableLeave.startDate)}
              </p>
              <p>
                <span className="font-bold">Date To:</span>{" "}
                {formatDate(editableLeave.endDate)}
              </p>
              <p>
                <span className="font-bold">No. of Days:</span>{" "}
                {editableLeave.numberOfDays}
              </p>
              <div className="col-span-1 sm:col-span-2">
                <span className="font-bold">Description:</span>
                <p className="mt-2 text-gray-700 whitespace-pre-wrap text-sm sm:text-base">
                  {editableLeave.reason}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-center space-x-4">
              <button
                onClick={handleStatusChange}
                className="px-6 sm:px-8 py-2 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm sm:text-base font-semibold"
              >
                Update Status
              </button>
              <button
                onClick={() => setEditableLeave(null)}
                className="px-6 sm:px-8 py-2 sm:py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-600 transition text-sm sm:text-base font-semibold"
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
