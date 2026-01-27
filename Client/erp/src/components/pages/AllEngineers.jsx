import React, { useState, useEffect } from "react";
import { FaEye } from "react-icons/fa";

const AllEngineers = () => {
  const [engineers, setEngineers] = useState([]);
  const [selectedEngineer, setSelectedEngineer] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const engineersPerPage = 4;

  useEffect(() => {
    const fetchData = async () => {
      try {
          // ✅ Proper URL interpolation (no quotes!)
        const empRes = await fetch(`${import.meta.env.VITE_API_URL}/allemployees`);
        const employees = await empRes.json();

        const roleRes = await fetch(`${import.meta.env.VITE_API_URL}/allroles`);
        const roles = await roleRes.json();


        const merged = employees.map(emp => {
          const role = roles.find(r => r.employeeId?._id === emp._id) || {};
          return {
            ...emp,
            assignRole: role.role || "Not Assigned",
            project: role.assignedProject?.projectName || "Not Assigned",
            plaza: role.assignedPlaza?.plazaName || "Not Assigned",
            office: role.office || "Not Assigned", // Office added
            assignedBy: role.assignBy?.username || "Not Assigned",
            fromDate: role.fromDate || null,
          };
        });

        setEngineers(merged);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const totalPages = Math.ceil(engineers.length / engineersPerPage);
  const indexOfLastEngineer = currentPage * engineersPerPage;
  const indexOfFirstEngineer = indexOfLastEngineer - engineersPerPage;
  const currentEngineers = engineers.slice(indexOfFirstEngineer, indexOfLastEngineer);

  const handleNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const handlePrev = () => currentPage > 1 && setCurrentPage(currentPage - 1);

return (
  <div className="w-full min-h-screen flex justify-center items-start p-10 sm:p-6">
    <div className="bg-white shadow-xl rounded-xl p-10 w-full max-w-6xl">

      <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 text-gray-900">
        👷 All Engineers
      </h2>

      {engineers.length === 0 ? (
        <p className="text-center text-gray-500 text-sm">
          No engineers found.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-800 text-white text-xs sm:text-sm">
                <th className="p-2 whitespace-nowrap">Full Name</th>
                <th className="p-2 hidden sm:table-cell">Username</th>
                <th className="p-2">Designation</th>
                <th className="p-2">Department</th>
                <th className="p-2 hidden sm:table-cell">Role</th>
                <th className="p-2 hidden sm:table-cell">Project</th>
                <th className="p-2 hidden sm:table-cell">Plaza</th>
                <th className="p-2 hidden sm:table-cell">Office</th>
                <th className="p-2 hidden sm:table-cell">Assigned By</th>
                <th className="p-2 hidden sm:table-cell">From</th>
                <th className="p-2 text-center">View</th>
              </tr>
            </thead>

            <tbody>
              {currentEngineers.map((eng) => (
                <tr
                  key={eng._id}
                  className="border-b border-gray-200 hover:bg-gray-50 text-xs sm:text-sm"
                >
                  <td className="p-2 whitespace-nowrap font-medium">{eng.fullName}</td>
                  <td className="p-2 hidden sm:table-cell">{eng.username}</td>
                  <td className="p-2">{eng.designation}</td>
                  <td className="p-2">{eng.department}</td>
                  <td className="p-2 hidden sm:table-cell">{eng.assignRole}</td>
                  <td className="p-2 hidden sm:table-cell">{eng.project}</td>
                  <td className="p-2 hidden sm:table-cell">{eng.plaza}</td>
                  <td className="p-2 hidden sm:table-cell">{eng.office}</td>
                  <td className="p-2 hidden sm:table-cell">{eng.assignedBy}</td>
                  <td className="p-2 hidden sm:table-cell">
                    {eng.fromDate ? new Date(eng.fromDate).toLocaleDateString() : "Not Assigned"}
                  </td>
                  <td className="p-2 text-center">
                    <button
                      onClick={() => setSelectedEngineer(eng)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <FaEye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}

      {/* Pagination */}
      {engineers.length > engineersPerPage && (
        <div className="flex justify-center items-center mt-4 gap-3">
          <button
            onClick={handlePrev}
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
            onClick={handleNext}
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

    {/* ===== Engineer Modal ===== */}
    {selectedEngineer && (
      <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-3">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-5 max-h-[90vh] overflow-y-auto">

          <div className="flex items-center mb-4">
            <div>
              <h3 className="text-lg font-bold">{selectedEngineer.fullName}</h3>
              <p className="text-gray-600 text-xs">
                {selectedEngineer.designation || "N/A"} - {selectedEngineer.department || "N/A"}
              </p>
            </div>
            <button
              onClick={() => setSelectedEngineer(null)}
              className="ml-auto px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <Section title="👤 Basic Details">
              <GridRow label="Username" value={selectedEngineer.username} />
              <GridRow label="Designation" value={selectedEngineer.designation} />
              <GridRow label="Department" value={selectedEngineer.department} />
            </Section>

            <Section title="🛠 Role Details">
              <GridRow label="Assign Role" value={selectedEngineer.assignRole} />
              <GridRow label="Project" value={selectedEngineer.project} />
              <GridRow label="Plaza" value={selectedEngineer.plaza} />
              <GridRow label="Office" value={selectedEngineer.office} />
              <GridRow label="Assigned By" value={selectedEngineer.assignedBy} />
              <GridRow
                label="From Date"
                value={
                  selectedEngineer.fromDate
                    ? new Date(selectedEngineer.fromDate).toLocaleDateString()
                    : "Not Assigned"
                }
              />
            </Section>
          </div>

        </div>
      </div>
    )}
  </div>
);

};

// Section wrapper
const Section = ({ title, children }) => (
  <div>
    <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-1 border-b border-gray-300 pb-1">
      {title}
    </h4>
    <div className="grid grid-cols-1 gap-1">
      {children}
    </div>
  </div>
);

// Label + Value row
const GridRow = ({ label, value }) => (
  <div className="flex justify-between items-center py-0.5 border-b border-gray-100">
    <span className="text-gray-600 font-medium text-xs sm:text-sm">
      {label}:
    </span>
    <span className="text-gray-900 font-semibold text-xs sm:text-sm">
      {value || "Not Assigned"}
    </span>
  </div>
);
export default AllEngineers;
