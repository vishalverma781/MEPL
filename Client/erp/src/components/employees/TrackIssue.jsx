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

