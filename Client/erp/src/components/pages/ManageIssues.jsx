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
        `${import.meta.env.VITE_API_URL}/api/issues`,
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
    <div className="w-full min-h-screen flex justify-center items-start p-10">
      <div className="bg-white shadow-2xl rounded-2xl mb-10 p-10 w-full max-w-7xl">
        {/* Header + Button */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Manage Issues</h2>
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-6 py-2 bg-red-600 hover:bg-red-800 text-white rounded-lg font-semibold shadow-md"
          >
            <FaFilePdf /> Export PDF
          </button>
        </div>

        {/* Table */}
        {issues.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No issues found!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-gray-800 text-white text-xl">
                  <th className="p-3">Sr. No</th>
                  <th className="p-3">Issue ID</th>
                  <th className="p-3">Plaza Name</th>
                  <th className="p-3">Issue Type</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Reported By</th>
                  <th className="p-3">Office</th>
                  <th className="p-3 text-center">View</th>
                </tr>
              </thead>
              <tbody>
                {currentIssues.map((issue, index) => (
                  <tr
                    key={issue._id}
                    className="border-b border-gray-200 hover:bg-gray-100 transition text-lg"
                  >
                    <td className="py-4 px-4">{indexOfFirst + index + 1}</td>
                    <td className="py-4 px-4">{issue.issueId || "N/A"}</td>
                    <td className="py-4 px-4">{issue.plazaName || "N/A"}</td>
                    <td className="py-4 px-4">{issue.issueType}</td>
                    <td className="py-4 px-4">{issue.description}</td>
                    <td className="py-4 px-4">{issue.status}</td>
                    <td className="py-4 px-4">
                      {issue.reporterFullName || issue.reporterUsername}
                    </td>
                    <td className="py-4 px-4">
                      {issue.reporterOffice || "Not Assigned"}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => setSelectedIssue(issue)}
                        className="text-green-700 hover:text-green-900"
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
        {issues.length > issuesPerPage && (
          <div className="flex justify-center items-center mt-6 space-x-4">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className={`px-5 py-2 rounded-lg text-white font-medium ${
                currentPage === 1
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              Previous
            </button>

            <span className="text-gray-700 font-medium text-lg">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-5 py-2 rounded-lg text-white font-medium ${
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

      {selectedIssue && (
        <IssueModal
          issue={selectedIssue}
          index={issues.findIndex((i) => i._id === selectedIssue._id)}
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
    return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg">
        <h3 className="text-2xl font-extrabold mb-6 text-center text-gray-900">
          Issue Details
        </h3>

        <div className="space-y-3 text-gray-800 text-lg font-medium">
          <p><b>Issue ID:</b> {issue.issueId || 101 + index}</p>
          <p><b>Plaza Name:</b> {issue.plazaName || "N/A"}</p>
          <p><b>Issue Type:</b> {issue.issueType}</p>
          <p><b>Description:</b> {issue.description}</p>
          <p><b>Status:</b> {issue.status}</p>
          <p><b>Remarks:</b> {issue.remarks || "No remarks"}</p>
          <p><b>Rectified Date:</b> {formatDateTime(issue.rectifiedDate)}</p>
          <p><b>Reported By:</b> {issue.reporterFullName || issue.reporterUsername}</p>
          <p><b>Office:</b> {issue.reporterOffice || "Not Assigned"}</p>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageIssues;
