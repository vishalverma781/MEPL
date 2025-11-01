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
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/departments`);
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

 const res = await fetch(`${import.meta.env.VITE_API_URL}/api/employees`, {
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
    <div className="ml-64 px-6 pt-10 pb-16 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-3 text-center">
        {step === 1 && "👤 Personal Details"}
        {step === 2 && "🎓 Education Details"}
        {step === 3 && "💼 Employment Details"}
        {step === 4 && "🏦 Bank Details"}
      </h1>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        {step === 1 && (
          <Card title="Personal Details">
            <InputField label="Full Name" name="fullName" placeholder="Enter Full Name" value={formData.fullName} onChange={handleChange} icon={<FaUser />} required />
            <InputField label="Email" name="email" type="email" placeholder="abc@example.com" value={formData.email} onChange={handleChange} icon={<FaEnvelope />} required />
            <InputField label="Phone" name="phone" placeholder="+91xxxxxxxxx" value={formData.phone} onChange={handleChange} icon={<FaPhone />} required />
            <SelectField label="Gender" name="gender" value={formData.gender} onChange={handleChange} icon={<FaVenusMars className="text-gray-400 mr-2" />} options={["Select Gender", "Male", "Female", "Other"]} />
            <DateField label="Date of Birth" selected={formData.dob} onChange={(date) => setFormData({ ...formData, dob: date })} />
            <InputField label="City" name="city" placeholder="Enter city" value={formData.city} onChange={handleChange} icon={<FaMapMarkerAlt />} />
            <InputField label="State" name="state" placeholder="Enter state" value={formData.state} onChange={handleChange} icon={<FaMapMarkerAlt />} />
            <InputField label="Street Address" name="street" placeholder="Street Address" value={formData.street} onChange={handleChange} icon={<FaMapMarkerAlt />} />
            <div className="col-span-2">
              <label className="block text-gray-700 font-medium mb-2 text-lg">Profile Picture</label>
              <input type="file" accept="image/*" onChange={handleFileChange} className="w-full border p-3 rounded-xl shadow-sm" />
            </div>
          </Card>
        )}

        {step === 2 && (
          <Card title="Education Details">
            <SelectField label="Highest Qualification" name="qualification" value={formData.qualification} onChange={handleChange} icon={<FaUniversity className="text-gray-400 mr-2" />} options={["Select Qualification", "Post Graduate", "Graduate", "Diploma", "Higher Secondary", "Secondary"]} />
            <InputField label="University / College" name="university" placeholder="Delhi University" value={formData.university} onChange={handleChange} icon={<FaUniversity />} />
            <InputField label="Passing Year" name="passingYear" placeholder="2024" value={formData.passingYear} onChange={handleChange} icon={<FaCalendarAlt />} />
          </Card>
        )}

        {step === 3 && (
          <Card title="Employment Details">
            <InputField label="Employee ID" name="employeeId" placeholder="EMP12345" value={formData.employeeId} onChange={handleChange} icon={<FaIdCard />} required />
            <InputField label="Designation" name="designation" placeholder="Software Engineer" value={formData.designation} onChange={handleChange} icon={<FaBriefcase />} required />
           <SelectField
  label="Department"
  name="department"
  value={formData.department}
  onChange={handleChange}
  icon={<FaBriefcase className="text-gray-400 mr-2" />}
  options={departments.length > 0 ? departments : ["Loading..."]} // backend se aaye options
/>


            {/* ✅ Username field inside Employment Details */}
            <InputField label="Username" name="username" placeholder="Enter Username" value={formData.username} onChange={handleChange} icon={<FaUser />} required />

            <div className="col-span-2 mt-4">
              <InputField label="Password" name="password" type="password" placeholder="Enter Password" value={formData.password} onChange={handleChange} icon={<FaIdCard />} required />
            </div>

            <div className="col-span-2 mt-4">
              <DateField label="Joining Date" selected={formData.joinDate} onChange={(date) => setFormData({ ...formData, joinDate: date })} />
            </div>
          </Card>
        )}

        {step === 4 && (
          <Card title="Bank Details">
            <InputField label="Bank Name" name="bankName" placeholder="HDFC Bank" value={formData.bankName} onChange={handleChange} icon={<FaUniversity />} required />
            <InputField label="Account Number" name="accountNumber" placeholder="1234567890" value={formData.accountNumber} onChange={handleChange} icon={<FaIdCard />} required />
            <InputField label="IFSC Code" name="ifsc" placeholder="HDFC0001234" value={formData.ifsc} onChange={handleChange} icon={<FaUniversity />} required />
          </Card>
        )}

        <div className="flex justify-between mt-8">
          {step > 1 && <button type="button" onClick={() => setStep(step - 1)} className="px-6 py-3 bg-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-400 transition">⬅ Back</button>}
          <button type="submit" className={`ml-auto px-6 py-3 rounded-xl font-semibold ${step < 4 ? "bg-gray-800 text-white hover:bg-gray-900" : "bg-green-600 text-white hover:bg-green-700"}`}>{step < 4 ? "Next ➡" : "✅ Submit"}</button>
        </div>
      </form>
    </div>
  );
};

const Card = ({ title, children }) => (
  <div className="bg-white shadow-xl rounded-2xl border border-gray-200 p-8">
    <h3 className="text-xl font-bold text-gray-700 mb-6 border-b pb-2">{title}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>
  </div>
);

const InputField = ({ label, name, placeholder, type = "text", value, onChange, icon, ...rest }) => (
  <div>
    <label className="block text-gray-700 font-medium mb-2 text-lg">{label}</label>
    <div className="flex items-center border border-gray-300 rounded-xl px-4 shadow-sm bg-white focus-within:border-gray-800 focus-within:ring-2 focus-within:ring-gray-800/20 transition-all duration-300">
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

const SelectField = ({ label, name, value, onChange, icon, options }) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (opt) => {
    onChange({ target: { name, value: opt } });
    setOpen(false);
  };

  return (
    <div className="relative">
      <label className="block text-gray-700 font-medium mb-2 text-lg">{label}</label>
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between border border-gray-300 rounded-xl px-4 py-3 shadow-sm bg-white cursor-pointer hover:border-gray-500 transition-all duration-200"
      >
        <div className="flex items-center space-x-2">
          {icon}
          <span className="text-gray-700 text-lg">{value}</span>
        </div>
        <FaChevronDown className={`text-gray-500 transform transition-transform duration-200 ${open ? "rotate-180" : "rotate-0"}`} />
      </div>

      {open && (
        <ul className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg">
          {options.map((opt, idx) => (
            <li
              key={idx}
              onClick={() => handleSelect(opt)}
              className={`px-4 py-3 text-lg cursor-pointer hover:bg-gray-100 transition ${opt === value ? "bg-gray-50 font-semibold" : "text-gray-700"}`}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const DateField = ({ label, selected, onChange }) => (
  <div>
    <label className="block text-gray-700 font-medium mb-2 text-lg">{label}</label>
    <div className="flex items-center border border-gray-300 rounded-xl px-4 shadow-sm bg-white focus-within:border-gray-800 focus-within:ring-2 focus-within:ring-gray-800/20 transition-all duration-300">
      <FaCalendarAlt className="text-gray-400 mr-3" />
      <DatePicker
        selected={selected}
        onChange={onChange}
        placeholderText="DD/MM/YYYY"
        dateFormat="dd/MM/yyyy"
        className="w-full p-3 text-lg bg-transparent outline-none cursor-pointer"
        autoFocus={false}
      />
    </div>
  </div>
);

export default AddEmployeeForm;
