import React, { useState, useEffect } from "react";
import { FaEye, FaPlus, FaMinus } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";

const ReportScheduler = () => {
  const [reports, setReports] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReport, setSelectedReport] = useState(null);
  const [addEmailReport, setAddEmailReport] = useState(null);
  const [removeEmailReport, setRemoveEmailReport] = useState(null);
  const [emailList, setEmailList] = useState([""]);
  const [permission, setPermission] = useState("Yes");

  const reportsPerPage = 4;

  // ---------------------------------------------
  // 🧩 Helper functions for email fields
  const handleAddField = () => setEmailList((prev) => [...prev, ""]);

  const handleEmailChange = (index, value) => {
    const updated = [...emailList];
    updated[index] = value;
    setEmailList(updated);
  };

  const handleRemoveField = (index) =>
    setEmailList((prev) => prev.filter((_, i) => i !== index));
  // ---------------------------------------------

  // 📦 Fetch reports + email lists from backend
  const fetchReports = async () => {
    try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${import.meta.env.VITE_API_URL}/projects`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const projectsData = await res.json();

    const plazaRes = await fetch(`${import.meta.env.VITE_API_URL}/plazas`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const plazasData = await plazaRes.json();

      // 🧩 Fetch stored emails for each project
      const withEmails = await Promise.all(
        projectsData.map(async (project) => {
          const emailRes = await axios.get(
            `${import.meta.env.VITE_API_URL}/emails/${project._id}`
          );
          const projectPlazas = plazasData.filter(
            (plaza) => plaza.projectId?._id === project._id
          );
          return {
            ...project,
            emails: emailRes.data?.emails || [],
            permission: project.permission || "Yes",
            plazaNames: projectPlazas.map((p) => p.plazaName),
          };
        })
      );

      setReports(withEmails);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch reports");
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const totalPages = Math.ceil(reports.length / reportsPerPage);
  const indexOfLast = currentPage * reportsPerPage;
  const indexOfFirst = indexOfLast - reportsPerPage;
  const currentReports = reports.slice(indexOfFirst, indexOfLast);

  const handleNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const handlePrev = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  // 🧩 Save email + send report
  const handleSaveEmails = async () => {
    const newEmails = emailList.filter((e) => e.trim() !== "");
    if (newEmails.length === 0) {
      Swal.fire("Error", "Please add at least one valid email!", "error");
      return;
    }

    try {
      Swal.fire({
        title: "Saving Emails & Sending Report...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

   // 1️⃣ Save emails in EmailModel
    await axios.post(`${import.meta.env.VITE_API_URL}/emails/save`, {
      projectId: addEmailReport._id,
      emails: newEmails,
    });

      // 2️⃣ Send report
  await axios.post(`${import.meta.env.VITE_API_URL}/reports/send`, {
      emails: newEmails,
    });


      Swal.fire("Success", "Emails saved & report sent successfully!", "success");

      // 3️⃣ Update frontend
      const updatedReports = reports.map((r) =>
        r._id === addEmailReport._id
          ? { ...r, emails: [...r.emails, ...newEmails] }
          : r
      );
      setReports(updatedReports);
      setAddEmailReport(null);
      setEmailList([""]);
    } catch (err) {
      console.error("❌ Error:", err);
      Swal.fire("Error", err.response?.data?.error || "Failed to save/send", "error");
    }
  };

  // 🧩 Remove email (also remove from DB)
  const handleRemoveEmail = async (email, report) => {
      try {
    await axios.post(`${import.meta.env.VITE_API_URL}/emails/remove`, {
      projectId: report._id,
      email,
    });

      const updated = reports.map((r) =>
        r._id === report._id
          ? { ...r, emails: r.emails.filter((e) => e !== email) }
          : r
      );

      setReports(updated);
      setRemoveEmailReport((prev) => ({
        ...prev,
        emails: prev.emails.filter((e) => e !== email),
      }));
    } catch (err) {
      Swal.fire("Error", "Failed to remove email", "error");
    }
  };

  const handlePermissionChange = (value) => {
    setPermission(value);
    const updated = reports.map((r) =>
      r._id === selectedReport._id ? { ...r, permission: value } : r
    );
    setReports(updated);
  };

 // 🧱 UI Section Below (unchanged UI)
  return (
      <div className="w-full min-h-screen flex justify-center items-start ">
      <div className="bg-white pb-40 shadow-2xl rounded-2xl p-4 w-full max-w-7xl">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-900">
          REPORT SCHEDULER
        </h2>

        {reports.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No reports added yet.</p>
        ) : (
          <div className="overflow-x-auto">
  <table className="w-full border border-gray-300 rounded-xl overflow-hidden">
    <thead>
      <tr className="bg-gray-800 text-white text-xl">
        <th className="p-5 text-left hidden sm:table-cell">S. No.</th>
        <th className="p-5 text-left">Project Name</th>
        <th className="p-5 text-left hidden sm:table-cell">Plaza Names</th>
        <th className="p-5 text-left hidden sm:table-cell">Client Emails</th>
        <th className="p-5 text-left hidden sm:table-cell">Permission</th>
        <th className="p-5 text-center">View</th>
        <th className="p-5 text-center">Add</th>
        <th className="p-5 text-center">Remove</th>
      </tr>
    </thead>
    <tbody>
      {currentReports.map((report, index) => (
        <tr
          key={report._id}
          className="border-b border-gray-200 hover:bg-gray-100 transition text-lg"
        >
          <td className="py-6 px-4 hidden sm:table-cell">{indexOfFirst + index + 1}</td>
          <td className="py-6 px-4">{report.projectName}</td>
          <td className="py-6 px-4 font-bold hidden sm:table-cell">
            {report.plazaNames?.length > 0 ? report.plazaNames.join(", ") : "—"}
          </td>
          <td className="py-6 px-4 font-bold hidden sm:table-cell">
            {report.emails.length > 0 ? report.emails.join(", ") : "—"}
          </td>
          <td className="py-6 px-4 font-bold hidden sm:table-cell">
            {report.permission === "Yes" ? (
              <span className="text-green-600 font-semibold">Yes</span>
            ) : (
              <span className="text-red-600 font-semibold">No</span>
            )}
          </td>

          {/* Buttons: View/Add/Remove - Always visible */}
          <td className="py-6 px-4 text-center">
            <button
              onClick={() => {
                setSelectedReport(report);
                setPermission(report.permission || "Yes");
              }}
              className="text-green-600 hover:text-green-800"
            >
              <FaEye size={22} />
            </button>
          </td>
          <td className="py-6 px-4 text-center">
            <button
              onClick={() => setAddEmailReport(report)}
              className="text-blue-600 hover:text-blue-800"
            >
              <FaPlus size={22} />
            </button>
          </td>
          <td className="py-6 px-4 text-center">
            <button
              onClick={() => setRemoveEmailReport(report)}
              className="text-red-600 hover:text-red-800"
            >
              <FaMinus size={22} />
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

        )}

        {/* Pagination */}
        {reports.length > reportsPerPage && (
          <div className="flex justify-center items-center mt-6 space-x-4">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className={`px-5 py-2 rounded-lg text-white font-medium ${
                currentPage === 1
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              Previous
            </button>
            <span className="text-gray-700 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNext}
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
     {/* 👁️ View Modal */}
{selectedReport && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
    <div className="bg-white p-10 rounded-2xl shadow-2xl w-[90%] max-w-lg">
      <h3 className="text-3xl font-bold mb-8 text-center text-gray-900">
        Report Details
      </h3>

      <div className="space-y-5 text-gray-800 text-xl font-medium">
        {/* Project Name */}
        <p>
          <span className="font-bold text-gray-900">Project Name:</span>{" "}
          {selectedReport.projectName || "—"}
        </p>

        {/* Plaza Names */}
        <p>
          <span className="font-bold text-gray-900">Plaza Names:</span>{" "}
          {selectedReport.plazaNames && selectedReport.plazaNames.length > 0
            ? selectedReport.plazaNames.join(", ")
            : "—"}
        </p>

        {/* Client Emails */}
        <p>
          <span className="font-bold text-gray-900">Client Emails:</span>{" "}
          {selectedReport.emails && selectedReport.emails.length > 0
            ? selectedReport.emails.join(", ")
            : "—"}
        </p>

        {/* Permission Field */}
        <div className="flex items-center gap-4">
          <span className="font-bold text-gray-900">Permission:</span>
          <select
            value={permission}
            onChange={(e) => handlePermissionChange(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
      </div>

      {/* Close Button */}
      <div className="mt-10 flex justify-center">
        <button
          onClick={() => setSelectedReport(null)}
          className="px-8 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-xl font-semibold"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}


      {/* Add Email Modal */}
      {addEmailReport && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white p-10 rounded-2xl shadow-2xl w-[90%] max-w-lg">
            <h3 className="text-3xl font-extrabold mb-8 text-center text-gray-900">
              Add Client Emails
            </h3>

            <div className="space-y-4">
              {emailList.map((email, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => handleEmailChange(index, e.target.value)}
                    placeholder="Enter client email"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:ring-2 focus:ring-blue-500"
                  />
                  {emailList.length > 1 && (
                    <button
                      onClick={() => handleRemoveField(index)}
                      className="bg-red-500 text-white px-3 rounded-lg"
                    >
                      <FaMinus />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={handleAddField}
                className="text-blue-600 hover:text-blue-800 flex items-center gap-2 mt-3 font-medium"
              >
                <FaPlus /> Add Another
              </button>
            </div>

            <div className="mt-10 flex justify-center gap-4">
              <button
                onClick={handleSaveEmails}
                className="px-5 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-xl font-semibold"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setAddEmailReport(null);
                  setEmailList([""]);
                }}
                className="px-8 py-3 bg-gray-800 text-white rounded-lg transition text-xl font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Email Modal */}
      {removeEmailReport && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white p-10 rounded-2xl shadow-2xl w-[90%] max-w-lg">
            <h3 className="text-3xl font-extrabold mb-8 text-center text-gray-900">
              Remove Client Emails
            </h3>
            <div className="space-y-3 text-lg">
              {removeEmailReport.emails.length > 0 ? (
                removeEmailReport.emails.map((email, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center border rounded-lg px-4 py-3"
                  >
                    <span>{email}</span>
                    <button
                      onClick={() => handleRemoveEmail(email, removeEmailReport)}
                      className="text-red-600 hover:text-red-800 font-semibold"
                    >
                      <FaMinus size={16} />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 text-center">No emails to remove.</p>
              )}
            </div>
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setRemoveEmailReport(null)}
                className="px-8 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition text-xl font-semibold"
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

export default ReportScheduler;
