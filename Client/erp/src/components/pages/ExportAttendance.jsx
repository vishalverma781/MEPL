import React, { useState, useEffect } from "react";
import { FaCalendarAlt, FaFilePdf } from "react-icons/fa";
import { format } from "date-fns";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../../assets/logo.png";
 // ✅ Make sure logo.png is inside src/assets/

const ExportAttendance = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [user, setUser] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [employees, setEmployees] = useState([]);
  const [records, setRecords] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 4;

  // ✅ Fetch employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${import.meta.env.VITE_API_URL}/employees`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await res.json();
        setEmployees(data);
      } catch (err) {
        console.error("Error fetching employees:", err);
      }
    };
    fetchEmployees();
  }, []);
  
  // 🔹 Generate filtered report
  const handleGenerateReport = async () => {
    if (!user || !startDate || !endDate) {
      alert("Please select employee and both start & end dates.");
      return;
    }

    try {
      const params = new URLSearchParams();
      params.append("fullName", user);
      params.append("startDate", startDate);
      params.append("endDate", endDate);
      if (statusFilter !== "All Status") params.append("status", statusFilter);

      const token = localStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/attendance/filter?${params.toString()}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      const data = await res.json();
      setRecords(data);
      setShowTable(true);
      setCurrentPage(1);
    } catch (err) {
      console.error("Error fetching attendance:", err);
    }
  };

  // 🔹 Export PDF with Logo
  const handleExportPDF = async () => {
    if (records.length === 0) return;

    const doc = new jsPDF();

    try {
      // ✅ Add company logo (top left)
      const img = new Image();
      img.src = logo;
      await new Promise((resolve, reject) => {
        img.onload = () => {
          doc.addImage(img, "PNG", 14, 10, 25, 25);
          resolve();
        };
        img.onerror = reject;
      });
    } catch (error) {
      console.warn("⚠️ Logo not found or failed to load. Skipping logo...");
    }

    // 🔸 Add Header Text
    doc.setFontSize(16);
    doc.text("Mahakalinfra Esolution Pvt. Ltd.", 45, 20);
    doc.setFontSize(13);
    doc.text("Attendance Report", 45, 28);
    doc.line(14, 35, 195, 35); // Divider line

    // 🔸 Table Content
    const tableColumn = ["Date", "Full Name", "Status", "Marked By"];
    const tableRows = [];

    records.forEach((record) => {
      tableRows.push([
        format(new Date(record.date), "dd-MM-yyyy"),
        record.fullName,
        record.status,
        record.markedBy,
      ]);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [60, 60, 60] },
    });

    // 🔸 Footer
    const generatedDate = format(new Date(), "dd-MM-yyyy");
    doc.setFontSize(10);
    doc.text(`Generated on: ${generatedDate}`, 14, doc.internal.pageSize.height - 10);

    doc.save("Attendance_Report.pdf");
  };

  // 🔹 Pagination logic
  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = records.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(records.length / recordsPerPage);

   const handleNext = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);
  const handlePrev = () =>
    currentPage > 1 && setCurrentPage(currentPage - 1);

 return (
<div className="flex-1 min-h-screen overflow-y-auto transition-all duration-300 md:ml-30 pl-1 pr-2 py-6">
    <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6 border border-gray-200 max-w-6xl mx-auto">

      {/* Heading + Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-5 gap-3">
        <h1 className="text-2xl font-bold text-gray-900 text-center sm:text-left">
          Export Attendance
        </h1>

        <div className="flex gap-3">
          <button
            onClick={handleGenerateReport}
            disabled={!user || !startDate || !endDate}
            className={`px-4 py-1.5 rounded-md shadow text-sm font-semibold text-white transition ${
              user && startDate && endDate
                ? "bg-gray-800 hover:bg-black"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Generate
          </button>

          <button
            onClick={handleExportPDF}
            disabled={records.length === 0}
            className={`px-4 py-1.5 rounded-md shadow text-sm font-semibold text-white flex items-center gap-2 transition ${
              records.length > 0
                ? "bg-red-600 hover:bg-red-800"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            <FaFilePdf /> Export PDF
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row flex-wrap items-center justify-center gap-3 mb-5">

        {/* Start Date */}
        <div className="flex flex-col w-full md:w-auto">
          <label className="text-gray-700 text-sm mb-1">Start Date</label>
          <div className="flex items-center border border-gray-300 rounded-md px-2 py-1 bg-white md:w-36">
            <FaCalendarAlt className="text-gray-500 mr-2 text-sm" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="outline-none w-full text-sm"
            />
          </div>
        </div>

        {/* End Date */}
        <div className="flex flex-col w-full md:w-auto">
          <label className="text-gray-700 text-sm mb-1">End Date</label>
          <div className="flex items-center border border-gray-300 rounded-md px-2 py-1 bg-white md:w-36">
            <FaCalendarAlt className="text-gray-500 mr-2 text-sm" />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="outline-none w-full text-sm"
            />
          </div>
        </div>

        {/* Status */}
        <div className="flex flex-col w-full md:w-auto">
          <label className="text-gray-700 text-sm mb-1">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-2 py-1 bg-white md:w-36 text-sm"
          >
            <option>All Status</option>
            <option>Present</option>
            <option>Absent</option>
            <option>On Leave</option>
            <option>WFH</option>
          </select>
        </div>

        {/* Employee */}
        <div className="flex flex-col w-full md:w-auto">
          <label className="text-gray-700 text-sm mb-1">Employee</label>
          <select
            value={user}
            onChange={(e) => setUser(e.target.value)}
            className="border border-gray-300 rounded-md px-2 py-1 bg-white md:w-64 text-sm"
          >
            <option value="">Select Employee</option>
            {employees.map((emp) => (
              <option key={emp._id} value={emp.fullName}>
                {emp.fullName} ({emp.email})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      {showTable && records.length > 0 && (
        <div className="overflow-x-auto rounded-md">
          <table className="min-w-full border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="py-2 px-2 text-left">Date</th>
                <th className="py-2 px-2 text-left">Full Name</th>
                <th className="py-2 px-2 text-left">Status</th>
                <th className="py-2 px-2 text-left">Marked By</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.map((rec, idx) => (
                <tr key={idx} className="hover:bg-gray-100 transition">
                  <td className="py-2 px-2">
                    {format(new Date(rec.date), "dd-MM-yyyy")}
                  </td>
                  <td className="py-2 px-2">{rec.fullName}</td>
                  <td className={`py-2 px-2 font-semibold ${
                    rec.status === "Present"
                      ? "text-green-600"
                      : rec.status === "Absent"
                      ? "text-red-600"
                      : rec.status === "On Leave"
                      ? "text-yellow-600"
                      : "text-blue-600"
                  }`}>
                    {rec.status}
                  </td>
                  <td className="py-2 px-2">{rec.markedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* No Records */}
      {showTable && records.length === 0 && (
        <p className="text-center text-gray-500 text-sm mt-5">
          No records found for selected filters.
        </p>
      )}

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
  </div>
);

};

export default ExportAttendance;
