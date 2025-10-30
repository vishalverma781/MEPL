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
      const res = await fetch("/api/projects", {
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
      const res = await fetch("${import.meta.env.VITE_API_URL}/api/plazas", {
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
    <div className="ml-64 px-6 pt-12 pb-20 min-h-screen">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-screen-lg mx-auto p-10 border border-gray-200">
        <h2 className="text-4xl font-bold text-center mb-12">Add Plaza</h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-10"
        >
          <InputField
            label="Plaza Name"
            name="plazaName"
            value={formData.plazaName}
            onChange={handleChange}
            placeholder="Enter plaza name"
            icon={<FaBuilding />}
            required
          />

          <SelectField
            label="Project"
            name="projectId"
            value={formData.projectId}
            onChange={handleChange}
            icon={<FaTasks />}
            options={projects.map((p) => ({
              label: `${p.projectName} (${p.piuName}, ${p.location})`,
              value: p._id,
            }))}
          />

          <div className="sm:col-span-2 text-center">
            <button
              type="submit"
              className="py-5 px-10 bg-gray-800 text-white rounded-xl text-lg font-semibold"
            >
              ➕ Add Plaza
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
    <label className="block mb-2 font-semibold text-lg">{label}</label>
    <div className="flex items-center border rounded-xl p-4 text-lg">
      {icon}
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="ml-2 w-full outline-none"
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
      <label className="block mb-2 font-semibold text-lg">{label}</label>
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between border rounded-xl p-4 cursor-pointer text-lg"
      >
        <div className="flex items-center">
          {icon}
          <span className="ml-2">
            {options.find((o) => o.value === value)?.label || "Select Project"}
          </span>
        </div>
      </div>

      {open && (
        <ul
          className="absolute bg-white border rounded-xl w-full mt-1 z-10 max-h-48 overflow-y-auto shadow-lg text-lg"
        >
          {options.map((opt) => (
            <li
              key={opt.value}
              className="p-3 hover:bg-gray-100 cursor-pointer"
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
