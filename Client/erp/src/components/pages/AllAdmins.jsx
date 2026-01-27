import React, { useState, useEffect } from "react";
import { FaEye } from "react-icons/fa";

const AllAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [message, setMessage] = useState(null);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const adminsPerPage = 3;

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
  <div className="flex-1 min-h-screen overflow-x-auto p-10 overflow-y-auto transition-all duration-300">

    {/* Top Message */}
    {message && (
      <div
        className={`fixed top-5 left-1/2 -translate-x-1/2 px-5 py-2 rounded-lg shadow-lg text-white text-sm font-semibold ${
          message.type === "error" ? "bg-red-500" : "bg-green-500"
        }`}
      >
        {message.text}
      </div>
    )}

    {/* Main Container */}
    <div className="bg-white shadow-xl rounded-xl p-10 w-full max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-5 text-gray-900">
        All Admins
      </h2>

      {admins.length === 0 ? (
        <p className="bg-gray-800 text-white text-lg sm:text-xl">
          No admins added yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-800 text-white text-sm">
                <th className="p-3 whitespace-nowrap text-left">First Name</th>
                <th className="p-3 whitespace-nowrap text-left">Last Name</th>
                <th className="p-3 text-left hidden sm:table-cell">Username</th>
                <th className="p-3 text-left hidden md:table-cell">Email</th>
                <th className="p-3 text-left hidden lg:table-cell">Position</th>
                <th className="p-3 text-left hidden xl:table-cell">City</th>
                <th className="p-3 text-left hidden xl:table-cell">State</th>
                <th className="p-3 text-left hidden xl:table-cell">Home Address</th>
                <th className="p-3 text-center">View</th>
              </tr>
            </thead>

            <tbody>
              {currentAdmins.map((admin) => (
                <tr
                  key={admin._id}
                  className="border-b border-gray-200 hover:bg-gray-100 transition text-sm"
                >
                  <td className="py-3 whitespace-nowrap px-3">{admin.firstName}</td>
                  <td className="py-3 whitespace-nowrap px-3">{admin.lastName}</td>
                  <td className="py-3 px-3 hidden sm:table-cell text-blue-600 font-semibold">
                    {admin.username}
                  </td>
                  <td className="py-3 px-3 hidden md:table-cell">{admin.email}</td>
                  <td className="py-3 px-3 hidden lg:table-cell">{admin.position || "N/A"}</td>
                  <td className="py-3 px-3 hidden xl:table-cell">{admin.address?.city || "N/A"}</td>
                  <td className="py-3 px-3 hidden xl:table-cell">{admin.address?.state || "N/A"}</td>
                  <td className="py-3 px-3 hidden xl:table-cell">{admin.address?.homeAddress || "N/A"}</td>

                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={() => setSelectedAdmin(admin)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <FaEye size={18} />
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
        <div className="flex justify-center items-center mt-5 space-x-3">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`px-4 py-1 rounded text-white text-sm font-medium ${
              currentPage === 1
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Previous
          </button>

          <span className="text-gray-700 text-sm font-medium">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`px-4 py-1 rounded text-white text-sm font-medium ${
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
      <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
        <div className="bg-white p-6 rounded-xl shadow-xl w-[85%] max-w-md">

          <h3 className="text-xl font-bold mb-5 text-center text-gray-900">
            Admin Details
          </h3>

          <div className="space-y-3 text-gray-700 text-sm font-medium">
            <p><span className="font-semibold">First Name:</span> {selectedAdmin.firstName}</p>
            <p><span className="font-semibold">Last Name:</span> {selectedAdmin.lastName}</p>
            <p><span className="font-semibold">Username:</span> {selectedAdmin.username}</p>
            <p><span className="font-semibold">Email:</span> {selectedAdmin.email}</p>
            <p><span className="font-semibold">Position:</span> {selectedAdmin.position || "N/A"}</p>
            <p><span className="font-semibold">City:</span> {selectedAdmin.address?.city || "N/A"}</p>
            <p><span className="font-semibold">State:</span> {selectedAdmin.address?.state || "N/A"}</p>
            <p><span className="font-semibold">Home Address:</span> {selectedAdmin.address?.homeAddress || "N/A"}</p>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setSelectedAdmin(null)}
              className="px-5 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm font-semibold"
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
