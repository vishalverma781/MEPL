import { useState, useEffect } from "react";
import { FaCalendarAlt, FaRegClock, FaPen } from "react-icons/fa";
import axios from "axios";

const ApplyLeave = ({ refreshLeaves }) => {
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    numberOfDays: "",
    reason: "",
  });

  const [user, setUser] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser({
          id: payload.id,
          username: payload.username,
          fullName: payload.fullName,
        });
      } catch (err) {
        console.error("Failed to parse token:", err);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "startDate" || name === "endDate") {
      const start = name === "startDate" ? value : formData.startDate;
      const end = name === "endDate" ? value : formData.endDate;
      if (start && end) {
        const diffTime = Math.abs(new Date(end) - new Date(start));
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        setFormData((prev) => ({ ...prev, numberOfDays: diffDays }));
      } else {
        setFormData((prev) => ({ ...prev, numberOfDays: "" }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    for (let key in formData) {
      if (!formData[key].toString().trim()) {
        alert(`${key} is required!`);
        return;
      }
    }

    if (!user.id) {
      alert("User not authenticated");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const payload = {
        ...formData,
        appliedBy: user.id,
        username: user.username,
        fullName: user.fullName,
      };
         await axios.post(`${import.meta.env.VITE_API_URL}/leaves/apply`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("✅ Leave Applied Successfully!");
      setFormData({ startDate: "", endDate: "", numberOfDays: "", reason: "" });
      if (refreshLeaves) refreshLeaves();
    } catch (err) {
      console.error(err);
      alert("❌ Error submitting leave");
    }
  };


return (
  <div className="flex-1 min-h-screen overflow-y-auto transition-all duration-300 md:ml-60 px-10 sm:px-6 lg:px-8 py-6">
    
    <div className="bg-white shadow-xl rounded-xl w-full max-w-4xl mx-auto p-10 sm:p-7 border border-gray-200">

      <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-4">
        Apply Leave
        <span className="block w-12 h-0.5 bg-gray-800 mx-auto mt-2 rounded-full"></span>
      </h2>

      <form 
        className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
        onSubmit={handleSubmit}
      >
        <InputField
          label="Start Date"
          name="startDate"
          type="date"
          value={formData.startDate}
          onChange={handleChange}
          icon={<FaCalendarAlt className="text-gray-400 mr-2 text-sm" />}
          required
        />

        <InputField
          label="End Date"
          name="endDate"
          type="date"
          value={formData.endDate}
          onChange={handleChange}
          icon={<FaCalendarAlt className="text-gray-400 mr-2 text-sm" />}
          required
        />

        <InputField
          label="Number of Days"
          name="numberOfDays"
          type="number"
          value={formData.numberOfDays}
          onChange={handleChange}
          icon={<FaRegClock className="text-gray-400 mr-2 text-sm" />}
          placeholder="Auto"
          readOnly
        />

        {/* Reason */}
        <div className="sm:col-span-2">
          <label className="block text-gray-700 font-semibold mb-1 text-sm">
            Reason for Leave
          </label>

          <div className="flex items-start border border-gray-300 rounded-lg px-2 py-1.5 bg-white">
            <FaPen className="text-gray-400 mt-2 mr-2 text-sm" />
            <textarea
              name="reason"
              placeholder="Reason..."
              value={formData.reason}
              onChange={handleChange}
              className="w-full text-sm text-gray-800 bg-transparent outline-none resize-none h-20"
              required
            />
          </div>
        </div>

        {/* Button */}
        <div className="sm:col-span-2 text-center mt-2">
          <button
            type="submit"
            className="w-full sm:w-2/3 py-2 text-sm font-bold text-white rounded-lg
                       bg-gray-800 hover:bg-gray-900 transition"
          >
            Apply Leave
          </button>
        </div>
      </form>
    </div>
  </div>
);

};

const InputField = ({ label, name, type, value, onChange, icon, placeholder, readOnly, required }) => (
  <div>
    <label className="block text-gray-700 font-semibold mb-1 text-sm">
      {label}
    </label>

    <div className="flex items-center border border-gray-300 rounded-lg px-2 py-1.5 bg-white">
      {icon}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        required={required}
        className="w-full text-sm text-gray-800 bg-transparent outline-none font-medium"
      />
    </div>
  </div>
);

export default ApplyLeave;
