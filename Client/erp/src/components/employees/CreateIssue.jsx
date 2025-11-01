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
        `${import.meta.env.VITE_API_URL}/api/issues`, // ✅ backticks added here
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
    <div className="ml-64 px-4 sm:px-6 lg:px-8 pt-8 pb-16 min-h-screen">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-screen-lg mx-auto p-10 sm:p-15 border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
          Generate Your Issues
          <span className="block w-20 h-1 bg-gray-800 mx-auto mt-3 rounded-full"></span>
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <SelectField
            label="Select Issue Type"
            name="issueType"
            value={formData.issueType}
            onChange={handleChange}
            icon={<FaBug className="text-gray-400" />}
            options={issueOptions.map(o => ({ label: o, value: o }))}
            openDropdown={openDropdown}
            setOpenDropdown={setOpenDropdown}
          />

          <div>
            <label className="block text-gray-700 font-medium mb-2 text-lg">Issue Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your issue in detail..."
              className="w-full border border-gray-300 rounded-xl px-4 py-3 shadow-sm bg-white text-lg outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2 text-lg">Select Date</label>
            <div className="flex items-center border border-gray-300 rounded-xl px-4 shadow-sm bg-white">
              <FaCalendarAlt className="text-gray-400 mr-3" />
              <DatePicker
                selected={formData.date}
                onChange={date => setFormData(prev => ({ ...prev, date }))}
                placeholderText="DD/MM/YYYY"
                dateFormat="dd/MM/yyyy"
                className="w-full p-3 text-lg bg-transparent outline-none cursor-pointer"
                required
              />
            </div>
          </div>

          {formData.time && (
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-lg">Time</label>
              <div className="flex items-center border border-gray-300 rounded-xl px-4 shadow-sm bg-white">
                <FaClock className="text-gray-400 mr-3" />
                <input
                  type="text"
                  value={formData.time}
                  readOnly
                  className="w-full p-3 text-lg bg-transparent outline-none cursor-not-allowed"
                />
              </div>
            </div>
          )}

          <div className="text-center">
            <button
              type="submit"
              className="w-full sm:w-1/2 py-2 text-lg font-semibold text-white rounded-xl shadow-md bg-gray-800 hover:bg-gray-900 transition-all duration-300 transform hover:scale-105"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const SelectField = ({ label, name, value, onChange, icon, options, openDropdown, setOpenDropdown }) => {
  const isOpen = openDropdown === name;
  const handleSelect = opt => { onChange({ target: { name, value: opt.value } }); setOpenDropdown(null); };
  return (
    <div className="relative">
      <label className="block text-gray-700 font-medium mb-2 text-lg">{label}</label>
      <div
        onClick={() => setOpenDropdown(isOpen ? null : name)}
        className="flex items-center justify-between border border-gray-300 rounded-xl px-4 py-3 shadow-sm bg-white cursor-pointer hover:border-gray-500 transition-all duration-200"
      >
        <div className="flex items-center space-x-2">
          {icon}
          <span className={`text-gray-700 text-lg ${value ? "font-semibold" : ""}`}>
            {options.find(o => o.value === value)?.label || `Select ${label}`}
          </span>
        </div>
        <FaChevronDown className={`text-gray-500 transform transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"}`} />
      </div>
      {isOpen && (
        <ul className="absolute z-20 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
          {options.map((opt, idx) => (
            <li
              key={idx}
              onClick={() => handleSelect(opt)}
              className={`px-4 py-3 text-lg cursor-pointer ${opt.value === value ? "font-semibold text-gray-700" : "text-gray-700"} hover:bg-gray-100 transition`}
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
