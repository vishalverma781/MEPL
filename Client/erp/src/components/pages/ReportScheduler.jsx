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
<div className="flex-1 min-h-screen p-10 overflow-x-auto overflow-y-auto transition-all duration-300 md:ml-20 pr-8 py-2
">

<div className="bg-white shadow-xl rounded-xl p-10 w-full max-w-7xl mx-auto">

      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-5 text-gray-900">
        REPORT SCHEDULER
      </h2>

      {reports.length === 0 ? (
        <p className="text-center text-gray-500 text-sm">
          No reports added yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-800 text-white text-sm sm:text-base">
                <th className="p-3 hidden sm:table-cell">S.No</th>
                <th className="p-3  whitespace-nowrap">Project Name</th>
                <th className="p-3 hidden whitespace-nowrap sm:table-cell">Plaza Names</th>
                <th className="p-3 hidden sm:table-cell">Client Emails</th>
                <th className="p-3 hidden sm:table-cell">Permission</th>
                <th className="p-3 text-center">View</th>
                <th className="p-3 text-center">Add</th>
                <th className="p-3 text-center">Remove</th>
              </tr>
            </thead>

            <tbody>
              {currentReports.map((report, index) => (
                <tr
                  key={report._id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition text-sm sm:text-base"
                >
                  <td className="p-3 hidden sm:table-cell">
                    {indexOfFirst + index + 1}
                  </td>

                  <td className="p-3  whitespace-nowrap">{report.projectName}</td>

                  <td className="p-3 hidden sm:table-cell">
                    {report.plazaNames?.length > 0 ? report.plazaNames.join(", ") : "—"}
                  </td>

                  <td className="p-3 hidden sm:table-cell">
                    {report.emails.length > 0 ? report.emails.join(", ") : "—"}
                  </td>

                  <td className="p-3 hidden sm:table-cell">
                    {report.permission === "Yes" ? (
                      <span className="text-green-600 font-semibold">Yes</span>
                    ) : (
                      <span className="text-red-600 font-semibold">No</span>
                    )}
                  </td>

                  <td className="p-3 text-center">
                    <button
                      onClick={() => {
                        setSelectedReport(report);
                        setPermission(report.permission || "Yes");
                      }}
                      className="text-green-600 hover:text-green-800"
                    >
                      <FaEye size={18} />
                    </button>
                  </td>

                  <td className="p-3 text-center">
                    <button
                      onClick={() => setAddEmailReport(report)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaPlus size={18} />
                    </button>
                  </td>

                  <td className="p-3 text-center">
                    <button
                      onClick={() => setRemoveEmailReport(report)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaMinus size={18} />
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
        <div className="flex justify-center items-center mt-4 gap-3">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded text-xs text-white ${
              currentPage === 1 ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Previous
          </button>

          <span className="text-xs text-gray-700">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded text-xs text-white ${
              currentPage === totalPages ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>

    {/* ===== VIEW MODAL ===== */}
    {selectedReport && (
      <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-3">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-5">

          <h3 className="text-lg font-bold text-center mb-3">
            Report Details
          </h3>

          <div className="space-y-2 text-gray-800 text-sm">
            <p><b>Project:</b> {selectedReport.projectName || "—"}</p>
            <p><b>Plazas:</b> {selectedReport.plazaNames?.join(", ") || "—"}</p>
            <p><b>Emails:</b> {selectedReport.emails?.join(", ") || "—"}</p>

            <div className="flex items-center gap-2">
              <b>Permission:</b>
              <select
                value={permission}
                onChange={(e) => handlePermissionChange(e.target.value)}
                className="border rounded px-2 py-1 text-xs"
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={() => setSelectedReport(null)}
              className="px-4 py-1 bg-red-500 text-white rounded text-xs"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )}



      {/* Add Email Modal */}
   {addEmailReport && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 p-3">
    <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">

      <h3 className="text-lg font-bold mb-4 text-center text-gray-900">
        Add Client Emails
      </h3>

      <div className="space-y-3">
        {emailList.map((email, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => handleEmailChange(index, e.target.value)}
              placeholder="Enter client email"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
            />

            {emailList.length > 1 && (
              <button
                onClick={() => handleRemoveField(index)}
                className="bg-red-500 text-white px-3 rounded-md hover:bg-red-600"
              >
                <FaMinus size={12} />
              </button>
            )}
          </div>
        ))}

        <button
          onClick={handleAddField}
          className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm font-medium mt-2"
        >
          <FaPlus size={12} /> Add Another
        </button>
      </div>

      <div className="mt-5 flex justify-center gap-3">
        <button
          onClick={handleSaveEmails}
          className="px-4 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-semibold"
        >
          Save
        </button>

        <button
          onClick={() => {
            setAddEmailReport(null);
            setEmailList([""]);
          }}
          className="px-4 py-1.5 bg-gray-700 text-white rounded-md hover:bg-gray-800 text-sm font-semibold"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}


      {/* Remove Email Modal */}
 {removeEmailReport && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 p-3">
    <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">

      <h3 className="text-lg font-bold mb-4 text-center text-gray-900">
        Remove Client Emails
      </h3>

      <div className="space-y-2 text-sm">
        {removeEmailReport.emails.length > 0 ? (
          removeEmailReport.emails.map((email, index) => (
            <div
              key={index}
              className="flex justify-between items-center border rounded-md px-3 py-2"
            >
              <span className="text-gray-700">{email}</span>

              <button
                onClick={() => handleRemoveEmail(email, removeEmailReport)}
                className="text-red-600 hover:text-red-800"
              >
                <FaMinus size={12} />
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center text-sm">
            No emails to remove.
          </p>
        )}
      </div>

      <div className="mt-5 flex justify-center">
        <button
          onClick={() => setRemoveEmailReport(null)}
          className="px-5 py-1.5 bg-gray-700 text-white rounded-md hover:bg-gray-800 text-sm font-semibold"
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
