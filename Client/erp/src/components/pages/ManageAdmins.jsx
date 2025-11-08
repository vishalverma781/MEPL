import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";

const ManageAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [editAdmin, setEditAdmin] = useState(null);
  const [message, setMessage] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    position: "",
    address: { city: "", state: "", homeAddress: "" },
  });

  const adminsPerPage = 4;

  const fetchAdmins = async () => {
   try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admins`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 403) {
        setAdmins([]);
        setMessage({ type: "error", text: "🚫 You are not authorized to view admins!" });
        return;
      }
      const data = await res.json();
      setAdmins(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setAdmins([]);
      setMessage({ type: "error", text: "❌ Failed to fetch admins" });
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const totalPages = Math.ceil(admins.length / adminsPerPage);
  const indexOfLastAdmin = currentPage * adminsPerPage;
  const indexOfFirstAdmin = indexOfLastAdmin - adminsPerPage;
  const currentAdmins = Array.isArray(admins) ? admins.slice(indexOfFirstAdmin, indexOfLastAdmin) : [];

  const handleNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const handlePrev = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  const handleDelete = async (_id) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admins/${_id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) fetchAdmins();
      else alert(data.message || "Failed to delete admin");
    } catch (err) {
      console.error(err);
      alert("Error deleting admin");
    }
  };

  const handleEdit = (admin) => {
    setEditAdmin(admin);
    setFormData({
      firstName: admin.firstName || "",
      lastName: admin.lastName || "",
      username: admin.username || "",
      email: admin.email || "",
      position: admin.position || "",
      address: {
        city: admin.address?.city || "",
        state: admin.address?.state || "",
        homeAddress: admin.address?.homeAddress || "",
      },
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["city", "state", "homeAddress"].includes(name)) {
      setFormData({ ...formData, address: { ...formData.address, [name]: value } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admins/${editAdmin._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        fetchAdmins();
        setEditAdmin(null);
      } else alert(data.message || "Failed to update admin");
    } catch (err) {
      console.error(err);
      alert("Error updating admin");
    }
  };

return (
  <div className="flex-1 min-h-screen transition-all duration-300 md:ml-64 bg-gray-50 p-4 sm:p-6 lg:p-10">
    {message && (
      <div
        className={`fixed top-5 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl shadow-lg text-white font-semibold ${
          message.type === "error" ? "bg-red-500" : "bg-green-500"
        }`}
      >
        {message.text}
      </div>
    )}

    <div className="bg-white shadow-2xl rounded-2xl p-6 sm:p-8 lg:p-10 w-full">
      <h2 className="text-3xl lg:text-4xl font-bold text-center mb-8 text-gray-900">
        Manage Admins
      </h2>

      {admins.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          No admins added yet.
        </p>
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="w-full border border-gray-300 rounded-xl text-base lg:text-lg">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="p-4 text-left">First Name</th>
                <th className="p-4 text-left hidden sm:table-cell">Username</th>
                <th className="p-4 text-left hidden md:table-cell">Email</th>
                <th className="p-4 text-left hidden lg:table-cell">City</th>
                <th className="p-4 text-left hidden lg:table-cell">State</th>
                <th className="p-4 text-left hidden xl:table-cell">Position</th>
                <th className="p-4 text-left hidden xl:table-cell">
                  Home Address
                </th>
                <th className="p-4 text-center">View</th>
                <th className="p-4 text-center">Edit</th>
                <th className="p-4 text-center">Delete</th>
              </tr>
            </thead>
            <tbody>
              {currentAdmins.map((admin) => (
                <tr
                  key={admin._id}
                  className="border-b border-gray-200 hover:bg-gray-100 transition"
                >
                  <td className="py-4 px-3 font-semibold text-gray-800">
                    {admin.firstName}
                  </td>
                  <td className="py-4 px-3 hidden sm:table-cell text-blue-600 font-semibold cursor-pointer hover:underline">
                    {admin.username}
                  </td>
                  <td className="py-4 px-3 hidden md:table-cell">
                    {admin.email}
                  </td>
                  <td className="py-4 px-3 hidden lg:table-cell">
                    {admin.address?.city || "N/A"}
                  </td>
                  <td className="py-4 px-3 hidden lg:table-cell">
                    {admin.address?.state || "N/A"}
                  </td>
                  <td className="py-4 px-3 hidden xl:table-cell">
                    {admin.position || "N/A"}
                  </td>
                  <td className="py-4 px-3 hidden xl:table-cell">
                    {admin.address?.homeAddress || "N/A"}
                  </td>
                  <td className="py-4 px-3 text-center">
                    <button
                      onClick={() => setSelectedAdmin(admin)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <FaEye size={20} />
                    </button>
                  </td>
                  <td className="py-4 px-3 text-center">
                    <button
                      onClick={() => handleEdit(admin)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaEdit size={20} />
                    </button>
                  </td>
                  <td className="py-4 px-3 text-center">
                    <button
                      onClick={() => handleDelete(admin._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {admins.length > adminsPerPage && (
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
    {selectedAdmin && (
      <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 p-4">
        <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-2xl w-full max-w-2xl">
          <h3 className="text-2xl sm:text-3xl font-extrabold mb-8 text-center text-gray-900">
            Admin Details
          </h3>
          <div className="space-y-4 text-gray-800 text-lg font-medium">
            <p><span className="font-bold">First Name:</span> {selectedAdmin.firstName}</p>
            <p><span className="font-bold">Username:</span> {selectedAdmin.username}</p>
            <p><span className="font-bold">Email:</span> {selectedAdmin.email}</p>
            <p><span className="font-bold">City:</span> {selectedAdmin.address?.city || "N/A"}</p>
            <p><span className="font-bold">State:</span> {selectedAdmin.address?.state || "N/A"}</p>
            <p><span className="font-bold">Home Address:</span> {selectedAdmin.address?.homeAddress || "N/A"}</p>
            <p><span className="font-bold">Position:</span> {selectedAdmin.position || "N/A"}</p>
          </div>
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setSelectedAdmin(null)}
              className="px-10 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-lg font-semibold"
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

export default ManageAdmins;
