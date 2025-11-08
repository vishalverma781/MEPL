import React, { useState, useEffect } from "react";
import { FaEye } from "react-icons/fa";

const AllRoles = () => {
  const [roles, setRoles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRole, setSelectedRole] = useState(null);
  const rolesPerPage = 4;
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/roles`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setRoles(data);
      } catch (err) {
        console.error("Error fetching roles:", err);
      }
    };
    fetchRoles();
  }, [token]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}`;
  };

  const totalPages = Math.ceil(roles.length / rolesPerPage);
  const indexOfLastRole = currentPage * rolesPerPage;
  const indexOfFirstRole = indexOfLastRole - rolesPerPage;
  const currentRoles = Array.isArray(roles) ? roles.slice(indexOfFirstRole, indexOfLastRole) : [];

  return (
    <div className="w-full min-h-screen flex justify-center items-start p-4 sm:p-10">
      <div className="bg-white shadow-2xl rounded-2xl p-6 sm:p-8 w-full max-w-7xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-gray-900">All Roles</h2>

        {roles.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No roles assigned yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-gray-800 text-white text-lg sm:text-xl">
                  <th className="p-3 sm:p-5 text-left">Full Name</th>
                  <th className="p-3 sm:p-5 text-left hidden sm:table-cell">Username</th>
                  <th className="p-3 sm:p-5 text-left">Assign Role</th>
                  <th className="p-3 sm:p-5 text-left hidden sm:table-cell">Assigned By</th>
                  <th className="p-3 sm:p-5 text-left hidden sm:table-cell">From Date</th>
                  <th className="p-3 sm:p-5 text-center">View</th>
                </tr>
              </thead>
              <tbody>
                {currentRoles.map((role, idx) => (
                  <tr key={idx} className="border-b border-gray-200 hover:bg-gray-100 transition text-lg sm:text-lg">
                    <td className="p-3 sm:p-5">{role.employeeId?.fullName || "N/A"}</td>
                    <td className="p-3 sm:p-5 hidden sm:table-cell">{role.employeeId?.username || "N/A"}</td>
                    <td className="p-3 sm:p-5">{role.role}</td>
                    <td className="p-3 sm:p-5 hidden sm:table-cell">{role.assignBy?.username || "Admin"}</td>
                    <td className="p-3 sm:p-5 hidden sm:table-cell">{role.fromDate ? formatDate(role.fromDate) : "N/A"}</td>
                    <td className="p-3 sm:p-5 text-center">
                      <button onClick={() => setSelectedRole(role)} className="text-green-600 hover:text-green-800">
                        <FaEye size={24} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {roles.length > rolesPerPage && (
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

      {/* View Modal */}
      {selectedRole && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-2xl w-[90%] max-w-lg">
            <h3 className="text-2xl sm:text-3xl font-extrabold mb-6 sm:mb-8 text-center text-gray-900">Role Details</h3>
            <div className="space-y-4 sm:space-y-5 text-gray-800 text-lg sm:text-xl font-medium">

              <p><span className="font-bold">Full Name:</span> {selectedRole.employeeId?.fullName || "N/A"}</p>
              <p><span className="font-bold">Username:</span> {selectedRole.employeeId?.username || "N/A"}</p>
              <p><span className="font-bold">Assign Role:</span> {selectedRole.role}</p>

              {["Site Engineer", "Plaza Incharge"].includes(selectedRole.role) && (
                <>
                  <p><span className="font-bold">Project:</span> {selectedRole.assignedProject?.projectName || "N/A"}</p>
                  <p><span className="font-bold">Plaza:</span> {selectedRole.assignedPlaza?.plazaName || "N/A"}</p>
                </>
              )}

              {selectedRole.role === "Project Manager" && (
                <p><span className="font-bold">Project:</span> {selectedRole.assignedProject?.projectName || "N/A"}</p>
              )}

              {["Software Developer", "Senior Software Developer"].includes(selectedRole.role) && (
                <p><span className="font-bold">Office:</span> 
                  {selectedRole.office === "head" ? "Head Office" : selectedRole.office === "branch" ? "Branch Office" : "N/A"}
                </p>
              )}

              <p><span className="font-bold">Assigned By:</span> {selectedRole.assignBy?.username || "Admin"}</p>
              <p><span className="font-bold">From Date:</span> {selectedRole.fromDate ? formatDate(selectedRole.fromDate) : "N/A"}</p>
            </div>

            <div className="mt-6 sm:mt-10 flex justify-center">
              <button
                onClick={() => setSelectedRole(null)}
                className="px-6 sm:px-8 py-2 sm:py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-lg sm:text-xl font-semibold"
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

export default AllRoles;
