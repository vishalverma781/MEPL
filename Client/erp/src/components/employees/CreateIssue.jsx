import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaBug, FaCalendarAlt, FaClock, FaChevronDown } from "react-icons/fa";
import axios from "axios";

const CreateIssue = ({ createdIssues, setCreatedIssues }) => {
  const [formData, setFormData] = useState({
    issueType: "",
    description: "",
    date: null,
    time: "",
  });
  const [openDropdown, setOpenDropdown] = useState(false);

  const issueOptions = ["Hardware Issue", "Software Issue", "Other Issue"];

  useEffect(() => {
    if (formData.date) {
      const now = new Date();
      const timeString = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setFormData(prev => ({ ...prev, time: timeString }));
    }
  }, [formData.date]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.issueType || !formData.description || !formData.date) {
      alert("Please fill all fields!");
      return;
    }

    try {
      const token = localStorage.getItem("token"); // JWT token from login
       const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/issues`, // ✅ backticks added here
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Add newly created issue to state
      setCreatedIssues(prev => [...prev, response.data]);
      alert("Issue submitted successfully!");
      setFormData({ issueType: "", description: "", date: null, time: "" });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Error submitting issue");
    }
  };

return (
  <div className="flex-1 min-h-screen overflow-y-auto transition-all duration-300 p-10 md:ml-60 px-4 sm:px-6 py-6">
    
    <div className="bg-white shadow-xl rounded-xl w-full max-w-3xl mx-auto p-10 border border-gray-200">

      <h2 className="text-xl p-10 font-bold text-center text-gray-800 mb-4">
        Generate Your Issues
        <span className="block w-12 h-0.5 bg-gray-800 mx-auto mt-2 rounded-full"></span>
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">

        <SelectField
          label="Issue Type"
          name="issueType"
          value={formData.issueType}
          onChange={handleChange}
          icon={<FaBug className="text-gray-400 text-sm" />}
          options={issueOptions.map(o => ({ label: o, value: o }))}
          openDropdown={openDropdown}
          setOpenDropdown={setOpenDropdown}
        />

        {/* Description */}
        <div>
          <label className="block text-gray-700 font-medium mb-1 text-sm">
            Issue Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your issue..."
            className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm outline-none"
            required
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-gray-700 font-medium mb-1 text-sm">
            Select Date
          </label>
          <div className="flex items-center border border-gray-300 rounded-lg px-2 bg-white">
            <FaCalendarAlt className="text-gray-400 text-sm mr-2" />
            <DatePicker
              selected={formData.date}
              onChange={date => setFormData(prev => ({ ...prev, date }))}
              placeholderText="DD/MM/YYYY"
              dateFormat="dd/MM/yyyy"
              className="w-full py-1.5 text-sm bg-transparent outline-none cursor-pointer"
              required
            />
          </div>
        </div>

        {/* Time */}
        {formData.time && (
          <div>
            <label className="block text-gray-700 font-medium mb-1 text-sm">
              Time
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg px-2 bg-white">
              <FaClock className="text-gray-400 text-sm mr-2" />
              <input
                type="text"
                value={formData.time}
                readOnly
                className="w-full py-1.5 text-sm bg-transparent outline-none cursor-not-allowed"
              />
            </div>
          </div>
        )}

        {/* Button */}
        <div className="text-center mt-2">
          <button
            type="submit"
            className="w-full sm:w-1/2 py-1.5 text-sm font-semibold 
                       text-white rounded-lg shadow 
                       bg-gray-800 hover:bg-gray-900 transition"
          >
            Submit
          </button>
        </div>

      </form>
    </div>
  </div>
);


};

const SelectField = ({ 
  label, name, value, onChange, icon, 
  options, openDropdown, setOpenDropdown 
}) => {
  const isOpen = openDropdown === name;

  const handleSelect = (opt) => {
    onChange({ target: { name, value: opt.value } });
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
                   px-3 py-2 bg-white shadow-sm 
                   cursor-pointer 
                   hover:border-gray-500 
                   transition text-sm"
      >
        <div className="flex items-center gap-2 text-gray-700">
          {icon}
          <span className={value ? "font-semibold" : "text-gray-400"}>
            {options.find(o => o.value === value)?.label || `Select ${label}`}
          </span>
        </div>

        <FaChevronDown 
          className={`text-gray-500 text-xs transition-transform duration-200 
                     ${isOpen ? "rotate-180" : ""}`} 
        />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <ul className="absolute z-30 mt-1 w-full 
                       bg-white border border-gray-200 
                       rounded-lg shadow-md 
                       max-h-44 overflow-y-auto text-sm">
          {options.map((opt, idx) => (
            <li
              key={idx}
              onClick={() => handleSelect(opt)}
              className="px-3 py-2 cursor-pointer 
                         hover:bg-gray-100 
                         transition"
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};


export default CreateIssue;
