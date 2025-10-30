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
        const res = await axios.get("${import.meta.env.VITE_API_URL}/api/employees");
        setEmployees(res.data);
      } catch (err) {
        console.error("Error fetching employees:", err);
      }
    };
    fetchEmployees();
  }, []);

  // ✅ Fetch attendance (based on selected date)
  const fetchAttendance = async (selectedDate = markDate) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/attendance?date=${selectedDate}`
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
        "${import.meta.env.VITE_API_URL}/api/attendance",
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
        `${import.meta.env.VITE_API_URL}/api/attendance/${id}`,
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
    <div className="ml-16 p-4 md:p-8 min-h-screen">
      <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-6 border border-gray-200 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-10 text-center">
          Attendance Management
        </h1>

        {/* ✅ Mark Attendance Section */}
        <div className="border border-gray-300 rounded-3xl p-6 md:p-8 mb-8 bg-gray-50 shadow-md">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Mark Attendance for Employee
          </h2>

          <div className="flex flex-wrap gap-6 items-center justify-center">
            {/* Select User */}
            <div className="flex flex-col">
              <label className="text-gray-700 text-lg mb-1">Select User</label>
              <select
                value={user}
                onChange={(e) => setUser(e.target.value)}
                className="border border-gray-300 rounded-xl px-4 py-2 bg-white outline-none w-72 text-gray-900 text-lg font-medium"
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
            <div className="flex flex-col">
              <label className="text-gray-700 text-lg mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="border border-gray-300 rounded-xl px-4 py-2 bg-white outline-none w-40 text-gray-900 text-lg font-medium"
              >
                <option>Present</option>
                <option>Absent</option>
                <option>On Leave</option>
                <option>WFH</option>
              </select>
            </div>

            {/* Date Picker */}
            <div className="flex flex-col">
              <label className="text-gray-700 text-lg mb-1">Date</label>
              <div className="flex items-center border border-gray-300 rounded-xl px-4 py-2 bg-white">
                <FaCalendarAlt className="text-gray-500 mr-2" />
                <input
                  type="date"
                  value={markDate}
                  onChange={(e) => {
                    setMarkDate(e.target.value);
                    fetchAttendance(e.target.value); // ✅ filter by selected date
                  }}
                  className="outline-none w-40 text-gray-900 text-lg font-medium"
                />
              </div>
            </div>

            <button
              onClick={handleMarkAttendance}
              className="bg-gray-800 hover:bg-black text-white font-semibold px-6 py-3 rounded-xl shadow-md mt-4 transition"
            >
              Mark Attendance
            </button>
          </div>
        </div>

        {/* ✅ Attendance Table */}
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 rounded-xl overflow-hidden text-base">
            <thead>
              <tr className="bg-gray-800 text-white text-lg">
                <th className="py-4 px-4 text-left">Date</th>
                <th className="py-4 px-4 text-left">FullName</th>
                <th className="py-4 px-4 text-left">Status</th>
                <th className="py-4 px-4 text-left">Marked By</th>
                <th className="py-4 px-4 text-center">View/Edit</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center text-gray-500 py-6 italic text-lg"
                  >
                    No attendance records found
                  </td>
                </tr>
              ) : (
                currentRecords.map((rec) => (
                  <tr key={rec._id} className="hover:bg-gray-100 transition">
                    <td className="py-4 px-4">
                      {format(new Date(rec.date), "dd-MM-yyyy")}
                    </td>
                    <td className="py-4 px-4">{rec.fullName}</td>
                    <td
                      className={`py-4 px-4 text-center font-semibold ${
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
                    <td className="py-4 px-4">{rec.markedBy}</td>
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => setSelectedRecord(rec)}
                        className="text-gray-700 hover:text-black transition text-2xl"
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
          <div className="flex justify-center items-center mt-6 space-x-4">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className={`px-5 py-2 rounded-lg text-white font-medium ${
                currentPage === 1
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gray-900 hover:bg-black"
              }`}
            >
              Previous
            </button>
            <span className="text-gray-700 font-medium text-base">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={`px-5 py-2 rounded-lg text-white font-medium ${
                currentPage === totalPages
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gray-900 hover:bg-black"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* ✅ View/Edit Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 p-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg relative">
            <h3 className="text-2xl font-extrabold mb-6 text-center">
              Attendance Details
            </h3>

            <button
              onClick={() => setSelectedRecord(null)}
              className="absolute top-3 right-4 text-gray-600 hover:text-black text-2xl font-bold"
            >
              ✕
            </button>

            <div className="space-y-4 text-gray-800 text-lg font-medium">
              <p>
                <span className="font-bold">Full Name:</span>{" "}
                {selectedRecord.fullName}
              </p>
              <p>
                <span className="font-bold">Date:</span>{" "}
                {format(new Date(selectedRecord.date), "dd-MM-yyyy")}
              </p>
              <p>
                <span className="font-bold">Marked By:</span>{" "}
                {selectedRecord.markedBy}
              </p>

              <div>
                <label className="font-bold block mb-1">Status:</label>
                <select
                  value={selectedRecord.status}
                  onChange={(e) =>
                    setSelectedRecord((prev) => ({
                      ...prev,
                      status: e.target.value,
                    }))
                  }
                  className="border border-gray-300 rounded-lg p-2 w-full text-lg bg-white"
                >
                  <option>Present</option>
                  <option>Absent</option>
                  <option>On Leave</option>
                  <option>WFH</option>
                </select>
              </div>

              <p>
                <span className="font-bold">Last Updated:</span>{" "}
                {format(
                  new Date(selectedRecord.updatedAt || selectedRecord.date),
                  "dd-MM-yyyy HH:mm:ss"
                )}
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() =>
                  handleUpdateStatus(selectedRecord._id, selectedRecord.status)
                }
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold"
              >
                Submit
              </button>

              <button
                onClick={() => setSelectedRecord(null)}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold"
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
