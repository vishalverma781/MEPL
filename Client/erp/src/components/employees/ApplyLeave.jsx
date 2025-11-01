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
         await axios.post(`${import.meta.env.VITE_API_URL}/api/leaves/apply`, payload, {
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
    <div className="min-h-screen pt-8 pb-16 px-3 sm:px-6 lg:px-8 md:ml-64 transition-all duration-300">
      <div className="bg-white shadow-2xl rounded-2xl mb-10 p-5 sm:p-8 md:p-10 border border-gray-200 w-full max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-8">
          Apply Leave
          <span className="block w-16 sm:w-20 h-1 bg-gray-800 mx-auto mt-3 rounded-full"></span>
        </h2>

        <form className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8" onSubmit={handleSubmit}>
          <InputField
            label="Start Date"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleChange}
            icon={<FaCalendarAlt className="text-gray-400 mr-3" />}
            required
          />
          <InputField
            label="End Date"
            name="endDate"
            type="date"
            value={formData.endDate}
            onChange={handleChange}
            icon={<FaCalendarAlt className="text-gray-400 mr-3" />}
            required
          />
          <InputField
            label="Number of Days"
            name="numberOfDays"
            type="number"
            value={formData.numberOfDays}
            onChange={handleChange}
            icon={<FaRegClock className="text-gray-400 mr-3" />}
            placeholder="Auto-calculated"
            readOnly
          />

          <div className="sm:col-span-2">
            <label className="block text-gray-700 font-bold mb-2">Reason for Leave</label>
            <div className="flex items-start border border-gray-300 rounded-xl px-4 py-2 shadow-sm
                            focus-within:border-gray-800 focus-within:ring-2 focus-within:ring-gray-800/20
                            transition-all duration-300 bg-white">
              <FaPen className="text-gray-400 mt-3 mr-3" />
              <textarea
                name="reason"
                placeholder="Briefly describe the reason for your leave"
                value={formData.reason}
                onChange={handleChange}
                className="w-full p-2 text-sm sm:text-base text-gray-800 bg-transparent outline-none resize-none h-28 rounded-md"
                required
              />
            </div>
          </div>

          <div className="sm:col-span-2 text-center mt-4">
            <button
              type="submit"
              className="w-full sm:w-3/4 md:w-1/2 py-3 text-base sm:text-lg font-bold text-white rounded-xl shadow-md
                         bg-gray-800 hover:bg-gray-900 transition-all duration-300 transform hover:scale-105"
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
    <label className="block text-gray-700 font-bold mb-2">{label}</label>
    <div className="flex items-center border border-gray-300 rounded-xl px-4 shadow-sm
                    focus-within:border-gray-800 focus-within:ring-2 focus-within:ring-gray-800/20
                    transition-all duration-300 bg-white">
      {icon}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        required={required}
        className="w-full p-3 text-sm sm:text-base text-gray-800 bg-transparent outline-none font-bold"
      />
    </div>
  </div>
);

export default ApplyLeave;
