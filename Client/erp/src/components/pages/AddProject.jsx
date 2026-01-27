import { useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  FaBuilding,
  FaUserTie,
  FaUsers,
  FaMapMarkerAlt,
  FaTasks,
  FaCalendarAlt,
} from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";

const AddProject = ({ projects, setProjects }) => {
  const [formData, setFormData] = useState({
    projectName: "",
    piuName: "",
    clientName: "",
    location: "",
    assignedTo: "N/A",
    startDate: null,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Connect to backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation
    for (let key in formData) {
      if (!formData[key]) {
        alert(`${key} is required!`);
        return;
      }
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/projects`, // ✅ fixed here
        {
          ...formData,
          startDate: formData.startDate
            ? formData.startDate.toISOString()
            : null,
        }
      );

      if (res.status === 201) {
        // Update local state
        setProjects([...projects, res.data.project]);
        alert("✅ Project Added Successfully!");
        // Reset form
        setFormData({
          projectName: "",
          piuName: "",
          clientName: "",
          location: "",
          assignedTo: "N/A",
          startDate: null,
        });
      }
    } catch (error) {
      console.error("Error adding project:", error.response?.data || error.message);
      alert("❌ Failed to add project");
    }
  };

return (
  <div className="flex-1 transition-all duration-300 md:ml-60 min-h-[100vh] ">
    
    {/* Scrollable area */}
    <div className="w-full h-full overflow-y-auto px-3 sm:px-6 lg:px-8 py-6">
      
      {/* Card */}
      <div className="bg-white shadow-md rounded-xl 
                      w-full max-w-4xl mx-auto 
                      p-10 sm:p-6 
                      border border-gray-200">

        {/* Heading */}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-5">
          Add Project
          <span className="block w-14 h-1 bg-gray-800 mx-auto mt-2 rounded-full"></span>
        </h2>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 pb-10"
        >
          <InputField
            label="Project Name"
            name="projectName"
            placeholder="Enter project name"
            value={formData.projectName}
            onChange={handleChange}
            icon={<FaBuilding className="text-gray-400 mr-2 text-sm" />}
            required
          />

          <InputField
            label="PIU Name"
            name="piuName"
            placeholder="Enter PIU name"
            value={formData.piuName}
            onChange={handleChange}
            icon={<FaUserTie className="text-gray-400 mr-2 text-sm" />}
            required
          />

          <InputField
            label="Client Name"
            name="clientName"
            placeholder="Enter client name"
            value={formData.clientName}
            onChange={handleChange}
            icon={<FaUsers className="text-gray-400 mr-2 text-sm" />}
            required
          />

          <InputField
            label="Location"
            name="location"
            placeholder="Enter location"
            value={formData.location}
            onChange={handleChange}
            icon={<FaMapMarkerAlt className="text-gray-400 mr-2 text-sm" />}
            required
          />

          <SelectField
            label="Assigned To"
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleChange}
            icon={<FaTasks className="text-gray-400 mr-2 text-sm" />}
            options={["N/A", "Admin", "Manager", "Supervisor"]}
          />

          {/* Date Picker */}
          <div>
            <label className="block text-gray-700 font-medium mb-1 text-sm">
              Date of Creation
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 
                            focus-within:border-gray-800 focus-within:ring-1 
                            focus-within:ring-gray-800/20 transition bg-white">
              <FaCalendarAlt className="text-gray-400 mr-2 text-sm" />
              <DatePicker
                selected={formData.startDate}
                onChange={(date) => setFormData({ ...formData, startDate: date })}
                placeholderText="DD/MM/YYYY"
                dateFormat="dd/MM/yyyy"
                className="w-full p-3 text-sm bg-transparent outline-none cursor-pointer"
                required
              />
            </div>
          </div>

          {/* Button */}
          <div className="sm:col-span-2 mt-4 text-center">
            <button
              type="submit"
              className="w-full sm:w-1/2 py-2.5 text-sm font-semibold text-white 
                         rounded-lg shadow 
                         bg-gray-800 hover:bg-gray-900 
                         transition transform hover:scale-105"
            >
              Add Project
            </button>
          </div>

        </form>
      </div>
    </div>
  </div>
);


};

// ✅ Reusable Input Field
const InputField = ({ label, name, placeholder, type = "text", value, onChange, icon, ...rest }) => (
  <div>
    <label className="block text-gray-700 font-medium mb-2 text-lg">{label}</label>
    <div className="flex items-center border border-gray-300 rounded-xl px-4 shadow-sm 
      focus-within:border-gray-800 focus-within:ring-2 focus-within:ring-gray-800/20
      transition-all duration-300 bg-white">
      {icon}
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full p-3 text-lg bg-transparent outline-none"
        {...rest}
      />
    </div>
  </div>
);

// ✅ Reusable Select Field
const SelectField = ({ label, name, value, onChange, icon, options }) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (opt) => {
    onChange({ target: { name, value: opt } });
    setOpen(false);
  };

  return (
    <div className="relative">
      <label className="block text-gray-700 font-medium text-lg">{label}</label>
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between border border-gray-300 rounded-xl px-2 py-2 shadow-sm 
                   bg-white cursor-pointer hover:border-gray-500 transition-all duration-200"
      >
        <div className="flex items-center space-x-2">
          {icon}
          <span className="text-gray-700 text-lg">{value}</span>
        </div>
        <FaChevronDown
          className={`text-gray-500 transform transition-transform duration-200 ${open ? "rotate-180" : "rotate-0"}`}
        />
      </div>

      {open && (
        <ul className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg">
          {options.map((opt, idx) => (
            <li
              key={idx}
              onClick={() => handleSelect(opt)}
              className={`px-4 py-3 text-lg cursor-pointer hover:bg-gray-100 transition 
                ${opt === value ? "bg-gray-50 font-semibold" : "text-gray-700"}`}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};


export default AddProject;
