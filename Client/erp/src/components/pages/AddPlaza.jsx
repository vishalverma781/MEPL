import React, { useState, useEffect } from "react";
import { FaBuilding, FaTasks } from "react-icons/fa";

const AddPlaza = () => {
  const [formData, setFormData] = useState({
    plazaName: "",
    projectId: "", // ✅ store project _id
  });

  const [projects, setProjects] = useState([]);

  // Fetch projects
  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/projects`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch projects");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.projectId) return alert("Select a project!");

    const payload = {
      plazaName: formData.plazaName,
      projectId: formData.projectId,
      employees: [],
    };

   try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/plazas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      
      if (!res.ok) throw new Error("Failed to add plaza");
      const data = await res.json();
      alert(`Plaza "${data.plazaName}" added successfully`);
      setFormData({ plazaName: "", projectId: "" });
    } catch (err) {
      console.error(err);
      alert("Failed to add plaza");
    }
  };

return (
  <div className="flex-1 min-h-screen overflow-y-auto transition-all duration-300 p-10 md:ml-60 px-4 sm:px-6 py-6">
    
    <div className="bg-white shadow-xl rounded-xl w-full max-w-3xl mx-auto p-10 border border-gray-200">
      
      <h2 className="text-xl sm:text-2xl font-bold text-center mb-5 text-gray-900">
        ➕ Add Plaza
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <InputField
          label="Plaza Name"
          name="plazaName"
          value={formData.plazaName}
          onChange={handleChange}
          placeholder="Enter plaza name"
          icon={<FaBuilding className="text-gray-400 text-sm" />}
          required
        />

        <SelectField
          label="Project"
          name="projectId"
          value={formData.projectId}
          onChange={handleChange}
          icon={<FaTasks className="text-gray-400 text-sm" />}
          options={projects.map((p) => ({
            label: `${p.projectName} (${p.piuName}, ${p.location})`,
            value: p._id,
          }))}
        />

        <div className="sm:col-span-2 text-center mt-2">
          <button
            type="submit"
            className="px-5 py-2 bg-gray-800 text-white rounded text-xs sm:text-sm font-semibold hover:bg-gray-900 transition"
          >
            Add Plaza
          </button>
        </div>
      </form>
    </div>
  </div>
);

};

// Input Field
const InputField = ({ label, name, value, onChange, placeholder, icon }) => (
  <div>
    <label className="block mb-1 font-semibold text-xs text-gray-700">
      {label}
    </label>

    <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 text-xs bg-white focus-within:border-gray-800 focus-within:ring-1 focus-within:ring-gray-800/20 transition">
      {icon}
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="ml-2 w-full outline-none bg-transparent"
      />
    </div>
  </div>
);


// Select Field
const SelectField = ({ label, name, value, onChange, icon, options }) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (opt) => {
    onChange({ target: { name, value: opt.value } });
    setOpen(false);
  };

  return (
    <div className="relative">
      
      <label className="block mb-1 font-semibold text-xs text-gray-700">
        {label}
      </label>

      <div
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between 
                   border border-gray-300 rounded-lg 
                   px-3 py-2 cursor-pointer 
                   text-xs bg-white 
                   hover:border-gray-500 transition"
      >
        <div className="flex items-center gap-2">
          {icon}
          <span>
            {options.find((o) => o.value === value)?.label || "Select Project"}
          </span>
        </div>

        <FaChevronDown 
          className={`text-gray-500 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`} 
        />
      </div>

      {open && (
        <ul
          className="absolute bg-white border border-gray-200 
                     rounded-lg w-full mt-1 z-10 
                     max-h-40 overflow-y-auto 
                     shadow-lg text-xs"
        >
          {options.map((opt) => (
            <li
              key={opt.value}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(opt)}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AddPlaza;
