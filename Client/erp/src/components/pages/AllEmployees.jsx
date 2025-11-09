import React, { useState, useEffect } from "react";
import { FaEye } from "react-icons/fa";

// ✅ Utility function for profile image (robust)
const getImageSrc = (pic) => {
  if (!pic) return null;

  try {
    if (pic instanceof File || pic instanceof Blob) {
      return URL.createObjectURL(pic);
    }

    if (typeof pic === "string") {
      if (pic.startsWith("http")) return pic;

      const baseURL = import.meta.env.VITE_API_URL?.replace(/\/api$/, "");

      // ✅ agar DB me 'uploads/filename.jpg' stored hai
      if (pic.startsWith("uploads/")) {
        return `${baseURL}/${pic.replace(/\\/g, "/")}`;
      }

      // ✅ agar sirf filename stored hai (uploads missing)
      return `${baseURL}/uploads/${pic.replace(/\\/g, "/")}`;
    }

    return null;
  } catch (error) {
    console.error("Invalid profilePic:", error);
    return null;
  }
};

const AllEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 4;

  // ✅ Fetch employees from backend
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/employees`);
        if (!res.ok) throw new Error("Failed to fetch employees");
        const data = await res.json();
        setEmployees(data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchEmployees();
  }, []);

  const totalPages = Math.ceil(employees.length / employeesPerPage);
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = employees.slice(indexOfFirstEmployee, indexOfLastEmployee);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Update employee photo
  const handlePhotoChange = async (file, empId) => {
    try {
      const formData = new FormData();
      formData.append("profilePic", file);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/employees/${empId}/photo`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to upload photo");

      const updatedEmployee = await res.json();

      setEmployees((prev) =>
        prev.map((emp) => (emp._id === updatedEmployee._id ? updatedEmployee : emp))
      );
      setSelectedEmployee(updatedEmployee);
    } catch (error) {
      console.error(error);
      alert("❌ Failed to update photo");
    }
  };

