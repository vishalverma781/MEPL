import React, { useState, useEffect } from "react";
import { FaEye } from "react-icons/fa";

const AllAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [message, setMessage] = useState(null);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const adminsPerPage = 4;

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("${import.meta.env.VITE_API_URL}/api/admins", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 403) {
        setAdmins([]);
        setMessage({ type: "error", text: "🚫 You are not authorized to view admins!" });
        return;
      }

      const data = await res.json();

      if (Array.isArray(data)) {
        setAdmins(data);

        // ✅ Set currentAdmin in localStorage (assume token stores logged-in admin _id)
        const payload = JSON.parse(atob(token.split(".")[1])); // JWT decode
        const loggedInAdminId = payload._id; // change if different
        const currentAdmin = data.find(admin => admin._id === loggedInAdminId);
        if (currentAdmin) {
          localStorage.setItem(
            "currentAdmin",
            JSON.stringify({
              _id: currentAdmin._id,
              fullName: `${currentAdmin.firstName} ${currentAdmin.lastName}`,
              position: currentAdmin.position || "Admin",
            })
          );
        }
      } else {
        console.error("Admins data is not an array:", data);
        setAdmins([]);
        setMessage({ type: "error", text: "⚠ Unexpected data received from server" });
      }
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
  const currentAdmins = Array.isArray(admins)
    ? admins.slice(indexOfFirstAdmin, indexOfLastAdmin)
    : [];

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-start p-10">
      {message && (
        <div
          className={`fixed top-5 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl shadow-lg text-white font-semibold ${
            message.type === "error" ? "bg-red-500" : "bg-green-500"
          }`}
        >
          {message.text}
        </div>
      )}
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-7xl">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-900">All Admins</h2>

        {admins.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No admins added yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-gray-800 text-white text-xl">
                  <th className="p-5 text-left">First Name</th>
                  <th className="p-5 text-left">Last Name</th>
                  <th className="p-5 text-left">Username</th>
                  <th className="p-5 text-left">Email</th>
                  <th className="p-5 text-left">Position</th>
                  <th className="p-5 text-left">City</th>
                  <th className="p-5 text-left">State</th>
                  <th className="p-5 text-left">Home Address</th>
                  <th className="p-5 text-center">View Admin</th>
                </tr>
              </thead>
              <tbody>
                {currentAdmins.map((admin) => (
                  <tr
                    key={admin._id}
                    className="border-b border-gray-200 hover:bg-gray-100 transition text-lg"
                  >
                    <td className="p-5">{admin.firstName}</td>
                    <td className="p-5">{admin.lastName}</td>
                    <td className="p-5 font-semibold text-blue-600 cursor-pointer hover:underline">
                      {admin.username}
                    </td>
                    <td className="p-5">{admin.email}</td>
                    <td className="p-5">{admin.position || "N/A"}</td>
                    <td className="p-5">{admin.address?.city || "N/A"}</td>
                    <td className="p-5">{admin.address?.state || "N/A"}</td>
                    <td className="p-5">{admin.address?.homeAddress || "N/A"}</td>
                    <td className="p-5 text-center">
                      <button
                        onClick={() => setSelectedAdmin(admin)}
                        className="text-green-600 hover:text-green-800"
                        title="View"
                      >
                        <FaEye size={28} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

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
            <span className="text-gray-700 font-medium text-lg">
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
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white p-10 rounded-2xl shadow-2xl w-[90%] max-w-lg">
            <h3 className="text-3xl font-extrabold mb-8 text-center text-gray-900">
              Admin Details
            </h3>
            <div className="space-y-5 text-gray-800 text-xl font-medium">
              <p>
                <span className="font-bold">First Name:</span> {selectedAdmin.firstName}
              </p>
              <p>
                <span className="font-bold">Last Name:</span> {selectedAdmin.lastName}
              </p>
              <p>
                <span className="font-bold">Username:</span> {selectedAdmin.username}
              </p>
              <p>
                <span className="font-bold">Email:</span> {selectedAdmin.email}
              </p>
              <p>
                <span className="font-bold">Position:</span> {selectedAdmin.position || "N/A"}
              </p>
              <p>
                <span className="font-bold">City:</span> {selectedAdmin.address?.city || "N/A"}
              </p>
              <p>
                <span className="font-bold">State:</span> {selectedAdmin.address?.state || "N/A"}
              </p>
              <p>
                <span className="font-bold">Home Address:</span> {selectedAdmin.address?.homeAddress || "N/A"}
              </p>
            </div>
            <div className="mt-10 flex justify-center">
              <button
                onClick={() => setSelectedAdmin(null)}
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

export default AllAdmins;
