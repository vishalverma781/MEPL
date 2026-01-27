import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaUserTie, FaTasks, FaBuilding, FaCalendarAlt, FaChevronDown } from "react-icons/fa";

const AddRoles = ({ setRoles }) => {
  const [formData, setFormData] = useState({
    employeeId: "",
    role: "",
    assignedProject: "",
    assignedPlaza: "",
    office: "",
    fromDate: null,
  });

  const [employeesList, setEmployeesList] = useState([]);
  const [projectsList, setProjectsList] = useState([]);
  const [plazasList, setPlazasList] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);

  const roleOptions = [
    "Site Engineer",
    "Plaza Incharge",
    "Project Manager",
    "Software Developer",
    "Senior Software Developer",
  ];

  const officeOptions = [
    { label: "Head Office", value: "head" },
    { label: "Branch Office", value: "branch" },
  ];

  const token = localStorage.getItem("token");

  const currentAdmin = JSON.parse(localStorage.getItem("currentUser")) || {};


 // ✅ Fetch Employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/employees`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setEmployeesList(data);
      } catch (err) {
        console.error("Error fetching employees:", err);
      }
    };
    fetchEmployees();
  }, [token]);

  // ✅ Fetch Projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/projects`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setProjectsList(data);
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };
    fetchProjects();
  }, [token]);

  // ✅ Fetch Plazas
  useEffect(() => {
    const fetchPlazas = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/plazas`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setPlazasList(data);
      } catch (err) {
        console.error("Error fetching plazas:", err);
      }
    };
    fetchPlazas();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === "assignedProject" ? { assignedPlaza: "" } : {}),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { employeeId, role, assignedProject, assignedPlaza, office, fromDate } = formData;

    if (!employeeId || !role || !fromDate) {
      alert("Please fill all required fields!");
      return;
    }

    // Role-based validation
    if (role === "Project Manager" && !assignedProject) {
      alert("Please select a project for Project Manager");
      return;
    }
    if (["Software Developer", "Senior Software Developer"].includes(role) && !office) {
      alert("Please select an office for Software Developer");
      return;
    }
    if (["Site Engineer", "Plaza Incharge"].includes(role)) {
      if (!assignedProject) { alert("Please select a project"); return; }
      if (!assignedPlaza) { alert("Please select a plaza"); return; }
    }

    const newRole = {
      employeeId,
      role,
      assignedProject: ["Site Engineer","Plaza Incharge","Project Manager"].includes(role) ? assignedProject : undefined,
      assignedPlaza: ["Site Engineer", "Plaza Incharge"].includes(role) ? assignedPlaza : undefined,
      office: ["Software Developer", "Senior Software Developer"].includes(role) ? office : undefined,
      fromDate,
      assignBy: {
        adminId: currentAdmin._id,
        username: currentAdmin.username || "Unknown Admin",
      }
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/roles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newRole),
      });

      if (!res.ok) throw new Error("Failed to assign role");

      const savedRole = await res.json();
      setRoles(prev => [...prev, savedRole]);
      alert("Role assigned successfully!");
      setFormData({ employeeId: "", role: "", assignedProject: "", assignedPlaza: "", office: "", fromDate: null });
    } catch (err) {
      console.error(err);
      alert("Error assigning role!");
    }
  };

return (
  <div className="flex-1 min-h-screen overflow-y-auto transition-all p-10 duration-300 p-10 md:ml-90 px-4 sm:px-6 py-6">
    
    <div className="bg-white shadow-xl rounded-xl w-full max-w-3xl mx-auto p-10 border border-gray-200">
      
      <h2 className="text-xl font-bold text-center text-gray-800 mb-6">
        Change Roles
        <span className="block w-16 h-1 bg-gray-800 mx-auto mt-2 rounded-full"></span>
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <SelectField
          label=" Employee"
          name="employeeId"
          value={formData.employeeId}
          onChange={handleChange}
          icon={<FaUserTie className="text-gray-400 text-sm" />}
          options={employeesList.map(e => ({ label: e.fullName, value: e._id }))}
          openDropdown={openDropdown}
          setOpenDropdown={setOpenDropdown}
        />

        <SelectField
          label="Assign Role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          icon={<FaTasks className="text-gray-400 text-sm" />}
          options={roleOptions.map(r => ({ label: r, value: r }))}
          openDropdown={openDropdown}
          setOpenDropdown={setOpenDropdown}
        />

        {formData.role && !["Software Developer","Senior Software Developer"].includes(formData.role) && (
          <SelectField
            label="Assign Project"
            name="assignedProject"
            value={formData.assignedProject}
            onChange={handleChange}
            icon={<FaBuilding className="text-gray-400 text-sm" />}
            options={projectsList.map(p => ({ label: p.projectName, value: p._id }))}
            openDropdown={openDropdown}
            setOpenDropdown={setOpenDropdown}
          />
        )}

        {formData.role && formData.assignedProject && !["Project Manager","Software Developer","Senior Software Developer"].includes(formData.role) && (
          <SelectField
            label="Assign Plaza"
            name="assignedPlaza"
            value={formData.assignedPlaza}
            onChange={handleChange}
            icon={<FaBuilding className="text-gray-400 text-sm" />}
            options={plazasList.map(p => ({ label: p.plazaName, value: p._id }))}
            openDropdown={openDropdown}
            setOpenDropdown={setOpenDropdown}
          />
        )}

        {["Software Developer","Senior Software Developer"].includes(formData.role) && (
          <SelectField
            label="Assign Office"
            name="office"
            value={formData.office}
            onChange={handleChange}
            icon={<FaBuilding className="text-gray-400 text-sm" />}
            options={officeOptions}
            openDropdown={openDropdown}
            setOpenDropdown={setOpenDropdown}
          />
        )}

        {/* Date Picker */}
        <div>
          <label className="block text-gray-700 font-medium mb-1 text-sm">From Date</label>
          <div className="flex items-center border border-gray-300 rounded-lg px-3 bg-white">
            <FaCalendarAlt className="text-gray-400 mr-2 text-sm" />
            <DatePicker
              selected={formData.fromDate}
              onChange={date => setFormData({ ...formData, fromDate: date })}
              placeholderText="DD/MM/YYYY"
              dateFormat="dd/MM/yyyy"
              className="w-full p-2 text-sm bg-transparent outline-none cursor-pointer"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center pt-2">
          <button
            type="submit"
            className="w-full sm:w-1/2 py-2 text-sm font-semibold text-white rounded-lg bg-gray-800 hover:bg-gray-900 transition"
          >
            Assign Role
          </button>
        </div>

      </form>
    </div>
  </div>
);

};

// Dropdown component
const SelectField = ({ 
  label, name, value, onChange, icon, 
  options, openDropdown, setOpenDropdown 
}) => {

  const isOpen = openDropdown === name;

  const handleSelect = (opt) => {
    onChange({ target: { name, value: opt.value }});
    setOpenDropdown(null);
  };

  return (
    <div className="relative">
      
      {/* Label */}
      <label className="block text-gray-700 font-medium mb-1 text-sm">
        {label}
      </label>

      {/* Select Box */}
      <div
        onClick={() => setOpenDropdown(isOpen ? null : name)}
        className="flex items-center justify-between 
                   border border-gray-300 rounded-lg 
                   px-3 py-2 bg-white cursor-pointer 
                   hover:border-gray-500 transition-all duration-200"
      >
        <div className="flex items-center space-x-2">
          {icon}
          <span className={`text-gray-700 text-sm ${value ? "font-semibold" : ""}`}>
            {options.find(o => o.value === value)?.label || `Select ${label}`}
          </span>
        </div>

        {/* Dropdown Icon */}
        <FaChevronDown 
          className={`text-gray-500 text-sm transform transition-transform duration-200 
          ${isOpen ? "rotate-180" : "rotate-0"}`} 
        />
      </div>

      {/* Dropdown List */}
      {isOpen && (
        <ul className="absolute z-20 mt-1 w-full 
                       bg-white border border-gray-200 
                       rounded-lg shadow-lg max-h-52 overflow-y-auto">
          {options.map((opt, idx) => (
            <li
              key={idx}
              onClick={() => handleSelect(opt)}
              className={`px-3 py-2 text-sm cursor-pointer 
              ${opt.value === value ? "font-semibold text-gray-800" : "text-gray-700"} 
              hover:bg-gray-100 transition`}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AddRoles;
