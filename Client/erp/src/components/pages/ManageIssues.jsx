import React, { useState, useEffect } from "react";
import { FaEye, FaFilePdf } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../../assets/logo.png"; // ✅ logo path

const ManageIssues = () => {
  const [issues, setIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const issuesPerPage = 5;

  // Fetch issues
// ✅ Fetch issues
  const fetchIssues = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/issues`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setIssues(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch issues",
      });
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  // PDF Export Logic
  const handleExportPDF = async () => {
    if (issues.length === 0) {
      Swal.fire("No Data", "No issues to export!", "info");
      return;
    }

    const doc = new jsPDF();

    try {
      // ✅ Add company logo
      const img = new Image();
      img.src = logo;
      await new Promise((resolve, reject) => {
        img.onload = () => {
          doc.addImage(img, "PNG", 14, 10, 25, 25);
          resolve();
        };
        img.onerror = reject;
      });
    } catch {
      console.warn("⚠️ Logo not found. Skipping...");
    }

    // Header
    doc.setFontSize(16);
    doc.text("Mahakalinfra Esolution Pvt. Ltd.", 45, 20);
    doc.setFontSize(13);
    doc.text("Issues Report", 45, 28);
    doc.line(14, 35, 195, 35);

    // Table Data
    const tableColumn = [
      "Sr No",
      "Issue ID",
      "Plaza Name",
      "Issue Type",
      "Status",
      "Reported By",
      "Office",
    ];
    const tableRows = [];

    issues.forEach((issue, index) => {
      tableRows.push([
        index + 1,
        issue.issueId || "N/A",
        issue.plazaName || "N/A",
        issue.issueType,
        issue.status,
        issue.reporterFullName || issue.reporterUsername,
        issue.reporterOffice || "Not Assigned",
      ]);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [60, 60, 60] },
    });

    // Footer
    const date = new Date().toLocaleDateString("en-GB");
    doc.setFontSize(10);
    doc.text(`Generated on: ${date}`, 14, doc.internal.pageSize.height - 10);

    doc.save("Issues_Report.pdf");
  };

  // Pagination
  const totalPages = Math.ceil(issues.length / issuesPerPage);
  const indexOfLast = currentPage * issuesPerPage;
  const indexOfFirst = indexOfLast - issuesPerPage;
  const currentIssues = issues.slice(indexOfFirst, indexOfLast);

return (
  <div className="w-full min-h-screen flex justify-center items-start p-10 md:ml-5 sm:p-8">
    <div className="bg-white shadow-xl rounded-xl mb-6 p-5 sm:p-8 w-full max-w-6xl">

      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          Manage Issues
        </h2>

        <button
          onClick={handleExportPDF}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-semibold"
        >
          <FaFilePdf size={16}/> Export
        </button>
      </div>

      {issues.length === 0 ? (
        <p className="text-center text-gray-500 text-base">
          No issues found!
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-800 text-white text-sm sm:text-base">
                <th className="p-3">#</th>
                <th className="p-3">Issue ID</th>
                <th className="p-3">Plaza</th>
                <th className="p-3 hidden sm:table-cell">Type</th>
                <th className="p-3 hidden sm:table-cell">Description</th>
                <th className="p-3 hidden sm:table-cell">Status</th>
                <th className="p-3 hidden sm:table-cell">Reported By</th>
                <th className="p-3 hidden sm:table-cell">Office</th>
                <th className="p-3 text-center">View</th>
              </tr>
            </thead>

            <tbody>
              {currentIssues.map((issue, index) => (
                <tr
                  key={issue._id}
                  className="border-b border-gray-200 hover:bg-gray-50 text-sm sm:text-base"
                >
                  <td className="p-3">{indexOfFirst + index + 1}</td>
                  <td className="p-3">{issue.issueId || "N/A"}</td>
                  <td className="p-3">{issue.plazaName || "N/A"}</td>
                  <td className="p-3 hidden sm:table-cell">{issue.issueType}</td>
                  <td className="p-3 hidden sm:table-cell truncate max-w-[180px]">
                    {issue.description}
                  </td>
                  <td className="p-3 hidden sm:table-cell">{issue.status}</td>
                  <td className="p-3 hidden sm:table-cell">
                    {issue.reporterFullName || issue.reporterUsername}
                  </td>
                  <td className="p-3 hidden sm:table-cell">
                    {issue.reporterOffice || "N/A"}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => setSelectedIssue(issue)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <FaEye size={16}/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {issues.length > issuesPerPage && (
        <div className="flex justify-center items-center mt-4 gap-4">
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-1.5 rounded text-sm text-white ${
              currentPage === 1 ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Previous
          </button>

          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-4 py-1.5 rounded text-sm text-white ${
              currentPage === totalPages ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>

    {selectedIssue && (
      <IssueModal
        issue={selectedIssue}
        index={issues.findIndex(i => i._id === selectedIssue._id)}
        onClose={() => setSelectedIssue(null)}
      />
    )}
  </div>
);


};

const IssueModal = ({ issue, index, onClose }) => {
  const formatDateTime = (date) => {
    if (!date) return "Not Yet Rectified";
    const d = new Date(date);
    return `${d.getDate()}-${d.getMonth()+1}-${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 text-sm sm:text-base">

        <h3 className="text-lg sm:text-xl font-bold text-center mb-4">
          Issue Details
        </h3>

        <div className="space-y-2 text-gray-800">
          <p><b>Issue ID:</b> {issue.issueId || 101 + index}</p>
          <p><b>Plaza:</b> {issue.plazaName || "N/A"}</p>
          <p><b>Type:</b> {issue.issueType}</p>
          <p><b>Description:</b> {issue.description}</p>
          <p><b>Status:</b> {issue.status}</p>
          <p><b>Remarks:</b> {issue.remarks || "No remarks"}</p>
          <p><b>Rectified:</b> {formatDateTime(issue.rectifiedDate)}</p>
          <p><b>Reported By:</b> {issue.reporterFullName || issue.reporterUsername}</p>
          <p><b>Office:</b> {issue.reporterOffice || "N/A"}</p>
        </div>

        <div className="mt-5 text-center">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
export default ManageIssues;