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
    <div className="w-full min-h-screen flex justify-center items-start p-4 sm:p-10 ">
      <div className="bg-white shadow-2xl rounded-2xl p-6 sm:p-8 w-full max-w-7xl">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-900">
          My Leave Applications
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
                        onClick={() => setEditableLeave(leave)}
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
                <span className="font-extrabold text-gray-900">
                  {editableLeave.fullName || editableLeave.username}
                </span>
              </p>
              <p>
                <span className="font-bold">Status:</span>{" "}
                <span className={statusColor[editableLeave.status]}>
                  {editableLeave.status}
                </span>
              </p>
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

            <div className="mt-6 flex justify-center">
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

export default CallLeave;
