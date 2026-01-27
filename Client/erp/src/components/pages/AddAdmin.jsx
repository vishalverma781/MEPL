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
  <div className="flex-1 min-h-screen overflow-y-auto transition-all duration-300 md:ml-60 px-10 sm:px-6 lg:px-8 py-6">
    
    <div className="bg-white shadow-xl rounded-xl w-full max-w-4xl mx-auto p-10 sm:p-7 border border-gray-200">
      
      <h2 className="text-xl font-bold text-center text-gray-800 mb-5">
        Add Admin
        <span className="block w-14 h-1 bg-gray-800 mx-auto mt-2 rounded-full"></span>
      </h2>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 pb-16"
      >
        <InputField
          label="First Name"
          name="firstName"
          placeholder="Enter first name"
          value={formData.firstName}
          onChange={handleChange}
          icon={<FaUser className="text-gray-400 mr-2 text-sm" />}
          required
        />

        <InputField
          label="Last Name"
          name="lastName"
          placeholder="Enter last name"
          value={formData.lastName}
          onChange={handleChange}
          icon={<FaUser className="text-gray-400 mr-2 text-sm" />}
          required
        />

        <InputField
          label="Email"
          type="email"
          name="email"
          placeholder="Enter email"
          value={formData.email}
          onChange={handleChange}
          icon={<FaEnvelope className="text-gray-400 mr-2 text-sm" />}
          required
        />

        <InputField
          label="Username"
          name="username"
          placeholder="Enter username"
          value={formData.username}
          onChange={handleChange}
          icon={<FaUser className="text-gray-400 mr-2 text-sm" />}
          required
        />

        <InputField
          label="Password"
          type="password"
          name="password"
          placeholder="Enter password"
          value={formData.password}
          onChange={handleChange}
          icon={<FaLock className="text-gray-400 mr-2 text-sm" />}
          required
        />

        <InputField
          label="Position"
          name="position"
          placeholder="Enter position (Manager, HR)"
          value={formData.position}
          onChange={handleChange}
          icon={<FaBriefcase className="text-gray-400 mr-2 text-sm" />}
          required
        />

        <InputField
          label="City"
          name="city"
          placeholder="Enter city"
          value={formData.city}
          onChange={handleChange}
          icon={<FaCity className="text-gray-400 mr-2 text-sm" />}
          required
        />

        <InputField
          label="State"
          name="state"
          placeholder="Enter state"
          value={formData.state}
          onChange={handleChange}
          icon={<FaGlobe className="text-gray-400 mr-2 text-sm" />}
          required
        />

        {/* Full width Address */}
        <div className="sm:col-span-2">
          <InputField
            label="Home Address"
            name="address"
            placeholder="Enter home address"
            value={formData.address}
            onChange={handleChange}
            icon={<FaMapMarkerAlt className="text-gray-400 mr-2 text-sm" />}
            required
          />
        </div>

        {/* Submit Button */}
        <div className="sm:col-span-2 text-center mt-2">
          <button
            type="submit"
            className="w-full sm:w-1/2 py-2 text-sm font-semibold text-white 
                       rounded-md shadow 
                       bg-gray-800 hover:bg-gray-900 transition"
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
    <label className="block text-gray-700 font-medium mb-1 text-sm">
      {label}
    </label>

    <div className="flex items-center border border-gray-300 rounded-lg px-3 
      focus-within:border-gray-800 focus-within:ring-1 focus-within:ring-gray-800/20
      transition bg-white"
    >
      {icon}
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full py-2 text-sm bg-transparent outline-none"
        {...rest}
      />
    </div>
  </div>
);

export default AddAdmin;
