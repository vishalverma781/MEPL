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

 return (
    <div className="ml-16 p-4 md:p-8 min-h-screen ">
      <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border border-gray-200 max-w-7xl mx-auto">
        {/* Heading + Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4 sm:gap-0">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center sm:text-left">
            Export Attendance
          </h1>
          <div className="flex gap-4">
            <button
              onClick={handleGenerateReport}
              disabled={!user || !startDate || !endDate}
              className={`px-6 py-2 rounded-xl shadow-md font-semibold text-white transition ${
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
              className={`px-6 py-2 rounded-xl shadow-md font-semibold text-white transition flex items-center gap-2 ${
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
        <div className="flex flex-col md:flex-row flex-wrap items-center justify-center gap-4 md:gap-6 mb-8">
          {/* Start Date */}
          <div className="flex flex-col w-full md:w-auto">
            <label className="text-gray-700 text-lg mb-1">Start Date</label>
            <div className="flex items-center border border-gray-300 rounded-xl px-4 py-2 bg-white w-full md:w-40">
              <FaCalendarAlt className="text-gray-500 mr-2" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="outline-none w-full text-gray-900 text-lg font-medium"
              />
            </div>
          </div>

          {/* End Date */}
          <div className="flex flex-col w-full md:w-auto">
            <label className="text-gray-700 text-lg mb-1">End Date</label>
            <div className="flex items-center border border-gray-300 rounded-xl px-4 py-2 bg-white w-full md:w-40">
              <FaCalendarAlt className="text-gray-500 mr-2" />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="outline-none w-full text-gray-900 text-lg font-medium"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex flex-col w-full md:w-auto">
            <label className="text-gray-700 text-lg mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-2 bg-white outline-none w-full md:w-40 text-gray-900 text-lg font-medium"
            >
              <option>All Status</option>
              <option>Present</option>
              <option>Absent</option>
              <option>On Leave</option>
              <option>WFH</option>
            </select>
          </div>

          {/* Employee Filter */}
          <div className="flex flex-col w-full md:w-auto">
            <label className="text-gray-700 text-lg mb-1">Employee</label>
            <select
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-2 bg-white outline-none w-full md:w-72 text-gray-900 text-lg font-medium"
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
          <div className="overflow-x-auto rounded-xl">
            <table className="min-w-full border border-gray-300 text-base sm:text-lg">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="py-3 px-2 sm:px-4 text-left">Date</th>
                  <th className="py-3 px-2 sm:px-4 text-left">Full Name</th>
                  <th className="py-3 px-2 sm:px-4 text-left">Status</th>
                  <th className="py-3 px-2 sm:px-4 text-left">Marked By</th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.map((rec, idx) => (
                  <tr key={idx} className="hover:bg-gray-100 transition">
                    <td className="py-3 px-2 sm:px-4">
                      {format(new Date(rec.date), "dd-MM-yyyy")}
                    </td>
                    <td className="py-3 px-2 sm:px-4">{rec.fullName}</td>
                    <td
                      className={`py-3 px-2 sm:px-4 font-semibold ${
                        rec.status === "Present"
                          ? "text-green-600"
                          : rec.status === "Absent"
                          ? "text-red-600"
                          : rec.status === "On Leave"
                          ? "text-yellow-600"
                          : "text-blue-600"
                      }`}
                    >
                      {rec.status}
                    </td>
                    <td className="py-3 px-2 sm:px-4">{rec.markedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* No Records */}
        {showTable && records.length === 0 && (
          <p className="text-center text-gray-500 font-medium mt-8">
            No records found for selected filters.
          </p>
        )}

        {/* Pagination */}
        {records.length > recordsPerPage && (
          <div className="flex flex-col sm:flex-row justify-center items-center mt-6 space-y-2 sm:space-y-0 sm:space-x-4">
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
    </div>
  );
};

export default ExportAttendance;
