import React, { useState, useEffect } from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";

// ✅ Date formatter
const formatDate = (val) => {
  if (!val) return "";
  const d = new Date(val);
  return isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
};

// ✅ Profile pic utility
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

const ManageEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editEmployee, setEditEmployee] = useState(null);
  const [deleteEmployee, setDeleteEmployee] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 5;

  // ✅ Fetch all employees from backend
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/employees`)
      .then((res) => setEmployees(res.data))
      .catch((err) => console.error("Error fetching employees:", err));
  }, []);

  const totalPages = Math.ceil(employees.length / employeesPerPage);
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = employees.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee
  );

  const handleNext = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);
  const handlePrev = () =>
    currentPage > 1 && setCurrentPage(currentPage - 1);

// ✅ Edit save (PUT API call)
const handleSaveEdit = async () => {
  try {
    const formData = new FormData();

    // ✅ sab fields append karo
    for (const key in editEmployee) {
      if (editEmployee[key] !== undefined && editEmployee[key] !== null) {
        if (key === "dob" || key === "joinDate") {
          // date ko string ISO format me bhejo
          formData.append(key, new Date(editEmployee[key]).toISOString());
        } else {
          formData.append(key, editEmployee[key]);
        }
      }
    }

    await axios.put(
      `${import.meta.env.VITE_API_URL}/employees/${editEmployee._id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    setEmployees((prev) =>
      prev.map((emp) =>
        emp._id === editEmployee._id ? { ...emp, ...editEmployee } : emp
      )
    );
    setEditEmployee(null);
    alert("✅ Employee updated successfully!");
  } catch (error) {
    console.error("Error updating employee:", error.response?.data || error);
    alert("❌ Error updating employee");
  }
};


  // ✅ Delete confirm (DELETE API call)
  const handleConfirmDelete = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/employees/${deleteEmployee._id}`
      );
      setEmployees((prev) =>
        prev.filter((emp) => emp._id !== deleteEmployee._id)
      );
      setDeleteEmployee(null);
      alert("🗑️ Employee deleted successfully!");
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert("❌ Error deleting employee");
    }
  };

  // ✅ Open edit modal with safe copy
  const openEdit = (emp) => {
    setEditEmployee({ ...emp });
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-start p-3">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-7xl">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-900">
          ⚙️ Manage Employees
        </h2>

        {employees.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            No employees added yet.
          </p>
        ) : (
         <div className="overflow-x-auto">
  <table className="w-full border border-gray-300 rounded-xl overflow-hidden">
    <thead>
      <tr className="bg-gray-800 text-white text-xl">
        {/* 👇 Profile hidden in mobile */}
        <th className="p-5 text-left hidden md:table-cell">Profile</th>
        <th className="p-5 text-left">Full Name</th>

        {/* 👇 Hide these on small screens */}
        <th className="p-5 text-left hidden md:table-cell">Email</th>
        <th className="p-5 text-left hidden md:table-cell">Phone</th>
        <th className="p-5 text-left hidden md:table-cell">Department</th>
        <th className="p-5 text-left hidden md:table-cell">Designation</th>

        <th className="p-5 text-center">View</th>
        <th className="p-5 text-center">Edit</th>
        <th className="p-5 text-center">Delete</th>
      </tr>
    </thead>

    <tbody>
      {currentEmployees.map((emp, idx) => (
        <tr
          key={idx}
          className="border-b border-gray-200 hover:bg-gray-100 transition text-lg"
        >
          {/* ✅ Hidden on mobile */}
          <td className="p-5 hidden md:table-cell">
            {emp.profilePic ? (
              <img
                src={getImageSrc(emp.profilePic)}
                alt={emp.fullName}
                className="w-12 h-12 rounded-full object-cover border"
              />
            ) : (
              <div className="w-12 h-12 rounded-full border flex items-center justify-center text-gray-500 text-xs">
                No Img
              </div>
            )}
          </td>

          <td className="p-5">{emp.fullName}</td>

          {/* ✅ Hidden on mobile */}
          <td className="p-5 hidden md:table-cell">{emp.email}</td>
          <td className="p-5 hidden md:table-cell">{emp.phone}</td>
          <td className="p-5 hidden md:table-cell">{emp.department}</td>
          <td className="p-5 hidden md:table-cell">{emp.designation}</td>

          <td className="p-5 text-center">
            <button
              onClick={() => setSelectedEmployee(emp)}
              className="text-green-600 hover:text-green-800"
            >
              <FaEye size={20} />
            </button>
          </td>
          <td className="p-5 text-center">
            <button
              onClick={() => openEdit(emp)}
              className="text-blue-600 hover:text-blue-800"
            >
              <FaEdit size={20} />
            </button>
          </td>
          <td className="p-5 text-center">
            <button
              onClick={() => setDeleteEmployee(emp)}
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

        {employees.length > employeesPerPage && (
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

      {/* Modals */}
      {selectedEmployee && (
        <EmployeeModal
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
        />
      )}
      {editEmployee && (
        <EditEmployeeModal
          employee={editEmployee}
          setEmployee={setEditEmployee}
          onSave={handleSaveEdit}
          onClose={() => setEditEmployee(null)}
        />
      )}
      {deleteEmployee && (
        <DeleteEmployeeModal
          employee={deleteEmployee}
          onConfirm={handleConfirmDelete}
          onClose={() => setDeleteEmployee(null)}
        />
      )}
    </div>
  );
};

// ================= MODALS =================
const EmployeeModal = ({ employee, onClose }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
    <div className="bg-white rounded-2xl shadow-2xl w-[95%] max-w-4xl p-4 sm:p-6 overflow-y-auto max-h-[90vh]">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-4 mb-6">
        <div className="flex flex-col items-center">
          {employee.profilePic ? (
            <img
              src={getImageSrc(employee.profilePic)}
              alt={employee.fullName}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-gray-300 object-cover"
            />
          ) : (
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-500">
              No Image
            </div>
          )}
        </div>

        <div className="mt-4 sm:mt-0 text-center sm:text-left w-full">
          <h3 className="text-xl sm:text-2xl font-bold">{employee.fullName}</h3>
          <p className="text-gray-600 text-sm sm:text-base">
            {employee.designation || "N/A"} - {employee.department || "N/A"}
          </p>
        </div>

        <button
          onClick={onClose}
          className="mt-3 sm:mt-0 sm:ml-auto px-3 py-1 sm:px-4 sm:py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold text-sm sm:text-base"
        >
          Close
        </button>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-sm sm:text-base">
        <Section title="👤 Personal Details">
          <GridRow label="Email" value={employee.email} />
          <GridRow label="Phone" value={employee.phone} />
          <GridRow label="Gender" value={employee.gender} />
          <GridRow label="DOB" value={employee.dob} />
          <GridRow label="City" value={employee.city} />
          <GridRow label="State" value={employee.state} />
          <GridRow label="Street" value={employee.street} />
        </Section>

        <Section title="🎓 Education Details">
          <GridRow label="Qualification" value={employee.qualification} />
          <GridRow label="University" value={employee.university} />
          <GridRow label="Passing Year" value={employee.passingYear} />
        </Section>

        <Section title="💼 Employment Details">
          <GridRow label="Employee ID" value={employee.employeeId} />
          <GridRow label="Username" value={employee.username} />
          <GridRow label="Designation" value={employee.designation} />
          <GridRow label="Department" value={employee.department} />
          <GridRow label="Joining Date" value={employee.joinDate} />
          <GridRow label="Password" value={employee.password} />
        </Section>

        <Section title="🏦 Bank Details">
          <GridRow label="Bank Name" value={employee.bankName} />
          <GridRow label="Account Number" value={employee.accountNumber} />
          <GridRow label="IFSC" value={employee.ifsc} />
        </Section>
      </div>
    </div>
  </div>
);

const EditEmployeeModal = ({ employee, setEmployee, onSave, onClose }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
    <div className="bg-white rounded-2xl shadow-2xl w-[95%] max-w-4xl p-4 sm:p-6 overflow-y-auto max-h-[90vh]">
      
      {/* ===== Header Section ===== */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave();
        }}
      >
        <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-4 mb-6">
          {/* Profile Picture */}
          <div className="flex flex-col items-center">
            {employee.profilePic ? (
              <img
                src={getImageSrc(employee.profilePic)}
                alt={employee.fullName}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-gray-300 object-cover"
              />
            ) : (
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-500">
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
                  if (file) setEmployee({ ...employee, profilePic: file });
                }}
              />
            </label>
          </div>

          {/* Buttons */}
          <div className="mt-4 sm:mt-0 flex sm:ml-auto gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 font-semibold text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-sm sm:text-base"
            >
              Save
            </button>
          </div>
        </div>

        {/* ===== Form Fields ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-sm sm:text-base">

          {/* 👤 Personal Details */}
          <Section title="👤 Personal Details">
            <InputRow label="Email" value={employee.email}
              onChange={(val) => setEmployee({ ...employee, email: val })}  />
            <InputRow label="Phone" value={employee.phone}
              onChange={(val) => setEmployee({ ...employee, phone: val })}  />
            <InputRow label="Gender" value={employee.gender}
              onChange={(val) => setEmployee({ ...employee, gender: val })}  />
            <InputRow label="DOB" type="date" value={formatDate(employee.dob)}
              onChange={(val) => setEmployee({ ...employee, dob: val })}  />
            <InputRow label="City" value={employee.city}
              onChange={(val) => setEmployee({ ...employee, city: val })}  />
            <InputRow label="State" value={employee.state}
              onChange={(val) => setEmployee({ ...employee, state: val })}  />
            <InputRow label="Street" value={employee.street}
              onChange={(val) => setEmployee({ ...employee, street: val })}  />
          </Section>

          {/* 🎓 Education Details */}
          <Section title="🎓 Education Details">
            <InputRow label="Qualification" value={employee.qualification}
              onChange={(val) => setEmployee({ ...employee, qualification: val })}  />
            <InputRow label="University" value={employee.university}
              onChange={(val) => setEmployee({ ...employee, university: val })}  />
            <InputRow label="Passing Year" type="date" value={formatDate(employee.passingYear)}
              onChange={(val) => setEmployee({ ...employee, passingYear: val })}  />
          </Section>

          {/* 💼 Employment Details */}
          <Section title="💼 Employment Details">
            <InputRow label="Employee ID" value={employee.employeeId}
              onChange={(val) => setEmployee({ ...employee, employeeId: val })}  />
            <InputRow label="Username" value={employee.username}
              onChange={(val) => setEmployee({ ...employee, username: val })}  />
            <InputRow label="Designation" value={employee.designation}
              onChange={(val) => setEmployee({ ...employee, designation: val })}  />
            <InputRow label="Department" value={employee.department}
              onChange={(val) => setEmployee({ ...employee, department: val })}  />
            <InputRow label="Joining Date" type="date" value={formatDate(employee.joinDate)}
              onChange={(val) => setEmployee({ ...employee, joinDate: val })}  />
            <InputRow label="Password" type="password"
              value={employee.password || ""}
              onChange={(val) => setEmployee({ ...employee, password: val })}  />
          </Section>

          {/* 🏦 Bank Details */}
          <Section title="🏦 Bank Details">
            <InputRow label="Bank Name" value={employee.bankName}
              onChange={(val) => setEmployee({ ...employee, bankName: val })}  />
            <InputRow label="Account Number" value={employee.accountNumber}
              onChange={(val) => setEmployee({ ...employee, accountNumber: val })}  />
            <InputRow label="IFSC" value={employee.ifsc}
              onChange={(val) => setEmployee({ ...employee, ifsc: val })}  />
          </Section>
        </div>
      </form>
    </div>
  </div>
);


const DeleteEmployeeModal = ({ employee, onConfirm, onClose }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
    <div className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-md p-6">
      <h3 className="text-xl font-bold mb-4">
        Delete {employee.fullName}?
      </h3>
      <p className="text-gray-600 mb-6">
        Are you sure you want to delete this employee? This action
        cannot be undone.
      </p>
      <div className="flex justify-end gap-4">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 font-semibold"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);

// ================= COMMON =================
const Section = ({ title, children }) => (
  <div>
    <h4 className="text-lg font-semibold text-gray-700 mb-2 border-b border-gray-300 pb-1">
      {title}
    </h4>
    <div className="grid grid-cols-1 gap-2">{children}</div>
  </div>
);

const GridRow = ({ label, value }) => {
  let displayValue = value;

  // ✅ Password ke liye date conversion mat karo
  if (label !== "Password") {
    if (value instanceof Date) {
      displayValue = value.toLocaleDateString();
    } else if (
      typeof value === "string" &&
      !isNaN(Date.parse(value))
    ) {
      displayValue = new Date(value).toLocaleDateString();
    }
  }

  return (
    <div className="flex justify-between items-center py-1 border-b border-gray-100">
      <span className="text-gray-600 font-medium">{label}:</span>
      <span className="text-gray-900 font-bold">
        {displayValue || "N/A"}
      </span>
    </div>
  );
};

const InputRow = ({
  label,
  value,
  onChange,
  type = "text",
  autoComplete = "off",
}) => (
  <div className="flex flex-col md:flex-row justify-between items-center py-1 border-b border-gray-100 gap-2">
    <label className="text-gray-600 font-medium w-full md:w-1/3">
      {label}:
    </label>
    <input
      type={type}
      value={value || ""}
      autoComplete={autoComplete}
      onChange={(e) => onChange(e.target.value)}
      className="w-full md:w-2/3 border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

export default ManageEmployees;
