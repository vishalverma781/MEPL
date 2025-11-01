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
      const plazaRes = await fetch(`${import.meta.env.VITE_API_URL}/api/plazas`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const plazasData = await plazaRes.json();


    // ✅ Fetch all roles (to get employee assignments)
      const roleRes = await fetch(`${import.meta.env.VITE_API_URL}/api/roles`, {
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
      await fetch(`${import.meta.env.VITE_API_URL}/api/plazas/${id}`, {
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
    <div className="w-full min-h-screen flex justify-center items-start p-10">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-7xl">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-900">
          All Plazas
        </h2>

        {plazas.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            No plazas added yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-gray-800 text-white text-xl">
                  <th className="p-5 text-left">Plaza Name</th>
                  <th className="p-5 text-left">Project Name</th>
                  <th className="p-5 text-left">PIU Name</th>
                  <th className="p-5 text-left">Location</th>
                  <th className="p-5 text-left">Total Employees</th>
                  <th className="p-5 text-center">View</th>
                  <th className="p-5 text-center">Delete</th>
                </tr>
              </thead>
              <tbody>
                {currentPlazas.map((plaza) => (
                  <tr
                    key={plaza._id}
                    className="border-b border-gray-200 hover:bg-gray-100 transition text-lg"
                  >
                    <td className="py-6 px-4">{plaza.plazaName}</td>
                    <td className="py-6 px-4">
                      {plaza.projectId?.projectName || "-"}
                    </td>
                    <td className="py-6 px-4">
                      {plaza.projectId?.piuName || "-"}
                    </td>
                    <td className="py-6 px-4">
                      {plaza.projectId?.location || "-"}
                    </td>
                    <td className="py-6 px-4">{plaza.totalEmployees || 0}</td>
                    <td className="py-6 px-4 text-center">
                      <button
                        onClick={() => setSelectedPlaza(plaza)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <FaEye size={24} />
                      </button>
                    </td>
                    <td className="py-6 px-4 text-center">
                      <button
                        onClick={() => handleDelete(plaza._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash size={24} />
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
          <div className="flex justify-center items-center mt-6 space-x-4">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className={`px-5 py-2 rounded-lg text-white font-medium ${
                currentPage === 1 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
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
                currentPage === totalPages ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* View Modal */}
      {selectedPlaza && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white p-10 rounded-2xl shadow-2xl w-[90%] max-w-lg">
            <h3 className="text-3xl font-extrabold mb-8 text-center text-gray-900">
              Plaza Details
            </h3>
            <div className="space-y-5 text-gray-800 text-xl font-medium">
              <p>
                <span className="font-bold">Plaza Name:</span> {selectedPlaza.plazaName}
              </p>
              <p>
                <span className="font-bold">Project Name:</span> {selectedPlaza.projectId?.projectName || "-"}
              </p>
              <p>
                <span className="font-bold">PIU Name:</span> {selectedPlaza.projectId?.piuName || "-"}
              </p>
              <p>
                <span className="font-bold">Location:</span> {selectedPlaza.projectId?.location || "-"}
              </p>
              <p>
                <span className="font-bold">Total Employees:</span> {selectedPlaza.totalEmployees || 0}
              </p>

              <div>
                <span className="font-bold">Employees:</span>
                {selectedPlaza.employeeList && selectedPlaza.employeeList.length > 0 ? (
                  <ul className="list-disc list-inside mt-3 text-lg">
                    {selectedPlaza.employeeList.map((emp, idx) => (
                      <li key={idx}>{emp.employeeId?.fullName || emp.name}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No employees yet.</p>
                )}
              </div>
            </div>
            <div className="mt-10 flex justify-center">
              <button
                onClick={() => setSelectedPlaza(null)}
                className="px-8 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-xl font-semibold"
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
