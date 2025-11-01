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
    <div className="w-full min-h-screen flex justify-center items-start p-10 ">
      <div className="bg-white shadow-2xl rounded-2xl p-6 w-full max-w-8xl">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-900">👷 All Engineers</h2>

        {engineers.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No engineers found.</p>
        ) : (
          <table className="w-full border border-gray-300 rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-gray-800 text-white text-xl">
                <th className="p-4">Full Name</th>
                <th className="p-4">Username</th>
                <th className="p-4">Designation</th>
                <th className="p-4">Department</th>
                <th className="p-4">Role</th>
                <th className="p-4">Project</th>
                <th className="p-4">Plaza</th>
                <th className="p-4">Office</th> {/* Office column */}
                <th className="p-4">Assigned By</th>
                <th className="p-4">From Date</th>
                <th className="p-4 text-center">View</th>
              </tr>
            </thead>
            <tbody>
              {currentEngineers.map((eng) => (
                <tr
                  key={eng._id}
                  className="border-b border-gray-200 hover:bg-gray-100 transition cursor-pointer"
                >
                  <td className="p-4 font-medium">{eng.fullName}</td>
                  <td className="p-4">{eng.username}</td>
                  <td className="p-4">{eng.designation}</td>
                  <td className="p-4">{eng.department}</td>
                  <td className="p-4">{eng.assignRole}</td>
                  <td className="p-4">{eng.project}</td>
                  <td className="p-4">{eng.plaza}</td>
                  <td className="p-4">{eng.office}</td> {/* Office data */}
                  <td className="p-4">{eng.assignedBy}</td>
                  <td className="p-4">{eng.fromDate ? new Date(eng.fromDate).toLocaleDateString() : "Not Assigned"}</td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => setSelectedEngineer(eng)}
                      className="text-green-600 hover:text-green-800"
                      title="View"
                    >
                      <FaEye size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {engineers.length > engineersPerPage && (
          <div className="flex justify-center items-center mt-6 space-x-4">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg text-white font-medium ${
                currentPage === 1 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              Previous
            </button>
            <span className="text-gray-700 font-medium text-lg">Page {currentPage} of {totalPages}</span>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg text-white font-medium ${
                currentPage === totalPages ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Engineer Modal */}
      {selectedEngineer && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center mb-6">
              <div>
                <h3 className="text-2xl font-bold">{selectedEngineer.fullName}</h3>
                <p className="text-gray-600">
                  {selectedEngineer.designation || "N/A"} - {selectedEngineer.department || "N/A"}
                </p>
              </div>

              <button
                onClick={() => setSelectedEngineer(null)}
                className="ml-auto px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <Section title="👤 Basic Details">
                <GridRow label="Username" value={selectedEngineer.username} />
                <GridRow label="Designation" value={selectedEngineer.designation} />
                <GridRow label="Department" value={selectedEngineer.department} />
              </Section>

              <Section title="🛠 Role Details">
                <GridRow label="Assign Role" value={selectedEngineer.assignRole} />
                <GridRow label="Project" value={selectedEngineer.project} />
                <GridRow label="Plaza" value={selectedEngineer.plaza} />
                <GridRow label="Office" value={selectedEngineer.office} /> {/* Only Office */}
                <GridRow label="Assigned By" value={selectedEngineer.assignedBy} />
                <GridRow
                  label="From Date"
                  value={selectedEngineer.fromDate ? new Date(selectedEngineer.fromDate).toLocaleDateString() : "Not Assigned"}
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
    <h4 className="text-lg font-semibold text-gray-700 mb-2 border-b border-gray-300 pb-1">{title}</h4>
    <div className="grid grid-cols-1 gap-2">{children}</div>
  </div>
);

// Label + Value row
const GridRow = ({ label, value }) => (
  <div className="flex justify-between items-center py-1 border-b border-gray-100">
    <span className="text-gray-600 font-medium">{label}:</span>
    <span className="text-gray-900 font-bold">{value || "Not Assigned"}</span>
  </div>
);

export default AllEngineers;
