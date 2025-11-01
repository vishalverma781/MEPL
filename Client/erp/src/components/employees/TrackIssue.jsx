import React, { useState, useEffect } from "react";
import { FaEye } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";

const TrackIssues = () => {
  const [issues, setIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const issuesPerPage = 5;

  // Fetch issues from backend
  const fetchIssues = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/issues`, // ✅ fixed
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

  // ✅ Resolve or update issue handler
  const handleResolveIssue = async (id, remarksText, newStatus = "Resolved") => {
    if (!remarksText.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const updatedDate = newStatus === "Resolved" ? new Date().toISOString() : null;

      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/issues/${id}/resolve`,
        {
          remarks: remarksText,
          status: newStatus,
          rectifiedDate: updatedDate,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ✅ Remove resolved issue from local state
      setIssues(prev => prev.filter(issue => issue._id !== id));

      Swal.fire({
        icon: "success",
        title: "Success",
        text: `Issue "${res.data.issueType}" marked as Resolved!`,
        timer: 2000,
        showConfirmButton: false,
      });

      setSelectedIssue(null);
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.msg || "Failed to update issue",
      });
    }
  };

  const totalPages = Math.ceil(issues.length / issuesPerPage);
  const indexOfLast = currentPage * issuesPerPage;
  const indexOfFirst = indexOfLast - issuesPerPage;
  const currentIssues = issues.slice(indexOfFirst, indexOfLast);

  return (
    <div className="w-full min-h-screen flex justify-center items-start p-10">
      <div className="bg-white shadow-2xl rounded-2xl mb-10 p-10 w-full max-w-7xl">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-900">Track Issues</h2>

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
                  <tr key={issue._id} className="border-b border-gray-200 hover:bg-gray-100 transition text-lg">
                    <td className="py-4 px-4">{indexOfFirst + index + 1}</td>
                    <td className="py-4 px-4">{issue.issueId}</td>
                    <td className="py-4 px-4">{issue.plazaName || "N/A"}</td>
                    <td className="py-4 px-4">{issue.issueType}</td>
                    <td className="py-4 px-4">{issue.description}</td>
                    <td className="py-4 px-4">{issue.status}</td>
                    <td className="py-4 px-4 font-medium">{issue.reporterFullName || issue.reporterUsername}</td>
                    <td className="py-4 px-4">{issue.reporterOffice || "Not Assigned"}</td>
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => setSelectedIssue(issue)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <FaEye size={20}/>
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
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className={`px-5 py-2 rounded-lg text-white font-medium ${currentPage === 1 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
            >
              Previous
            </button>
            <span className="text-gray-700 font-medium text-lg">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-5 py-2 rounded-lg text-white font-medium ${currentPage === totalPages ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {selectedIssue && (
        <IssueModal
          issue={selectedIssue}
          onClose={() => setSelectedIssue(null)}
          onResolve={handleResolveIssue}
        />
      )}
    </div>
  );
};

// ✅ IssueModal
const IssueModal = ({ issue, onClose, onResolve }) => {
  const [remarks, setRemarks] = useState(issue.remarks || "");
  const [status, setStatus] = useState(issue.status || "Pending");
  const [rectifiedDate, setRectifiedDate] = useState(issue.rectifiedDate || null);

  const formatDateTime = (date) => {
    if (!date) return "Not Yet Rectified";
    const d = new Date(date);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");
    const ss = String(d.getSeconds()).padStart(2, "0");
    return `${dd}-${mm}-${yyyy} ${hh}:${min}:${ss}`;
  };

  const handleSubmit = () => {
    if (!remarks.trim()) return;

    const updatedDate = status === "Resolved" ? new Date() : null;
    setRectifiedDate(updatedDate);

    onResolve(issue._id, remarks, status);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg">
        <h3 className="text-2xl font-extrabold mb-6 text-center text-gray-900">Issue Details</h3>
        <div className="space-y-3 text-gray-800 text-lg font-medium">
          <p><span className="font-bold">Issue ID:</span> {issue.issueId}</p>
          <p><span className="font-bold">Plaza Name:</span> {issue.plazaName || "N/A"}</p>
          <p><span className="font-bold">Issue Type:</span> {issue.issueType}</p>
          <p><span className="font-bold">Description:</span> {issue.description}</p>
          <p><span className="font-bold">Status:</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border rounded-lg p-2 w-full text-lg bg-white"
            >
              <option value="Pending">Pending</option>
              <option value="Resolved">Resolved</option>
            </select>
          </p>
          <p>
            <span className="font-bold">Remarks:</span>
            <input
              type="text"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Add remarks..."
              className="border rounded-lg p-2 w-full text-lg"
            />
          </p>
          {status === "Resolved" && (
            <p><span className="font-bold">Rectified Date:</span> {formatDateTime(rectifiedDate)}</p>
          )}
          <p><span className="font-bold">Reported By:</span> {issue.reporterFullName || issue.reporterUsername}</p>
          <p><span className="font-bold">Office:</span> {issue.reporterOffice || "Not Assigned"}</p>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={handleSubmit}
            className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 font-semibold"
          >
            Submit
          </button>
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

export default TrackIssues;
