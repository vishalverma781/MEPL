import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]); // ✅ All employees
  const [showForm, setShowForm] = useState(false);
  const [editDept, setEditDept] = useState(null);
  const [formData, setFormData] = useState({ name: "" });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const departmentsPerPage = 5;

  // Fetch departments & employees
  useEffect(() => {
    fetchDepartments();
    fetchEmployees();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/departments`);
      setDepartments(res.data);
    } catch (err) {
      console.error("Error fetching departments:", err);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/employees`);
      setEmployees(res.data);
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };

  // Delete department
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this department?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/departments/${id}`);
      setDepartments(departments.filter((d) => d._id !== id));
    } catch (err) {
      console.error("Error deleting department:", err);
    }
  };

  // Open form (Add / Edit)
  const handleOpenForm = (dept = null) => {
    if (dept) {
      setFormData({ name: dept.name });
      setEditDept(dept);
    } else {
      setFormData({ name: "" });
      setEditDept(null);
    }
    setShowForm(true);
  };

  // Submit form (Add / Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editDept) {
        const res = await axios.put(
          `${import.meta.env.VITE_API_URL}/departments/${editDept._id}`,
          formData
        );
        setDepartments(
          departments.map((d) => (d._id === editDept._id ? res.data : d))
        );
      } else {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/departments`,
          formData
        );
        setDepartments([...departments, res.data]);
      }

      setShowForm(false);
      setFormData({ name: "" });
      setEditDept(null);
    } catch (err) {
      console.error("Error saving department:", err);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(departments.length / departmentsPerPage);
  const indexOfLastDept = currentPage * departmentsPerPage;
  const indexOfFirstDept = indexOfLastDept - departmentsPerPage;
  const currentDepartments = departments.slice(indexOfFirstDept, indexOfLastDept);

  const handleNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const handlePrev = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  // ✅ Function to get employee count for a department
  const getEmployeeCount = (deptName) => {
    return employees.filter((emp) => emp.department === deptName).length;
  };

   return (
    <div className="md:ml-64 px-4 md:px-6 pt-6 md:pt-17 min-h-screen p-4 md:p-10">
      <div className="bg-white shadow-2xl rounded-2xl p-6 md:p-8 w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900">
            Departments
          </h1>
          <button
            onClick={() => handleOpenForm()}
            className="bg-blue-700 hover:bg-blue-800 text-white px-5 md:px-6 py-2 md:py-3 rounded-lg font-semibold shadow text-lg md:text-xl w-full sm:w-auto"
          >
            + Add Department
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-300">
          <table className="w-full border-collapse text-base md:text-xl">
            <thead>
              <tr className="bg-gray-800 text-white text-lg md:text-2xl">
                <th className="px-4 md:px-8 py-4 md:py-6 text-left">Department</th>
                <th className="px-4 md:px-8 py-4 md:py-6 text-left hidden sm:table-cell">
                  Employees
                </th>
                <th className="px-4 md:px-8 py-4 md:py-6 text-center">Edit</th>
                <th className="px-4 md:px-8 py-4 md:py-6 text-center">Delete</th>
              </tr>
            </thead>
            <tbody>
              {currentDepartments.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center text-gray-600 py-12 text-2xl font-semibold"
                  >
                    🚫 No departments added yet
                  </td>
                </tr>
              ) : (
                currentDepartments.map((dept, i) => (
                  <tr
                    key={dept._id}
                    className={`${
                      i % 2 === 0 ? "bg-white" : "bg-gray-100"
                    } hover:bg-gray-200 transition`}
                  >
                    <td className="px-4 md:px-8 py-4 md:py-6 font-bold text-gray-800 text-lg md:text-2xl">
                      {dept.name}
                    </td>
                    <td className="px-4 md:px-8 py-4 md:py-6 text-gray-700 text-lg md:text-2xl hidden sm:table-cell">
                      {getEmployeeCount(dept.name)}
                    </td>
                    <td className="px-4 md:px-8 py-4 md:py-6 text-center">
                      <button
                        onClick={() => handleOpenForm(dept)}
                        className="text-blue-700 hover:text-blue-900 text-2xl md:text-3xl"
                      >
                        <FaEdit />
                      </button>
                    </td>
                    <td className="px-4 md:px-8 py-4 md:py-6 text-center">
                      <button
                        onClick={() => handleDelete(dept._id)}
                        className="text-red-600 hover:text-red-800 text-2xl md:text-3xl"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {departments.length > departmentsPerPage && (
          <div className="flex flex-col sm:flex-row justify-center items-center mt-6 gap-3 sm:space-x-4">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className={`px-4 md:px-5 py-2 md:py-2 rounded-lg text-white font-medium text-lg ${
                currentPage === 1
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              Previous
            </button>
            <span className="text-gray-700 font-medium text-lg">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={`px-4 md:px-5 py-2 md:py-2 rounded-lg text-white font-medium text-lg ${
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

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 w-full max-w-sm md:max-w-md">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 text-center">
              {editDept ? "Edit Department" : "Add Department"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-lg">
                  Department Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-blue-500 text-lg md:text-xl"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 md:gap-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-5 py-2 md:py-3 rounded-md bg-gray-300 text-gray-700 font-semibold hover:bg-gray-400 text-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 md:py-3 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 text-lg"
                >
                  {editDept ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Departments;
