import { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaMapMarkerAlt,
  FaCity,
  FaGlobe,
  FaBriefcase, // 👈 position ke liye icon
} from "react-icons/fa";

const AddAdmin = ({ admins, setAdmins }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    position: "", // 👈 naya field
    address: "",
    city: "",
    state: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (let key in formData) {
      if (!formData[key].trim()) {
        alert(`${key} is required!`);
        return;
      }
    }

    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      username: formData.username,
      password: formData.password,
      position: formData.position, // 👈 payload me add
      address: {
        homeAddress: formData.address,
        city: formData.city,
        state: formData.state,
      },
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admins`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to add admin");
        return;
      }

      setAdmins([...admins, data.newAdmin]);
      alert("Admin Added Successfully!");

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        username: "",
        password: "",
        position: "",
        address: "",
        city: "",
        state: "",
      });
    } catch (err) {
      console.error(err);
      alert("Error connecting to server");
    }
  };

    return (
      <div className="flex-1 min-h-screen overflow-y-auto transition-all duration-300 md:ml-60 px-5 sm:px-8 lg:px-10 py-10">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-5xl mx-auto ml-5 p-6 sm:p-10 border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Add Admin
          <span className="block w-20 h-1 bg-gray-800 mx-auto mt-3 rounded-full"></span>
        </h2>
        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 pb-40"
        >
          <InputField
            label="First Name"
            name="firstName"
            placeholder="Enter first name"
            value={formData.firstName}
            onChange={handleChange}
            icon={<FaUser className="text-gray-400 mr-3" />}
            required
          />
          <InputField
            label="Last Name"
            name="lastName"
            placeholder="Enter last name"
            value={formData.lastName}
            onChange={handleChange}
            required
            icon={<FaUser className="text-gray-400 mr-3" />}
          />
          <InputField
            label="Email"
            type="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
            icon={<FaEnvelope className="text-gray-400 mr-3" />}
            required
          />
          <InputField
            label="Username"
            name="username"
            placeholder="Enter username"
            value={formData.username}
            onChange={handleChange}
            icon={<FaUser className="text-gray-400 mr-3" />}
            required
          />
          <InputField
            label="Password"
            type="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            icon={<FaLock className="text-gray-400 mr-3" />}
            required
          />

          {/* 👇 Naya Position Field */}
          <InputField
            label="Position"
            name="position"
            placeholder="Enter position (e.g. Manager, HR)"
            value={formData.position}
            onChange={handleChange}
            icon={<FaBriefcase className="text-gray-400 mr-3" />}
            required
          />

          <InputField
            label="City"
            name="city"
            placeholder="Enter city"
            value={formData.city}
            onChange={handleChange}
            required
            icon={<FaCity className="text-gray-400 mr-3" />}
          />
          <InputField
            label="State"
            name="state"
            placeholder="Enter state"
            value={formData.state}
            onChange={handleChange}
            required
            icon={<FaGlobe className="text-gray-400 mr-3" />}
          />

          {/* 👇 Home Address ko last me full width */}
          <div className="sm:col-span-2">
            <InputField
              label="Home Address"
              name="address"
              placeholder="Enter home address"
              value={formData.address}
              onChange={handleChange}
              required
              icon={<FaMapMarkerAlt className="text-gray-400 mr-3" />}
            />
          </div>

          {/* Submit Button */}
          <div className="sm:col-span-2 text-center">
            <button
              type="submit"
              className="w-full sm:w-1/2 py-3 text-lg font-semibold text-white rounded-xl shadow-md 
                bg-gray-800 hover:bg-gray-900 
                transition-all duration-300 transform hover:scale-105"
            >
              Add Admin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ✅ InputField Component
const InputField = ({
  label,
  name,
  placeholder,
  type = "text",
  value,
  onChange,
  icon,
  ...rest
}) => (
  <div>
    <label className="block text-gray-700 font-medium mb-2">{label}</label>
    <div
      className="flex items-center border border-gray-300 rounded-xl px-4 shadow-sm 
      focus-within:border-gray-800 focus-within:ring-2 focus-within:ring-gray-800/20
      transition-all duration-300 bg-white"
    >
      {icon}
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full p-3 text-base bg-transparent outline-none"
        {...rest}
      />
    </div>
  </div>
);

export default AddAdmin;
