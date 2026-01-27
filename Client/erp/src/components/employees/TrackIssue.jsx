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
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/issues`, {
        headers: { Authorization: `Bearer ${token}` },
      });
         // ✅ Hide resolved issues
      const activeIssues = res.data.filter(
        (issue) => issue.status !== "Resolved"
      );

      setIssues(activeIssues);
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
       setIssues((prev) => prev.filter((issue) => issue._id !== id));

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
 <div className="flex-1 min-h-screen p-10 overflow-x-auto overflow-y-auto transition-all duration-300 md:ml-50 pr-8 py-2
">

<div className="bg-white shadow-xl rounded-xl p-10 w-full max-w-7xl mx-auto">

      <h2 className="text-2xl font-bold text-center mb-5 text-gray-900">
        Track Issues
      </h2>

      {issues.length === 0 ? (
        <p className="text-center text-gray-500 text-sm">
          No issues found!
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 rounded-lg overflow-hidden text-sm">
            <thead>
              <tr className="bg-gray-800 text-white text-sm sm:text-base">
                <th className="p-2 hidden sm:table-cell">Sr</th>
                <th className="p-2 hidden sm:table-cell">ID</th>
                <th className="p-2">Plaza</th>
                <th className="p-2 hidden sm:table-cell">Type</th>
                <th className="p-2">Desc</th>
                <th className="p-2">Status</th>
                <th className="p-2 hidden sm:table-cell">By</th>
                <th className="p-2 text-center">View</th>
              </tr>
            </thead>

            <tbody>
              {currentIssues.map((issue, index) => (
                <tr key={issue._id}
                  className="border-b hover:bg-gray-50 transition text-xs sm:text-sm">

                  <td className="p-2 hidden sm:table-cell">
                    {indexOfFirst + index + 1}
                  </td>

                  <td className="p-2 hidden sm:table-cell">
                    {issue.issueId}
                  </td>

                  <td className="p-2">
                    {issue.plazaName || "N/A"}
                  </td>

                  <td className="p-2 hidden sm:table-cell">
                    {issue.issueType}
                  </td>

                  <td className="p-2">
                    {issue.description}
                  </td>

                  <td className="p-2 font-medium">
                    {issue.status}
                  </td>

                  <td className="p-2 hidden sm:table-cell">
                    {issue.reporterFullName || issue.reporterUsername}
                  </td>

                  <td className="p-2 text-center">
                    <button
                      onClick={() => setSelectedIssue(issue)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <FaEye size={16} />
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
        <div className="flex justify-center items-center mt-3 gap-2 text-sm">
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded text-white ${
              currentPage === 1
                ? "bg-gray-400"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Prev
          </button>

          <span className="text-gray-700">
            {currentPage} / {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded text-white ${
              currentPage === totalPages
                ? "bg-gray-400"
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
    return d.toLocaleString();
  };

  const handleSubmit = () => {
    if (!remarks.trim()) return;
    const updatedDate = status === "Resolved" ? new Date() : null;
    setRectifiedDate(updatedDate);
    onResolve(issue._id, remarks, status);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-3">
      <div className="bg-white p-5 rounded-xl shadow-xl w-full max-w-md">

        <h3 className="text-lg font-bold mb-4 text-center text-gray-900">
          Issue Details
        </h3>

        <div className="space-y-2 text-sm text-gray-800">
          <p><b>ID:</b> {issue.issueId}</p>
          <p><b>Plaza:</b> {issue.plazaName}</p>
          <p><b>Type:</b> {issue.issueType}</p>
          <p><b>Description:</b> {issue.description}</p>

          <div>
            <b>Status:</b>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border rounded px-2 py-1 w-full text-sm mt-1"
            >
              <option>Pending</option>
              <option>Resolved</option>
            </select>
          </div>

          <div>
            <b>Remarks:</b>
            <input
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="border rounded px-2 py-1 w-full text-sm mt-1"
              placeholder="Add remarks..."
            />
          </div>

          {status === "Resolved" && (
            <p><b>Rectified:</b> {formatDateTime(rectifiedDate)}</p>
          )}

          <p><b>Reported By:</b> {issue.reporterFullName || issue.reporterUsername}</p>
          <p><b>Office:</b> {issue.reporterOffice || "N/A"}</p>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={handleSubmit}
            className="px-4 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
          >
            Submit
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrackIssues;
