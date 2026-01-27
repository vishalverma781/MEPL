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
  <div className="flex-1 min-h-screen overflow-y-auto transition-all duration-300 md:ml-50 p-10 px-8 py-6">
    <div className="bg-white shadow-xl rounded-xl p-10 w-full max-w-6xl">
      
      <h2 className="text-lg sm:text-xl font-bold text-center mb-4 text-gray-900">
        All Roles
      </h2>

      {roles.length === 0 ? (
        <p className="text-center text-gray-500 text-sm">
          No roles assigned yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-800 text-white text-xs sm:text-sm">
                <th className="p-2 whitespace-nowrap text-left">Full Name</th>
                <th className="p-2 hidden sm:table-cell">Username</th>
                <th className="p-2 text-left">Role</th>
                <th className="p-2 hidden sm:table-cell">Assigned By</th>
                <th className="p-2 hidden sm:table-cell">From Date</th>
                <th className="p-2 text-center">View</th>
              </tr>
            </thead>

            <tbody>
              {currentRoles.map((role, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-200 hover:bg-gray-50 text-xs sm:text-sm"
                >
                  <td className="p-2 whitespace-nowrap">
                    {role.employeeId?.fullName || "N/A"}
                  </td>

                  <td className="p-2 hidden sm:table-cell">
                    {role.employeeId?.username || "N/A"}
                  </td>

                  <td className="p-2 whitespace-nowrap">{role.role}</td>

                  <td className="p-2  hidden sm:table-cell">
                    {role.assignBy?.username || "Admin"}
                  </td>

                  <td className="p-2 hidden sm:table-cell">
                    {role.fromDate ? formatDate(role.fromDate) : "N/A"}
                  </td>

                  <td className="p-2 text-center">
                    <button
                      onClick={() => setSelectedRole(role)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <FaEye size={14} />
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
        <div className="flex justify-center items-center mt-3 gap-3">
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded text-xs text-white ${
              currentPage === 1
                ? "bg-gray-400"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Previous
          </button>

          <span className="text-xs text-gray-700">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded text-xs text-white ${
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

    {/* ===== View Modal ===== */}
    {selectedRole && (
      <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-3">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-4 text-xs sm:text-sm">

          <h3 className="text-sm font-bold text-center mb-3">
            Role Details
          </h3>

          <div className="space-y-2 text-gray-800">
            <p><b>Full Name:</b> {selectedRole.employeeId?.fullName || "N/A"}</p>
            <p><b>Username:</b> {selectedRole.employeeId?.username || "N/A"}</p>
            <p><b>Role:</b> {selectedRole.role}</p>

            {["Site Engineer", "Plaza Incharge"].includes(selectedRole.role) && (
              <>
                <p><b>Project:</b> {selectedRole.assignedProject?.projectName || "N/A"}</p>
                <p><b>Plaza:</b> {selectedRole.assignedPlaza?.plazaName || "N/A"}</p>
              </>
            )}

            {selectedRole.role === "Project Manager" && (
              <p><b>Project:</b> {selectedRole.assignedProject?.projectName || "N/A"}</p>
            )}

            {["Software Developer", "Senior Software Developer"].includes(selectedRole.role) && (
              <p><b>Office:</b> {
                selectedRole.office === "head"
                  ? "Head Office"
                  : selectedRole.office === "branch"
                  ? "Branch Office"
                  : "N/A"
              }</p>
            )}

            <p><b>Assigned By:</b> {selectedRole.assignBy?.username || "Admin"}</p>
            <p><b>From Date:</b> {selectedRole.fromDate ? formatDate(selectedRole.fromDate) : "N/A"}</p>
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={() => setSelectedRole(null)}
              className="px-4 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
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