return (
  <div className="w-full min-h-screen flex justify-center items-start p-4 sm:p-10">
    <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-7xl">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-gray-900">
        👥 All Employees
      </h2>

      {employees.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No employees found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-gray-800 text-white text-base sm:text-xl">
                <th className="p-3 sm:p-5 text-left">Profile</th>
                <th className="p-3 sm:p-5 text-left">Full Name</th>
                <th className="p-3 sm:p-5 text-left hidden sm:table-cell">Email</th>
                <th className="p-3 sm:p-5 text-left hidden sm:table-cell">Phone</th> {/* Hidden on mobile */}
                <th className="p-3 sm:p-5 text-left">Department</th>
                <th className="p-3 sm:p-5 text-left hidden sm:table-cell">Designation</th> {/* Hidden on mobile */}
                <th className="p-3 sm:p-5 text-center">View</th>
              </tr>
            </thead>
            <tbody>
              {currentEmployees.map((emp) => (
                <tr
                  key={emp._id}
                  className="border-b border-gray-200 hover:bg-gray-100 transition text-sm sm:text-lg"
                >
                  <td className="p-3 sm:p-5">
                    {emp.profilePic ? (
                      <img
                        src={getImageSrc(emp.profilePic)}
                        alt={emp.fullName}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border"
                      />
                    ) : (
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border flex items-center justify-center text-gray-500 text-xs">
                        No Img
                      </div>
                    )}
                  </td>
                  <td className="p-3 sm:p-5">{emp.fullName}</td>
                  <td className="p-3 sm:p-5 hidden sm:table-cell">{emp.email}</td>
                  <td className="p-3 sm:p-5 hidden sm:table-cell">{emp.phone}</td> {/* Hidden on mobile */}
                  <td className="p-3 sm:p-5">{emp.department}</td>
                  <td className="p-3 sm:p-5 hidden sm:table-cell">{emp.designation}</td> {/* Hidden on mobile */}
                  <td className="p-3 sm:p-5 text-center">
                    <button
                      onClick={() => setSelectedEmployee(emp)}
                      className="text-green-600 hover:text-green-800"
                      title="View"
                    >
                      <FaEye size={20} className="sm:w-6 sm:h-6" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {employees.length > employeesPerPage && (
        <div className="flex flex-wrap justify-center items-center mt-6 gap-3 sm:space-x-4">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`px-4 sm:px-5 py-2 rounded-lg text-white font-medium ${
              currentPage === 1
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Previous
          </button>
          <span className="text-gray-700 font-medium text-base sm:text-lg">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`px-4 sm:px-5 py-2 rounded-lg text-white font-medium ${
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

    {/* Employee Modal */}
    {selectedEmployee && (
      <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
        <div className="bg-white rounded-2xl shadow-2xl w-[95%] sm:w-[90%] max-w-4xl p-4 sm:p-6 overflow-y-auto max-h-[90vh]">
          <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-4 mb-6">
            <div className="flex flex-col items-center">
              {selectedEmployee.profilePic ? (
                <img
                  src={getImageSrc(selectedEmployee.profilePic)}
                  alt={selectedEmployee.fullName}
                  className="w-24 h-24 rounded-full border-2 border-gray-300 object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}

              <label className="mt-3 cursor-pointer bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 text-sm">
                Change Photo
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) handlePhotoChange(file, selectedEmployee._id);
                  }}
                />
              </label>
            </div>

            <div className="mt-4 md:mt-0 text-center md:text-left w-full">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold">{selectedEmployee.fullName}</h3>
                  <p className="text-gray-600 text-sm sm:text-base">
                    {selectedEmployee.designation || "N/A"} - {selectedEmployee.department || "N/A"}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedEmployee(null)}
                  className="px-3 py-1 sm:px-4 sm:py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold text-sm sm:text-base"
                >
                  Close
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-sm sm:text-base">
            <Section title="👤 Personal Details">
              <GridRow label="Email" value={selectedEmployee.email} />
              <GridRow label="Phone" value={selectedEmployee.phone} />
              <GridRow label="Gender" value={selectedEmployee.gender} />
              <GridRow label="DOB" value={selectedEmployee.dob} />
              <GridRow label="City" value={selectedEmployee.city} />
              <GridRow label="State" value={selectedEmployee.state} />
              <GridRow label="Street" value={selectedEmployee.street} />
            </Section>

            <Section title="🎓 Education Details">
              <GridRow label="Qualification" value={selectedEmployee.qualification} />
              <GridRow label="University" value={selectedEmployee.university} />
              <GridRow label="Passing Year" value={selectedEmployee.passingYear} />
            </Section>

            <Section title="💼 Employment Details">
              <GridRow label="Employee ID" value={selectedEmployee.employeeId} />
              <GridRow label="Username" value={selectedEmployee.username} />
              <GridRow label="Designation" value={selectedEmployee.designation} />
              <GridRow label="Department" value={selectedEmployee.department} />
              <GridRow label="Joining Date" value={selectedEmployee.joinDate} />
              <GridRow label="Password" value={selectedEmployee.password} />
            </Section>

            <Section title="🏦 Bank Details">
              <GridRow label="Bank Name" value={selectedEmployee.bankName} />
              <GridRow label="Account Number" value={selectedEmployee.accountNumber} />
              <GridRow label="IFSC" value={selectedEmployee.ifsc} />
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
const GridRow = ({ label, value }) => {
  let displayValue = value;

  // ✅ Password ke liye date conversion mat karo
  if (label !== "Password") {
    if (value instanceof Date) {
      displayValue = value.toLocaleDateString();
    } else if (typeof value === "string" && !isNaN(Date.parse(value))) {
      displayValue = new Date(value).toLocaleDateString();
    }
  }

  return (
    <div className="flex justify-between items-center py-1 border-b border-gray-100">
      <span className="text-gray-600 font-medium">{label}:</span>
      <span className="text-gray-900 font-bold">{displayValue || "N/A"}</span>
    </div>
  );
};

export default AllEmployees;
