import React, { useState, useEffect } from "react";
import { FaEye, FaTrash } from "react-icons/fa";

const AllPlaza = () => {
  const [plazas, setPlazas] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPlaza, setSelectedPlaza] = useState(null);
  const plazasPerPage = 4;

  // ✅ Fetch Plazas + Total Employees from AllRoles
  const fetchPlazas = async () => {
    try {
      const token = localStorage.getItem("token");


      // ✅ Fetch plazas
      const plazaRes = await fetch(`${import.meta.env.VITE_API_URL}/plazas`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const plazasData = await plazaRes.json();


    // ✅ Fetch all roles (to get employee assignments)
      const roleRes = await fetch(`${import.meta.env.VITE_API_URL}/roles`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const rolesData = await roleRes.json();

      // Map plazas with total employees
      const plazasWithCount = plazasData.map((plaza) => {
        const employeesInPlaza = rolesData.filter(
          (role) => role.assignedPlaza?._id === plaza._id
        );
        return {
          ...plaza,
          totalEmployees: employeesInPlaza.length,
          employeeList: employeesInPlaza,
        };
      });

      setPlazas(plazasWithCount);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch plazas ❌");
    }
  };

  useEffect(() => {
    fetchPlazas();
  }, []);

  // ✅ Delete Plaza
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${import.meta.env.VITE_API_URL}/plazas/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setPlazas(plazas.filter((p) => p._id !== id));
      alert("Plaza deleted successfully ✅");
    } catch (err) {
      console.error(err);
      alert("Failed to delete plaza ❌");
    }
  };

  // ✅ Pagination
  const totalPages = Math.ceil(plazas.length / plazasPerPage);
  const indexOfLastPlaza = currentPage * plazasPerPage;
  const indexOfFirstPlaza = indexOfLastPlaza - plazasPerPage;
  const currentPlazas = plazas.slice(indexOfFirstPlaza, indexOfLastPlaza);

  const handleNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const handlePrev = () => currentPage > 1 && setCurrentPage(currentPage - 1);

return (
  <div className="flex-1 min-h-screen overflow-y-auto transition-all duration-300 md:ml-40 px-6 py-8">
    <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-7xl mx-auto">

      <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 text-gray-900">
        All Plazas
      </h2>

      {plazas.length === 0 ? (
        <p className="text-center text-gray-500 text-base">
          No plazas added yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-gray-800 text-white text-sm sm:text-base">
                <th className="p-3 text-left">Plaza</th>
                <th className="p-3 text-left">Project</th>
                <th className="p-3 hidden sm:table-cell">PIU</th>
                <th className="p-3 hidden sm:table-cell">Location</th>
                <th className="p-3 hidden sm:table-cell">Employees</th>
                <th className="p-3 text-center">View</th>
                <th className="p-3 text-center">Delete</th>
              </tr>
            </thead>

            <tbody>
              {currentPlazas.map((plaza) => (
                <tr
                  key={plaza._id}
                  className="border-b border-gray-200 hover:bg-gray-50 text-sm"
                >
                  <td className="p-3">{plaza.plazaName}</td>
                  <td className="p-3">
                    {plaza.projectId?.projectName || "-"}
                  </td>
                  <td className="p-3 hidden sm:table-cell">
                    {plaza.projectId?.piuName || "-"}
                  </td>
                  <td className="p-3 hidden sm:table-cell">
                    {plaza.projectId?.location || "-"}
                  </td>
                  <td className="p-3 hidden sm:table-cell">
                    {plaza.totalEmployees || 0}
                  </td>

                  <td className="p-3 text-center">
                    <button
                      onClick={() => setSelectedPlaza(plaza)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <FaEye size={16} />
                    </button>
                  </td>

                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleDelete(plaza._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {plazas.length > plazasPerPage && (
        <div className="flex justify-center items-center mt-5 gap-4">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded text-sm text-white ${
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
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded text-sm text-white ${
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
    {selectedPlaza && (
      <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 text-sm">

          <h3 className="text-lg font-bold text-center mb-4">
            Plaza Details
          </h3>

          <div className="space-y-3 text-gray-800">
            <p><b>Plaza:</b> {selectedPlaza.plazaName}</p>
            <p><b>Project:</b> {selectedPlaza.projectId?.projectName || "-"}</p>
            <p><b>PIU:</b> {selectedPlaza.projectId?.piuName || "-"}</p>
            <p><b>Location:</b> {selectedPlaza.projectId?.location || "-"}</p>
            <p><b>Total Employees:</b> {selectedPlaza.totalEmployees || 0}</p>

            <div>
              <b>Employees:</b>
              {selectedPlaza.employeeList?.length > 0 ? (
                <ul className="list-disc list-inside mt-2">
                  {selectedPlaza.employeeList.map((emp, idx) => (
                    <li key={idx}>
                      {emp.employeeId?.fullName || emp.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No employees yet.</p>
              )}
            </div>
          </div>

          <div className="mt-5 text-center">
            <button
              onClick={() => setSelectedPlaza(null)}
              className="px-5 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
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

export default AllPlaza;
