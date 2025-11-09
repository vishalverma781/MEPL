import { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  FaUser, FaEnvelope, FaPhone, FaVenusMars, FaCalendarAlt,
  FaMapMarkerAlt, FaBriefcase, FaUniversity, FaIdCard
} from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";

const defaultFormData = {
  fullName: "",
  email: "",
  phone: "",
  gender: "Select Gender",
  dob: null,
  city: "",
  state: "",
  street: "",
  profilePic: null,
  qualification: "Select Qualification",
  university: "",
  passingYear: "",
  designation: "",
  department: "",
  username: "",       // ✅ Username added here
  joinDate: null,
  employeeId: "",
  password: "",
  bankName: "",
  accountNumber: "",
  ifsc: "",
};

const AddEmployeeForm = ({ employees, setEmployees }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(defaultFormData);
const [departments, setDepartments] = useState([]);

 // ✅ Fetch departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/departments`);
        const departmentNames = Array.isArray(res.data)
          ? res.data.map((d) => d.name)
          : [];
        setDepartments(departmentNames);
      } catch (err) {
        console.error("Error fetching departments:", err);
      }
    };
    fetchDepartments();
  }, []);


  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setFormData({ ...formData, profilePic: e.target.files[0] });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Step 1 validation
    if (step === 1 && (!formData.fullName || !formData.email || !formData.phone)) {
      alert("Full Name, Email, aur Phone fill karna zaruri hai!");
      return;
    }

    if (step < 4) {
      setStep(step + 1);
      return;
    }

    try {
      const data = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if ((key === "dob" || key === "joinDate") && value instanceof Date) {
          data.append(key, value.toISOString());
        } else if (key === "profilePic" && value instanceof File) {
          data.append(key, value);
        } else {
          data.append(key, value ?? "");
        }
      });

 const res = await fetch(`${import.meta.env.VITE_API_URL}/employees`, {
        method: "POST",
        body: data,
      });

      const resText = await res.text();
      console.log("Backend response:", res.status, resText);

      if (!res.ok) throw new Error(`Failed to add employee: ${resText}`);

      const newEmployee = JSON.parse(resText);
      setEmployees([...employees, newEmployee.employee || newEmployee]);

      alert("✅ Employee Added Successfully!");
      setFormData(defaultFormData);
      setStep(1);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to add employee, check console for details.");
    }
  };

  return (
    <div className="flex-1 min-h-screen overflow-y-auto transition-all duration-300 md:ml-60 px-4 sm:px-8 lg:px-10 py-10">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-5xl mx-auto p-6 sm:p-10 border border-gray-200">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          {step === 1 && "👤 Personal Details"}
          {step === 2 && "🎓 Education Details"}
          {step === 3 && "💼 Employment Details"}
          {step === 4 && "🏦 Bank Details"}
          <span className="block w-20 h-1 bg-gray-800 mx-auto mt-3 rounded-full"></span>
        </h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 pb-40">
          {step === 1 && (
            <>
              <InputField label="Full Name" name="fullName" placeholder="Enter Full Name" value={formData.fullName} onChange={handleChange} icon={<FaUser />} required />
              <InputField label="Email" name="email" type="email" placeholder="abc@example.com" value={formData.email} onChange={handleChange} icon={<FaEnvelope />} required />
              <InputField label="Phone" name="phone" placeholder="+91xxxxxxxxx" value={formData.phone} onChange={handleChange} icon={<FaPhone />} required />
              <SelectField label="Gender" name="gender" value={formData.gender} onChange={handleChange} icon={<FaVenusMars />} options={["Select Gender", "Male", "Female", "Other"]} required />
              <DateField label="Date of Birth" selected={formData.dob} onChange={(date) => setFormData({ ...formData, dob: date })} required />
              <InputField label="City" name="city" placeholder="Enter city" value={formData.city} onChange={handleChange} icon={<FaMapMarkerAlt />} required />
              <InputField label="State" name="state" placeholder="Enter state" value={formData.state} onChange={handleChange} icon={<FaMapMarkerAlt />} required />
              <InputField label="Street Address" name="street" placeholder="Street Address" value={formData.street} onChange={handleChange} icon={<FaMapMarkerAlt />} required />
              <div className="sm:col-span-2">
                <label className="block text-gray-700 font-medium mb-2 text-lg">Profile Picture</label>
                <input type="file" accept="image/*" onChange={handleFileChange} className="w-full border p-3 rounded-xl shadow-sm" required />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <SelectField label="Highest Qualification" name="qualification" value={formData.qualification} onChange={handleChange} icon={<FaUniversity />} options={["Select Qualification", "Post Graduate", "Graduate", "Diploma", "Higher Secondary", "Secondary"]} required />
              <InputField label="University / College" name="university" placeholder="Delhi University" value={formData.university} onChange={handleChange} icon={<FaUniversity />} required />
              <InputField label="Passing Year" name="passingYear" placeholder="2024" value={formData.passingYear} onChange={handleChange} icon={<FaCalendarAlt />} required />
            </>
          )}

          {step === 3 && (
            <>
              <InputField label="Employee ID" name="employeeId" placeholder="EMP12345" value={formData.employeeId} onChange={handleChange} icon={<FaIdCard />} required />
              <InputField label="Designation" name="designation" placeholder="Software Engineer" value={formData.designation} onChange={handleChange} icon={<FaBriefcase />} required />
              <SelectField label="Department" name="department" value={formData.department} onChange={handleChange} icon={<FaBriefcase />} options={departments.length > 0 ? departments : ["Loading..."]} required />
              <InputField label="Username" name="username" placeholder="Enter Username" value={formData.username} onChange={handleChange} icon={<FaUser />} required />
              <InputField label="Password" name="password" type="password" placeholder="Enter Password" value={formData.password} onChange={handleChange} icon={<FaIdCard />} required />
              <DateField label="Joining Date" selected={formData.joinDate} onChange={(date) => setFormData({ ...formData, joinDate: date })} required />
            </>
          )}

          {step === 4 && (
            <>
              <InputField label="Bank Name" name="bankName" placeholder="HDFC Bank" value={formData.bankName} onChange={handleChange} icon={<FaUniversity />} required />
              <InputField label="Account Number" name="accountNumber" placeholder="1234567890" value={formData.accountNumber} onChange={handleChange} icon={<FaIdCard />} required />
              <InputField label="IFSC Code" name="ifsc" placeholder="HDFC0001234" value={formData.ifsc} onChange={handleChange} icon={<FaUniversity />} required />
            </>
          )}

          <div className="sm:col-span-2 flex justify-between mt-8">
            {step > 1 && (
              <button type="button" onClick={() => setStep(step - 1)} className="px-6 py-3 bg-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-400 transition">
                ⬅ Back
              </button>
            )}
            <button
              type="submit"
              className={`ml-auto px-6 py-3 rounded-xl font-semibold ${
                step < 4 ? "bg-gray-800 text-white hover:bg-gray-900" : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              {step < 4 ? "Next ➡" : "✅ Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ✅ InputField Component
const InputField = ({ label, name, placeholder, type = "text", value, onChange, icon, required }) => (
  <div>
    <label className="block text-gray-700 font-medium mb-2">{label}</label>
    <div className="flex items-center border border-gray-300 rounded-xl px-4 shadow-sm focus-within:border-gray-800 focus-within:ring-2 focus-within:ring-gray-800/20 transition-all duration-300 bg-white">
      {icon && <span className="text-gray-400 mr-3">{icon}</span>}
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full p-3 bg-transparent outline-none text-base"
      />
    </div>
  </div>
);

// ✅ SelectField Component
const SelectField = ({ label, name, value, onChange, icon, options, required }) => {
  const [open, setOpen] = useState(false);
  const handleSelect = (opt) => {
    onChange({ target: { name, value: opt } });
    setOpen(false);
  };
  return (
    <div className="relative">
      <label className="block text-gray-700 font-medium mb-2">{label}</label>
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between border border-gray-300 rounded-xl px-4 py-3 shadow-sm bg-white cursor-pointer hover:border-gray-500 transition"
      >
        <div className="flex items-center space-x-2">
          {icon}
          <span className={`text-gray-700 ${value === "Select Gender" || value === "Select Qualification" ? "text-gray-400" : ""}`}>
            {value}
          </span>
        </div>
        <FaChevronDown className={`text-gray-500 transform transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </div>

      {open && (
        <ul className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg">
          {options.map((opt, i) => (
            <li
              key={i}
              onClick={() => handleSelect(opt)}
              className={`px-4 py-3 cursor-pointer hover:bg-gray-100 ${opt === value ? "bg-gray-50 font-semibold" : ""}`}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
      {required && <input type="hidden" required value={value} onChange={() => {}} />}
    </div>
  );
};

// ✅ DateField Component
const DateField = ({ label, selected, onChange, required }) => (
  <div>
    <label className="block text-gray-700 font-medium mb-2">{label}</label>
    <div className="flex items-center border border-gray-300 rounded-xl px-4 shadow-sm bg-white focus-within:border-gray-800 focus-within:ring-2 focus-within:ring-gray-800/20 transition-all duration-300">
      <FaCalendarAlt className="text-gray-400 mr-3" />
      <DatePicker
        selected={selected}
        onChange={onChange}
        placeholderText="DD/MM/YYYY"
        dateFormat="dd/MM/yyyy"
        required={required}
        className="w-full p-3 bg-transparent outline-none cursor-pointer"
      />
    </div>
  </div>
);

export default AddEmployeeForm;
