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

  const projectsPerPage = 3;

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
  <div className="flex-1 min-h-screen overflow-y-auto transition-all duration-300 md:ml-40 px-6 py-8">
    <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-7xl mx-auto">

      <h2 className="text-2xl font-bold text-center mb-5 text-gray-900">
        Manage Projects
      </h2>

      {projects.length === 0 ? (
        <p className="text-center text-gray-500 text-sm">
          No projects added yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-800 text-white text-sm">
                <th className="p-3 text-left whitespace-nowrap">Project</th>
                <th className="p-3 hidden sm:table-cell">PIU</th>
                <th className="p-3 hidden md:table-cell">Client</th>
                <th className="p-3 hidden lg:table-cell">Location</th>
                <th className="p-3 hidden xl:table-cell">Start</th>
                <th className="p-3 hidden md:table-cell">Assigned</th>
                <th className="p-3 text-center">View</th>
                <th className="p-3 text-center">Edit</th>
                <th className="p-3 text-center">Del</th>
              </tr>
            </thead>

            <tbody>
              {currentProjects.map((project) => (
                <tr
                  key={project._id}
                  className="border-b border-gray-100 hover:bg-gray-50 text-sm"
                >
                  <td className="py-3 px-3 whitespace-nowrap">{project.projectName}</td>
                  <td className="py-3 px-3 hidden sm:table-cell">{project.piuName}</td>
                  <td className="py-3 px-3 hidden md:table-cell">{project.clientName}</td>
                  <td className="py-3 px-3 hidden lg:table-cell">{project.location}</td>
                  <td className="py-3 px-3 hidden xl:table-cell">
                    {formatDate(project.startDate)}
                  </td>
                  <td className="py-3 px-3 hidden md:table-cell">{project.assignedTo}</td>

                  <td className="py-3 px-3 text-center">
                    <button onClick={() => setSelectedProject(project)} className="text-green-600 hover:text-green-800">
                      <FaEye size={18} />
                    </button>
                  </td>

                  <td className="py-3 px-3 text-center">
                    <button onClick={() => handleEdit(project)} className="text-blue-600 hover:text-blue-800">
                      <FaEdit size={18} />
                    </button>
                  </td>

                  <td className="py-3 px-3 text-center">
                    <button onClick={() => handleDelete(project._id)} className="text-red-600 hover:text-red-800">
                      <FaTrash size={18} />
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {projects.length > projectsPerPage && (
        <div className="flex justify-center items-center mt-5 gap-3 text-sm">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`px-4 py-1.5 rounded-md text-white ${
              currentPage === 1 ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Previous
          </button>

          <span className="text-gray-600">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`px-4 py-1.5 rounded-md text-white ${
              currentPage === totalPages ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>

    {/* View Modal */}
    {selectedProject && (
      <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
        <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-md">
          <h3 className="text-xl font-bold mb-4 text-center">Project Details</h3>

          <div className="space-y-2 text-sm text-gray-700">
            <p><b>Project:</b> {selectedProject.projectName}</p>
            <p><b>PIU:</b> {selectedProject.piuName}</p>
            <p><b>Client:</b> {selectedProject.clientName}</p>
            <p><b>Location:</b> {selectedProject.location}</p>
            <p><b>Start Date:</b> {formatDate(selectedProject.startDate)}</p>
            <p><b>Assigned:</b> {selectedProject.assignedTo}</p>
          </div>

          <div className="mt-5 text-center">
            <button
              onClick={() => setSelectedProject(null)}
              className="px-5 py-2 bg-red-500 text-white rounded-md text-sm font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Edit Modal (same logic only compact styling) */}
    {editProject && (
      <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
        <div className="bg-white p-5 rounded-xl shadow-xl w-[85%] max-w-md">
          <h3 className="text-lg font-bold mb-4 text-center">Edit Project</h3>

          <div className="space-y-3 text-sm">
            {["projectName", "piuName", "clientName", "location", "assignedTo"].map((field) => (
              <div key={field}>
                <label className="block mb-1 font-semibold text-xs capitalize">
                  {field.replace(/([A-Z])/g, " $1")}
                </label>
                <input
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full px-2 py-1 border rounded text-sm"
                />
              </div>
            ))}

            <div>
              <label className="block mb-1 font-semibold text-xs">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-2 py-1 border rounded text-sm"
              />
            </div>
          </div>

          <div className="mt-5 flex justify-center gap-3">
            <button
              onClick={handleSave}
              className="px-4 py-1.5 bg-blue-600 text-white rounded text-sm font-semibold"
            >
              Save
            </button>
            <button
              onClick={() => setEditProject(null)}
              className="px-4 py-1.5 bg-red-500 text-white rounded text-sm font-semibold"
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
