import React, { useState, useEffect } from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";

const AllPayroll = () => {
  const [allRecords, setAllRecords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [editRecord, setEditRecord] = useState(null);
  const recordsPerPage = 4;

  // -------------------- Fetch all payroll records --------------------
useEffect(() => {
    const fetchPayrolls = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/payrolls`);
        setAllRecords(res.data);
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to fetch payrolls", "error");
      }
    };
    fetchPayrolls();
  }, []);

  // -------------------- Pagination --------------------
  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = allRecords.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(allRecords.length / recordsPerPage);

  const handleNext = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);
  const handlePrev = () =>
    currentPage > 1 && setCurrentPage(currentPage - 1);

  // -------------------- Save Edited Record --------------------
  const handleSaveEdit = async () => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/payrolls/${editRecord._id}`,
        editRecord
      );
      setAllRecords((prev) =>
        prev.map((r) => (r._id === editRecord._id ? res.data : r))
      );
      setEditRecord(null);
      Swal.fire("Success", "Payroll updated successfully", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update payroll", "error");
    }
  };

  // -------------------- Delete Record --------------------
  const handleDelete = async (_id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/payrolls/${_id}`);
      setAllRecords((prev) => prev.filter((r) => r._id !== _id));
      Swal.fire("Deleted", "Payroll record deleted", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to delete payroll", "error");
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-start p-15">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-7xl">
        <h2 className="text-4xl font-bold text-center mb-6 text-gray-900">All Payrolls</h2>

        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 rounded-xl overflow-hidden text-lg">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="py-5 px-6 text-left text-lg">Full Name</th>
                 <th className="py-5 px-6 text-left text-lg">Username</th>
                <th className="py-5 px-6 text-left text-lg">Phone</th>
                <th className="py-5 px-6 text-left text-lg">Department</th>
                <th className="py-5 px-6 text-left text-lg">Salary</th>
                <th className="py-5 px-6 text-left text-lg">Expense</th>
                <th className="py-3 px-2 text-center text-lg">View</th>
                <th className="py-3 px-2 text-center text-lg">Edit</th>
                <th className="py-3 px-2 text-center text-lg">Delete</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-8 text-gray-500 text-xl">
                    No payroll records found
                  </td>
                </tr>
              ) : (
                currentRecords.map((rec) => (
                  <tr key={rec._id} className="border-b border-gray-200 hover:bg-gray-100 transition text-lg">
                    <td className="py-5 px-6 font-bold text-lg">{rec.fullName}</td>
                    <td className="py-5 px-6 text-lg">{rec.username || "-"}</td> 
                    <td className="py-5 px-6 text-lg">{rec.phone || "-"}</td>
                    <td className="py-5 px-6 text-lg">{rec.department}</td>
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
                    <td className="py-5 px-6 text-center">
                      <button
                        onClick={() => setEditRecord(rec)}
                        className="text-blue-600 hover:text-blue-800 transition"
                      >
                        <FaEdit size={20} />
                      </button>
                    </td>
                    <td className="py-5 px-6 text-center">
                      <button
                        onClick={() => handleDelete(rec._id)}
                        className="text-red-600 hover:text-red-800 transition"
                      >
                        <FaTrash size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {allRecords.length > recordsPerPage && (
          <div className="flex justify-center items-center mt-8 space-x-6">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg text-white font-semibold text-lg ${
                currentPage === 1 ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              Previous
            </button>
            <span className="text-gray-700 font-medium text-lg">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg text-white font-semibold text-lg ${
                currentPage === totalPages ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              Next
            </button>
          </div>
        )}

        {/* View Modal */}
        {selectedRecord && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg">
              <h3 className="text-2xl font-extrabold mb-6 text-center text-gray-900">
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
                <p><span className="font-bold">Salary:</span> {selectedRecord.salary}</p>
                <p><span className="font-bold">Expense:</span> {selectedRecord.expense}</p>
                <p><span className="font-bold">Month:</span> {selectedRecord.month || "N/A"}</p>
                <p><span className="font-bold">Date:</span> {selectedRecord.date || "N/A"}</p>
              </div>
              <div className="mt-12 flex justify-center">
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

        {/* Edit Modal */}
        {editRecord && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg">
              <h3 className="text-2xl font-extrabold mb-6 text-center text-gray-900">
                Edit Payroll
              </h3>
              <div className="space-y-3 text-gray-800 text-lg font-medium">
                <div>
                  <label className="font-bold">Leaves:</label>
                  <input
                    type="number"
                    className="border px-3 py-2 rounded w-full"
                    value={editRecord.leaves || 0}
                    onChange={(e) =>
                      setEditRecord({ ...editRecord, leaves: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="font-bold">Salary:</label>
                  <input
                    type="number"
                    className="border px-3 py-2 rounded w-full"
                    value={editRecord.salary}
                    onChange={(e) =>
                      setEditRecord({ ...editRecord, salary: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="font-bold">Expense:</label>
                  <input
                    type="number"
                    className="border px-3 py-2 rounded w-full"
                    value={editRecord.expense}
                    onChange={(e) =>
                      setEditRecord({ ...editRecord, expense: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="font-bold">Month:</label>
                  <input
                    type="month"
                    className="border px-3 py-2 rounded w-full"
                    value={editRecord.month}
                    onChange={(e) =>
                      setEditRecord({ ...editRecord, month: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="font-bold">Date:</label>
                  <input
                    type="date"
                    className="border px-3 py-2 rounded w-full"
                    value={editRecord.date}
                    onChange={(e) =>
                      setEditRecord({ ...editRecord, date: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-4">
                <button
                  onClick={() => setEditRecord(null)}
                  className="px-6 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllPayroll;
