import React, { useState, useEffect } from "react";
import { FaEye } from "react-icons/fa";
import axios from "axios";

const formatDate = (date) => {
  if (!date) return "";
  const options = { day: "2-digit", month: "short", year: "numeric" };
  return new Date(date).toLocaleDateString("en-GB", options);
};

const statusColor = {
  Approved: "text-green-600",
  Rejected: "text-red-600",
  Pending: "text-yellow-600",
};

const CallLeave = () => {
  const [leaves, setLeaves] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editableLeave, setEditableLeave] = useState(null);
  const [currentUser, setCurrentUser] = useState({});
  const leavesPerPage = 4;

  // ✅ Get logged-in user info from token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setCurrentUser({
          id: payload.id,
          username: payload.username,
          fullName: payload.fullName,
          role: payload.role,
        });
      } catch (err) {
        console.error("Failed to parse token:", err);
      }
    }
  }, []);

  // ✅ Fetch leaves and sort by latest first
  useEffect(() => {
    const fetchLeaves = async () => {
      if (!currentUser.id) return;

      try {
        const token = localStorage.getItem("token");
        const url =
                 currentUser.role === "Admin"
            ? `${import.meta.env.VITE_API_URL}/leaves/all`
            : `${import.meta.env.VITE_API_URL}/leaves/user`;

        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const sortedLeaves = res.data.sort(
          (a, b) => new Date(b.startDate) - new Date(a.startDate)
        );

        setLeaves(sortedLeaves);
        setCurrentPage(1); // ✅ Ensure first page shows latest leaves
      } catch (err) {
        console.error("Error fetching leaves:", err);
        setLeaves([]);
      }
    };

    fetchLeaves();
  }, [currentUser]);

  const totalPages = Math.ceil(leaves.length / leavesPerPage);
  const indexOfLast = currentPage * leavesPerPage;
  const indexOfFirst = indexOfLast - leavesPerPage;
  const currentLeaves = leaves.slice(indexOfFirst, indexOfLast);

  const handleNext = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);
  const handlePrev = () =>
    currentPage > 1 && setCurrentPage(currentPage - 1);

return (
  <div className="flex-1 min-h-screen overflow-y-auto transition-all duration-300 p-10 md:ml-60 px-4 sm:px-6 py-6">
    
    <div className="bg-white shadow-xl rounded-xl w-full max-w-3xl mx-auto p-10 border border-gray-200">

      <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 text-gray-900">
        My Leave Applications
      </h2>

      {leaves.length === 0 ? (
        <p className="text-center text-gray-500 text-sm">
          No leave records found.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 rounded-lg overflow-hidden text-sm">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="p-2 text-left whitespace-nowrap">Full Name</th>
                <th className="p-2 hidden whitespace-nowrap md:table-cell">From</th>
                <th className="p-2 hidden whitespace-nowrap md:table-cell">To</th>
                <th className="p-2 hidden md:table-cell">Days</th>
                <th className="p-2 text-left">Description</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-center">View</th>
              </tr>
            </thead>

            <tbody>
              {currentLeaves.map((leave) => (
                <tr key={leave._id} className="border-b hover:bg-gray-50">
                  <td className="p-2 whitespace-nowrap font-semibold">
                    {leave.fullName || leave.username}
                  </td>

                  <td className="p-2 whitespace-nowrap hidden md:table-cell">
                    {formatDate(leave.startDate)}
                  </td>

                  <td className="p-2 whitespace-nowrap hidden md:table-cell">
                    {formatDate(leave.endDate)}
                  </td>

                  <td className="p-2 hidden md:table-cell">
                    {leave.numberOfDays}
                  </td>

                  <td className="p-2">
                    {leave.reason.length > 35
                      ? leave.reason.substring(0, 35) + "..."
                      : leave.reason}
                  </td>

                  <td className={`p-2 font-semibold ${statusColor[leave.status]}`}>
                    {leave.status}
                  </td>

                  <td className="p-2 text-center">
                    <button
                      onClick={() => setEditableLeave(leave)}
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
        <div className="flex justify-center items-center mt-4 space-x-3 text-sm">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded text-white ${
              currentPage === 1 ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Previous
          </button>

          <span className="text-gray-700">
            Page {currentPage} of {totalPages || 1}
          </span>

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded text-white ${
              currentPage === totalPages ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Next
          </button>
        </div>
      )}

      {/* ===== VIEW MODAL (UNCHANGED SPACING) ===== */}
 {editableLeave && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 p-2">
    <div className="bg-white rounded-xl shadow-xl w-full max-w-md sm:max-w-2xl p-4 sm:p-6">

      <h3 className="text-lg sm:text-xl font-bold mb-3 text-center text-gray-900">
        Leave Application
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-800 text-xs sm:text-sm font-medium">
        
        <p>
          <span className="font-bold">Full Name:</span>{" "}
          <span className="font-semibold">
            {editableLeave.fullName || editableLeave.username}
          </span>
        </p>

        <p>
          <span className="font-bold">Status:</span>{" "}
          <span className={statusColor[editableLeave.status]}>
            {editableLeave.status}
          </span>
        </p>

        <p><span className="font-bold">From:</span> {formatDate(editableLeave.startDate)}</p>
        <p><span className="font-bold">To:</span> {formatDate(editableLeave.endDate)}</p>
        <p><span className="font-bold">Days:</span> {editableLeave.numberOfDays}</p>

        <div className="sm:col-span-2">
          <span className="font-bold">Description:</span>
          <p className="mt-1 text-gray-700 text-xs sm:text-sm whitespace-pre-wrap">
            {editableLeave.reason}
          </p>
        </div>
      </div>

      <div className="mt-4 flex justify-center">
        <button
          onClick={() => setEditableLeave(null)}
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

export default CallLeave;