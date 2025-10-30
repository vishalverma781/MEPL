import Employee from "../model/EmployeeModel.js";
import jwt from "jsonwebtoken";
import { dotenvVar } from "../config.js";

// ================== GET ALL EMPLOYEES ==================
export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ================== GET SINGLE EMPLOYEE ==================
export const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.status(200).json(employee);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ================== ADD EMPLOYEE ==================
export const addEmployee = async (req, res) => {
  try {
    const data = { ...req.body };

    // ✅ Required fields check
    if (!data.fullName || !data.username || !data.email || !data.password) {
      return res.status(400).json({ message: "Full name, username, email & password are required" });
    }

    // ✅ Trim username
    if (data.username) data.username = data.username.trim();

    // ✅ Profile pic handling
    if (req.file) {
      data.profilePic = "uploads/" + req.file.filename;
    }

    // ✅ Date formatting
    if (data.dob) data.dob = new Date(data.dob);
    if (data.joinDate) data.joinDate = new Date(data.joinDate);

    // ✅ Save employee (password plain text hi rahega)
    const employee = new Employee(data);
    await employee.save();

    res.status(201).json({ message: "Employee added successfully", employee });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ================== UPDATE EMPLOYEE ==================
export const updateEmployee = async (req, res) => {
  try {
    const updates = { ...req.body };

    // ✅ Profile pic handling
    if (req.file) {
      updates.profilePic = "uploads/" + req.file.filename;
    }

    const employee = await Employee.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!employee) return res.status(404).json({ message: "Employee not found" });

    res.status(200).json({ message: "Employee updated successfully", employee });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ================== DELETE EMPLOYEE ==================
export const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ================== EMPLOYEE LOGIN ==================
export const loginEmployee = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password)
      return res.status(400).json({ message: "Username/Email and password are required" });

    const employee = await Employee.findOne({
      $or: [{ username: identifier.trim() }, { email: identifier.trim() }],
    });

    if (!employee) return res.status(404).json({ message: "Employee not found" });

    if (employee.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    
    // ✅ Token generate karo (username + fullName add kiya)
    const token = jwt.sign(
      {
        id: employee._id,
        role: "Employee",
        username: employee.username,
        fullName: employee.fullName
      },
      dotenvVar.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      role: "Employee",
      token, // token me ab username & fullName hai
      user: employee._id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};