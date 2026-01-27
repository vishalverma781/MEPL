import React, { useState, useEffect } from "react";
import { FaEye } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";

const AllIssues = () => {
  const [issues, setIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const issuesPerPage = 5;

  const formatDateTime = (date) => {
    if (!date) return "Not Rectified";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    const seconds = String(d.getSeconds()).padStart(2, "0");
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  };

  // Fetch all issues
  const fetchIssues = async () => {
       try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/issues`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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

  // ✅ Update issue (Pending bhi ab permanent update hoga)
  const handleUpdateIssue = async (id, newStatus, newRemarks) => {
    const updatedDate = newStatus === "Resolved" ? new Date().toISOString() : null;

    // ✅ Frontend update
    setIssues((prev) =>
      prev.map((issue) =>
        issue._id === id
          ? {
              ...issue,
              status: newStatus,
              remarks: newRemarks || "",
              rectifiedDate: updatedDate,
            }
          : issue
      )
    );

    // ✅ Backend update
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_API_URL}/issues/${id}/resolve`,
        {
          status: newStatus,
          remarks: newRemarks || "",
          rectifiedDate: updatedDate,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire({
        icon: "success",
        title: "Success",
        text:
          newStatus === "Resolved"
            ? "Issue marked as Resolved!"
            : "Issue marked as Pending!",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.msg || "Failed to update issue",
      });
    }
  };

  // Pagination
  const totalPages = Math.ceil(issues.length / issuesPerPage);
  const indexOfLast = currentPage * issuesPerPage;
  const indexOfFirst = indexOfLast - issuesPerPage;
  const currentIssues = issues.slice(indexOfFirst, indexOfLast);

return (
  <div className="w-full min-h-screen flex justify-center items-start p-10 md:ml-5 sm:p-8">
    <div className="bg-white shadow-xl rounded-xl mb-6 p-5 sm:p-8 w-full max-w-6xl">

      <h2 className="text-xl sm:text-2xl font-bold text-center mb-5 text-gray-900">
        All Issues
      </h2>

      {issues.length === 0 ? (
        <p className="text-center text-gray-500 text-base">
          No issues found!
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-800 text-white text-sm sm:text-base">
                <th className="p-3">Sr.No</th>
                <th className="p-3">Issue ID</th>
                <th className="p-3">Plaza</th>
                <th className="p-3 hidden sm:table-cell">Status</th>
                <th className="p-3 hidden sm:table-cell">Remarks</th>
                <th className="p-3 hidden sm:table-cell">Reported By</th>
                <th className="p-3 hidden sm:table-cell">Rectified Date</th>
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
                  <td className="p-3">{issue.issueId || 101 + indexOfFirst + index}</td>
                  <td className="p-3">{issue.plazaName || "N/A"}</td>
                  <td className="p-3 hidden sm:table-cell">{issue.status}</td>
                  <td className="p-3 hidden sm:table-cell">{issue.remarks || "-"}</td>
                  <td className="p-3 hidden sm:table-cell">
                    {issue.reporterFullName || issue.reporterUsername}
                  </td>
                  <td className="p-3 hidden sm:table-cell">
                    {formatDateTime(issue.rectifiedDate)}
                  </td>
                  <td className="p-3 text-center">
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

      {issues.length > issuesPerPage && (
        <div className="flex justify-center items-center mt-4 gap-4">
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-1.5 rounded text-sm text-white ${
              currentPage === 1
                ? "bg-gray-400"
                : "bg-blue-600 hover:bg-blue-700"
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
        onResolve={handleUpdateIssue}
      />
    )}
  </div>
);

};

const IssueModal = ({ issue, onClose, onResolve }) => {
  const [status, setStatus] = useState(issue.status || "Pending");
  const [remarks, setRemarks] = useState(issue.remarks || "");
  const [rectifiedDate, setRectifiedDate] = useState(issue.rectifiedDate || null);

  const formatDateTime = (date) => {
    if (!date) return "Not Rectified";
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2,"0")}-${String(d.getMonth()+1).padStart(2,"0")}-${d.getFullYear()} ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
  };

  const handleSubmit = () => {
    const updatedDate = status === "Resolved" ? new Date().toISOString() : null;
    setRectifiedDate(updatedDate);
    onResolve(issue._id, status, remarks.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-3">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 text-sm sm:text-base">

        <h3 className="text-lg sm:text-xl font-bold mb-4 text-center">
          Issue Details
        </h3>

        <div className="space-y-2 text-gray-800">
          <p><b>Issue ID:</b> {issue.issueId}</p>
          <p><b>Plaza:</b> {issue.plazaName || "N/A"}</p>
          <p><b>Issue Type:</b> {issue.issueType}</p>
          <p><b>Description:</b> {issue.description}</p>
          <p><b>Status:</b></p>

          <select
            value={status}
            onChange={(e)=>setStatus(e.target.value)}
            className="border rounded-md p-2 w-full text-sm"
          >
            <option value="Pending">Pending</option>
            <option value="Resolved">Resolved</option>
          </select>

          <p><b>Remarks:</b></p>
          <input
            type="text"
            value={remarks}
            onChange={(e)=>setRemarks(e.target.value)}
            className="border rounded-md p-2 w-full text-sm"
            placeholder="Add remarks"
          />

          {status === "Resolved" && (
            <p><b>Rectified Date:</b> {formatDateTime(rectifiedDate)}</p>
          )}

          <p><b>Reported By:</b> {issue.reporterFullName || issue.reporterUsername}</p>
          <p><b>Office:</b> {issue.reporterOffice || "N/A"}</p>
        </div>

        <div className="mt-5 flex justify-end gap-3">
          <button
            onClick={handleSubmit}
            className="px-5 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
          >
            Submit
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-red-500 text-white rounded-md text-sm hover:bg-red-600"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};


export default AllIssues;
