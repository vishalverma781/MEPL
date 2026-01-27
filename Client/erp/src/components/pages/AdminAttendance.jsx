import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { FaCalendarAlt, FaEye } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";

const AdminAttendance = () => {
  const [user, setUser] = useState("");
  const [status, setStatus] = useState("Present");
  const [markDate, setMarkDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [records, setRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 4;

  // ✅ Fetch employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/employees`);
        setEmployees(res.data);
      } catch (err) {
        console.error("Error fetching employees:", err);
        Swal.fire("Error", "Failed to load employees", "error");
      }
    };
    fetchEmployees();
  }, []);


 // ✅ Fetch attendance (based on selected date)
  const fetchAttendance = async (selectedDate = markDate) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/attendance?date=${selectedDate}`
      );
      setRecords(res.data.reverse());
    } catch (err) {
      console.error("Error fetching attendance:", err);
    }
  };

  // ✅ Load today's attendance by default
  useEffect(() => {
    fetchAttendance();
  }, []);

  // ✅ Pagination
  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = records.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(records.length / recordsPerPage);
  const handleNext = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);
  const handlePrev = () =>
    currentPage > 1 && setCurrentPage(currentPage - 1);

  // ✅ Mark Attendance
  const handleMarkAttendance = async () => {
    if (!user) {
      Swal.fire("Error", "Please select a user", "error");
      return;
    }

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const markedBy = currentUser?.username || "Admin";

    const newRecord = {
      fullName: user,
      status,
      markedBy,
      date: new Date(markDate).toISOString(),
    };

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/attendance`,
        newRecord,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      
      Swal.fire("Success", `${user} attendance marked as ${status}`, "success");
      setUser("");
      setStatus("Present");

      // ✅ Refresh same date’s records
      fetchAttendance(markDate);
    } catch (err) {
      Swal.fire("Error", err?.response?.data?.message || err.message, "error");
    }
  };

  // ✅ Update status
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/attendance/${id}`,
        { status: newStatus },
        { headers: { "Content-Type": "application/json" } }
      );

      setRecords((prev) =>
        prev.map((rec) =>
          rec._id === id
            ? { ...rec, status: newStatus, updatedAt: res.data.updatedAt }
            : rec
        )
      );

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: `Status changed to ${newStatus}`,
        timer: 1500,
        showConfirmButton: false,
      });

      setSelectedRecord(null);
    } catch (err) {
      console.error("Update Error:", err);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: err?.response?.data?.message || "Network Error",
      });
    }
  };

return (
<div className="flex-1 min-h-screen overflow-y-auto transition-all duration-300 md:ml-30 pl-1 pr-2 py-6">


    <div className="bg-white shadow-xl rounded-xl w-full max-w-4xl mx-auto p-10 sm:p-7 border border-gray-200">

      {/* Heading */}
      <h1 className="text-2xl font-bold text-gray-900 mb-5 text-center">
        Attendance Management
      </h1>

      {/* Mark Attendance Section */}
      <div className="border border-gray-300 rounded-xl p-3 sm:p-5 mb-6 bg-gray-50 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">
          Mark Attendance for Employee
        </h2>

        <div className="flex flex-col md:flex-row flex-wrap gap-3 items-center justify-center">

          {/* Select User */}
          <div className="flex flex-col w-full md:w-auto">
            <label className="text-gray-700 text-sm mb-1">Select User</label>
            <select
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 bg-white outline-none w-full md:w-64 text-gray-900 text-sm"
            >
              <option value="">Select User</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp.fullName}>
                  {emp.fullName} ({emp.email})
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="flex flex-col w-full md:w-auto">
            <label className="text-gray-700 text-sm mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 bg-white outline-none w-full md:w-36 text-gray-900 text-sm"
            >
              <option>Present</option>
              <option>Absent</option>
              <option>On Leave</option>
              <option>WFH</option>
            </select>
          </div>

          {/* Date */}
          <div className="flex flex-col w-full md:w-auto">
            <label className="text-gray-700 text-sm mb-1">Date</label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 bg-white w-full md:w-36">
              <FaCalendarAlt className="text-gray-500 mr-2 text-sm" />
              <input
                type="date"
                value={markDate}
                onChange={(e) => {
                  setMarkDate(e.target.value);
                  fetchAttendance(e.target.value);
                }}
                className="outline-none w-full text-gray-900 text-sm"
              />
            </div>
          </div>

          <button
            onClick={handleMarkAttendance}
            className="bg-gray-800 hover:bg-black text-white text-sm font-semibold px-5 py-2 rounded-lg shadow transition"
          >
            Mark Attendance
          </button>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="py-2 px-2 text-left">Date</th>
              <th className="py-2 px-2 text-left">Full Name</th>
              <th className="py-2 px-2 text-left">Status</th>
              <th className="py-2 px-2 text-left">Marked By</th>
              <th className="py-2 px-2 text-center">View/Edit</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center text-gray-500 py-4 italic">
                  No attendance records found
                </td>
              </tr>
            ) : (
              currentRecords.map((rec) => (
                <tr key={rec._id} className="hover:bg-gray-100 transition">
                  <td className="py-2 px-2">
                    {format(new Date(rec.date), "dd-MM-yyyy")}
                  </td>
                  <td className="py-2 px-2">{rec.fullName}</td>
                  <td
                    className={`py-2 px-2 text-center font-semibold ${
                      rec.status === "Present"
                        ? "text-green-600"
                        : rec.status === "Absent"
                        ? "text-red-600"
                        : rec.status === "On Leave"
                        ? "text-yellow-600"
                        : rec.status === "WFH"
                        ? "text-blue-600"
                        : "text-gray-800"
                    }`}
                  >
                    {rec.status}
                  </td>
                  <td className="py-2 px-2">{rec.markedBy}</td>
                  <td className="py-2 px-2 text-center">
                    <button
                      onClick={() => setSelectedRecord(rec)}
                      className="text-green-700 hover:text-green text-lg"
                    >
                      <FaEye />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {records.length > recordsPerPage && (
        <div className="flex justify-center items-center mt-4 space-x-3">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`px-4 py-1 rounded text-white text-sm ${
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
            className={`px-4 py-1 rounded text-white text-sm ${
              currentPage === totalPages ? "bg-gray-400" : "bg-gray-900 hover:bg-black"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>

    {/* View/Edit Modal */}
    {selectedRecord && (
      <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 p-3">
        <div className="bg-white p-5 rounded-xl shadow-xl w-full max-w-md relative">
          <h3 className="text-xl font-bold mb-4 text-center">
            Attendance Details
          </h3>

          <button
            onClick={() => setSelectedRecord(null)}
            className="absolute top-2 right-3 text-gray-600 hover:text-black text-lg font-bold"
          >
            ✕
          </button>

          <div className="space-y-3 text-gray-800 text-sm font-medium">
            <p><span className="font-semibold">Full Name:</span> {selectedRecord.fullName}</p>
            <p><span className="font-semibold">Date:</span> {format(new Date(selectedRecord.date), "dd-MM-yyyy")}</p>
            <p><span className="font-semibold">Marked By:</span> {selectedRecord.markedBy}</p>

            <div>
              <label className="font-semibold block mb-1">Status:</label>
              <select
                value={selectedRecord.status}
                onChange={(e) =>
                  setSelectedRecord((prev) => ({ ...prev, status: e.target.value }))
                }
                className="border border-gray-300 rounded-md px-2 py-1 w-full text-sm bg-white"
              >
                <option>Present</option>
                <option>Absent</option>
                <option>On Leave</option>
                <option>WFH</option>
              </select>
            </div>

            <p>
              <span className="font-semibold">Last Updated:</span>{" "}
              {format(new Date(selectedRecord.updatedAt || selectedRecord.date), "dd-MM-yyyy HH:mm:ss")}
            </p>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={() => handleUpdateStatus(selectedRecord._id, selectedRecord.status)}
              className="px-4 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm font-semibold"
            >
              Submit
            </button>

            <button
              onClick={() => setSelectedRecord(null)}
              className="px-4 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm font-semibold"
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

export default AdminAttendance;
