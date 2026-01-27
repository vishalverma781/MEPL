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

  useEffect(() => {
    const fetchPayrolls = async () => {
      try {
         const res = await axios.get(`${import.meta.env.VITE_API_URL}/payrolls`);
        setAllRecords(res.data);
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to fetch payrolls", "error");
      }
    };
    fetchPayrolls();
  }, []);

  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = allRecords.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(allRecords.length / recordsPerPage);

  const handleNext = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);
  const handlePrev = () =>
    currentPage > 1 && setCurrentPage(currentPage - 1);

  const handleSaveEdit = async () => {
    try {
      const res = await axios.put(
         `${import.meta.env.VITE_API_URL}/payrolls/${editRecord._id}`,
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

  const handleDelete = async (_id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
       await axios.delete(`${import.meta.env.VITE_API_URL}/payrolls/${_id}`);
      setAllRecords((prev) => prev.filter((r) => r._id !== _id));
      Swal.fire("Deleted", "Payroll record deleted", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to delete payroll", "error");
    }
  };

return (
<div className="flex-1 min-h-screen p-10 overflow-x-auto overflow-y-auto transition-all duration-300 md:ml-20 pr-8 py-2
">

<div className="bg-white shadow-xl rounded-xl p-10 w-full max-w-7xl mx-auto">

      <h2 className="text-2xl font-bold text-center mb-5 text-gray-900">
        All Payrolls
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 rounded-lg overflow-hidden text-sm">
          <thead>
            <tr className="bg-gray-800 text-white text-lg sm:text-xl">
              <th className="py-2 px-3 whitespace-nowrap text-left">Full Name</th>
              <th className="py-2 px-2 text-left hidden md:table-cell">Username</th>
              <th className="py-2 px-2 text-left hidden md:table-cell">Phone</th>
              <th className="py-2 px-2 text-left hidden lg:table-cell">Department</th>
              <th className="py-2 px-2 text-left hidden lg:table-cell">Salary</th>
              <th className="py-2 px-2 text-left hidden lg:table-cell">Expense</th>
              <th className="py-2 px-2 text-center">View</th>
              <th className="py-2 px-2 text-center">Edit</th>
              <th className="py-2 px-2 text-center">Delete</th>
            </tr>
          </thead>

          <tbody>
            {currentRecords.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center py-4 text-gray-500 text-sm">
                  No payroll records found
                </td>
              </tr>
            ) : (
              currentRecords.map((rec) => (
                <tr key={rec._id} className="border-b border-gray-200 text-sm hover:bg-gray-50">
                  <td className="py-2 px-2 font-semibold">{rec.fullName}</td>
                  <td className="py-2 px-2 hidden md:table-cell">{rec.username || "-"}</td>
                  <td className="py-2 px-3 hidden md:table-cell whitespace-nowrap">{rec.phone || "-"}</td>

                  <td className="py-2 px-2 hidden lg:table-cell">{rec.department}</td>
                  <td className="py-2 px-2 hidden lg:table-cell">₹ {rec.salary}</td>
                  <td className="py-2 px-2 hidden lg:table-cell">₹ {rec.expense}</td>

                  <td className="py-2 px-2 text-center">
                    <button
                      onClick={() => setSelectedRecord(rec)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <FaEye size={18} />
                    </button>
                  </td>

                  <td className="py-2 px-2 text-center">
                    <button
                      onClick={() => setEditRecord(rec)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaEdit size={18} />
                    </button>
                  </td>

                  <td className="py-2 px-2 text-center">
                    <button
                      onClick={() => handleDelete(rec._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash size={18} />
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
        <div className="flex justify-center items-center mt-4 space-x-3">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`px-4 py-1 rounded text-sm text-white ${
              currentPage === 1 ? "bg-gray-400" : "bg-gray-900 hover:bg-black"
            }`}
          >
            Previous
          </button>

          <span className="text-gray-700 text-sm">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`px-4 py-1 rounded text-sm text-white ${
              currentPage === totalPages ? "bg-gray-400" : "bg-gray-900 hover:bg-black"
            }`}
          >
            Next
          </button>
        </div>
      )}

      {/* View Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 p-3">
          <div className="bg-white p-5 rounded-xl shadow-xl w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-center text-gray-900">
              Payroll Details
            </h3>

            <div className="space-y-2 text-gray-800 text-sm font-medium">
              <p><span className="font-semibold">Full Name:</span> {selectedRecord.fullName}</p>
              <p><span className="font-semibold">Username:</span> {selectedRecord.username || "N/A"}</p>
              <p><span className="font-semibold">Phone:</span> {selectedRecord.phone || "N/A"}</p>
              <p><span className="font-semibold">Bank Name:</span> {selectedRecord.bankName || "N/A"}</p>
              <p><span className="font-semibold">Account Number:</span> {selectedRecord.accountNumber || "N/A"}</p>
              <p><span className="font-semibold">IFSC:</span> {selectedRecord.ifsc || "N/A"}</p>
              <p><span className="font-semibold">Department:</span> {selectedRecord.department || "N/A"}</p>
              <p><span className="font-semibold">Leaves:</span> {selectedRecord.leaves || "0"}</p>
              <p><span className="font-semibold">Salary:</span> ₹ {selectedRecord.salary}</p>
              <p><span className="font-semibold">Expense:</span> ₹ {selectedRecord.expense}</p>
              <p><span className="font-semibold">Month:</span> {selectedRecord.month || "N/A"}</p>
              <p><span className="font-semibold">Date:</span> {selectedRecord.date || "N/A"}</p>
            </div>

            <div className="mt-4 flex justify-center">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-5 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editRecord && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 p-3">
          <div className="bg-white p-5 rounded-xl shadow-xl w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-center text-gray-900">
              Edit Payroll
            </h3>

            <div className="space-y-3 text-sm font-medium text-gray-800">
              <div>
                <label className="font-semibold">Leaves</label>
                <input
                  type="number"
                  className="border px-2 py-1 rounded w-full text-sm"
                  value={editRecord.leaves || 0}
                  onChange={(e) => setEditRecord({ ...editRecord, leaves: e.target.value })}
                />
              </div>

              <div>
                <label className="font-semibold">Salary</label>
                <input
                  type="number"
                  className="border px-2 py-1 rounded w-full text-sm"
                  value={editRecord.salary}
                  onChange={(e) => setEditRecord({ ...editRecord, salary: e.target.value })}
                />
              </div>

              <div>
                <label className="font-semibold">Expense</label>
                <input
                  type="number"
                  className="border px-2 py-1 rounded w-full text-sm"
                  value={editRecord.expense}
                  onChange={(e) => setEditRecord({ ...editRecord, expense: e.target.value })}
                />
              </div>

              <div>
                <label className="font-semibold">Month</label>
                <input
                  type="month"
                  className="border px-2 py-1 rounded w-full text-sm"
                  value={editRecord.month}
                  onChange={(e) => setEditRecord({ ...editRecord, month: e.target.value })}
                />
              </div>

              <div>
                <label className="font-semibold">Date</label>
                <input
                  type="date"
                  className="border px-2 py-1 rounded w-full text-sm"
                  value={editRecord.date}
                  onChange={(e) => setEditRecord({ ...editRecord, date: e.target.value })}
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setEditRecord(null)}
                className="px-4 py-1 bg-gray-300 rounded text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
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
