import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";

const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-GB"); // DD/MM/YYYY
};

const ManageProjects = () => {
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProject, setSelectedProject] = useState(null);
  const [editProject, setEditProject] = useState(null);
  const [formData, setFormData] = useState({
    projectName: "",
    piuName: "",
    clientName: "",
    location: "",
    startDate: "",
    assignedTo: "",
  });

  const projectsPerPage = 4;

  // Fetch projects from API
// ✅ Fetch projects from backend API
  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/projects`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching projects:", err);
      alert("❌ Failed to fetch projects");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const totalPages = Math.ceil(projects.length / projectsPerPage);
  const indexOfLast = currentPage * projectsPerPage;
  const indexOfFirst = indexOfLast - projectsPerPage;
  const currentProjects = projects.slice(indexOfFirst, indexOfLast);

  const handleNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const handlePrev = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  const handleDelete = async (_id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/projects/${_id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        alert("Project deleted successfully");
        fetchProjects();
      } else {
        alert(data.message || "Failed to delete project");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting project");
    }
  };

  const handleEdit = (project) => {
    setEditProject(project);
    setFormData({
      ...project,
      startDate: project.startDate?.split("T")[0] || "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/projects/${editProject._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Project updated successfully");
        fetchProjects();
        setEditProject(null);
      } else {
        alert(data.message || "Failed to update project");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating project");
    }
  };

   return (
    <div className="flex-1 min-h-screen overflow-x-auto overflow-y-auto transition-all duration-300 md:ml-20 ">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-7xl">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-900">
          Manage Projects
        </h2>

        {projects.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            No projects added yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-gray-800 text-white text-lg sm:text-xl">
                  <th className="p-5 text-left">Project Name</th>
                  <th className="p-5 text-left hidden sm:table-cell">PIU</th>
                  <th className="p-5 text-left hidden md:table-cell">Client</th>
                  <th className="p-5 text-left hidden lg:table-cell">Location</th>
                  <th className="p-5 text-left hidden xl:table-cell">Start Date</th>
                  <th className="p-5 text-left hidden md:table-cell">Assigned</th>
                  <th className="p-5 text-center">View</th>
                  <th className="p-5 text-center">Edit</th>
                  <th className="p-5 text-center">Delete</th>
                </tr>
              </thead>
              <tbody>
                {currentProjects.map((project) => (
                  <tr
                    key={project._id}
                    className="border-b border-gray-200 hover:bg-gray-100 transition text-base sm:text-lg"
                  >
                    <td className="py-6 px-4">{project.projectName}</td>
                    <td className="py-6 px-4 hidden sm:table-cell">{project.piuName}</td>
                    <td className="py-6 px-4 hidden md:table-cell">{project.clientName}</td>
                    <td className="py-6 px-4 hidden lg:table-cell">{project.location}</td>
                    <td className="py-6 px-4 hidden xl:table-cell">
                      {formatDate(project.startDate)}
                    </td>
                    <td className="py-6 px-4 hidden md:table-cell">{project.assignedTo}</td>
                    <td className="py-6 px-4 text-center">
                      <button
                        onClick={() => setSelectedProject(project)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <FaEye size={22} />
                      </button>
                    </td>
                    <td className="py-6 px-4 text-center">
                      <button
                        onClick={() => handleEdit(project)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaEdit size={22} />
                      </button>
                    </td>
                    <td className="py-6 px-4 text-center">
                      <button
                        onClick={() => handleDelete(project._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash size={22} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {projects.length > projectsPerPage && (
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

      {/* View Modal */}
      {selectedProject && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white p-10 rounded-2xl shadow-2xl w-[90%] max-w-lg">
            <h3 className="text-3xl font-extrabold mb-8 text-center text-gray-900">
              Project Details
            </h3>
            <div className="space-y-5 text-gray-800 text-lg font-medium">
              <p><span className="font-bold">Project Name:</span> {selectedProject.projectName}</p>
              <p><span className="font-bold">PIU:</span> {selectedProject.piuName}</p>
              <p><span className="font-bold">Client:</span> {selectedProject.clientName}</p>
              <p><span className="font-bold">Location:</span> {selectedProject.location}</p>
              <p><span className="font-bold">Start Date:</span> {formatDate(selectedProject.startDate)}</p>
              <p><span className="font-bold">Assigned To:</span> {selectedProject.assignedTo}</p>
            </div>
            <div className="mt-10 flex justify-center">
              <button
                onClick={() => setSelectedProject(null)}
                className="px-8 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-lg font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editProject && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white p-10 rounded-2xl shadow-2xl w-[90%] max-w-lg">
            <h3 className="text-3xl font-extrabold mb-8 text-center text-gray-900">
              Edit Project
            </h3>
            <div className="space-y-5 text-gray-800 text-lg font-medium">
              {["projectName", "piuName", "clientName", "location", "assignedTo"].map((field) => (
                <div key={field}>
                  <label className="block mb-2 font-semibold capitalize">
                    {field.replace(/([A-Z])/g, " $1")}
                  </label>
                  <input
                    type="text"
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
              ))}
              <div>
                <label className="block mb-2 font-semibold">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            <div className="mt-10 flex justify-center space-x-5">
              <button
                onClick={handleSave}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-lg font-semibold"
              >
                Save
              </button>
              <button
                onClick={() => setEditProject(null)}
                className="px-8 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-lg font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProjects;
