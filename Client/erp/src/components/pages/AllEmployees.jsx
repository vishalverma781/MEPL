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
      if (pic.startsWith("uploads/")) {
        // ✅ backend ke uploads se serve hoga
        return `${import.meta.env.VITE_API_URL.replace("/api", "")}/${pic.replace(/\\/g, "/")}`;

      }
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
  <div className="flex-1 min-h-screen overflow-y-auto transition-all duration-300 md:ml-30 px-5 py-6">
    <div className="bg-white shadow-xl rounded-xl p-10 w-full max-w-6xl">

      <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 text-gray-900">
        👥 All Employees
      </h2>

      {employees.length === 0 ? (
        <p className="text-center text-gray-500 text-sm">
          No employees found.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-800 text-white text-sm sm:text-base">
                <th className="p-2 sm:p-3 text-left">Profile</th>
                <th className="p-2 sm:p-3 text-left">Full Name</th>
                <th className="p-2 sm:p-3 text-left hidden sm:table-cell">Email</th>
                <th className="p-2 sm:p-3 text-left hidden sm:table-cell">Phone</th>
                <th className="p-2 sm:p-3 text-left">Department</th>
                <th className="p-2 sm:p-3 text-left hidden sm:table-cell">Designation</th>
                <th className="p-2 sm:p-3 text-center">View</th>
              </tr>
            </thead>

            <tbody>
              {currentEmployees.map((emp) => (
                <tr
                  key={emp._id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition text-xs sm:text-sm"
                >
                  <td className="p-2 sm:p-3">
                    {emp.profilePic ? (
                      <img
                        src={getImageSrc(emp.profilePic)}
                        alt={emp.fullName}
                        className="w-9 h-9 sm:w-11 sm:h-11 rounded-full object-cover border"
                      />
                    ) : (
                      <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full border flex items-center justify-center text-gray-400 text-[10px]">
                        No Img
                      </div>
                    )}
                  </td>

                  <td className="p-2 sm:p-3">{emp.fullName}</td>
                  <td className="p-2 sm:p-3 hidden sm:table-cell">{emp.email}</td>
                  <td className="py-2 px-3 hidden md:table-cell whitespace-nowrap">{emp.phone}</td>
                  <td className="p-2 sm:p-3">{emp.department}</td>
                  <td className="p-2 sm:p-3 hidden sm:table-cell">{emp.designation}</td>

                  <td className="p-2 sm:p-3 text-center">
                    <button
                      onClick={() => setSelectedEmployee(emp)}
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
      {employees.length > employeesPerPage && (
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

          <span className="text-gray-700 text-xs">
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

    {/* ================= MODAL ================= */}
    {selectedEmployee && (
      <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
        <div className="bg-white rounded-xl shadow-xl w-[95%] max-w-3xl p-4 overflow-y-auto max-h-[90vh]">

          {/* Top Section */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex flex-col items-center">
              {selectedEmployee.profilePic ? (
                <img
                  src={getImageSrc(selectedEmployee.profilePic)}
                  className="w-20 h-20 rounded-full border object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-full border flex items-center justify-center text-gray-400 text-xs">
                  No Image
                </div>
              )}

              <label className="mt-2 cursor-pointer bg-blue-500 text-white px-2 py-1 rounded text-xs">
                Change
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

            <div className="flex-1">
              <h3 className="text-lg font-bold">
                {selectedEmployee.fullName}
              </h3>
              <p className="text-gray-600 text-xs">
                {selectedEmployee.designation} - {selectedEmployee.department}
              </p>
            </div>

            <button
              onClick={() => setSelectedEmployee(null)}
              className="px-3 py-1 bg-red-500 text-white rounded text-xs"
            >
              Close
            </button>
          </div>

          {/* Details Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">

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
    <h4 className="text-sm font-semibold text-gray-700 mb-1 border-b pb-1">
      {title}
    </h4>
    <div className="space-y-1">{children}</div>
  </div>
);


// Label + Value row
const GridRow = ({ label, value }) => {
  let displayValue = value;

  if (label !== "Password") {
    if (value instanceof Date) displayValue = value.toLocaleDateString();
    else if (typeof value === "string" && !isNaN(Date.parse(value)))
      displayValue = new Date(value).toLocaleDateString();
  }

  return (
    <div className="flex justify-between border-b border-gray-100 py-1">
      <span className="text-gray-600">{label}:</span>
      <span className="font-semibold text-gray-900">
        {displayValue || "N/A"}
      </span>
    </div>
  );
};

export default AllEmployees;
