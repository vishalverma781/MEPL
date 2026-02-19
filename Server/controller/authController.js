import SuperAdmin from "../model/superAdminModel.js";
import authEssentials from "./index.js";
import Admin from "../model/adminModel.js";
import Employee from "../model/EmployeeModel.js";

const authController = {
  login: async (req, res) => {
   const { identifier, password } = req.body || {};
console.log("LOGIN BODY:", req.body);
    try {
      if (!identifier || !password) {
        return res.status(400).json({ message: "Credentials required" });
      }

      let user = null;
      let role = null;

      // 🔹 Check Admin first
      const admin = await Admin.findOne({
        $or: [{ email: identifier }, { username: identifier }]
      });
      if (admin) {
        user = admin;
        role = "Admin";
      }

      // 🔹 Check SuperAdmin
      if (!user) {
        const superAdmin = await SuperAdmin.findOne({
          $or: [{ email: identifier }, { username: identifier }]
        });

        if (superAdmin) {
          user = superAdmin;
          role = "SuperAdmin";

          // Save login timestamp
          superAdmin.loginLogs.push({ timestamp: new Date() });
          await superAdmin.save();
        }
      }

      // 🔹 Check Employee
      if (!user) {
        const employee = await Employee.findOne({
          $or: [{ username: identifier }, { email: identifier }]
        });

        if (employee) {
          user = employee;
          role = "Employee";
        }
      }

      // 🔹 No user found
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // 🔹 Check password
      const isMatch = await authEssentials.verifyPassword(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Incorrect password" });
      }

      // 🔹 Generate JWT token
  
  const token = authEssentials.createToken({
  user: user._id,
  role,
  username: user.username,           // ✅ add username
  position: user.position || role    // ✅ add position (fallback to role if empty)
})

      const responseData = {
        message: "Login success",
        token,
        user: user._id,
        role,
      };

      return res.status(200).json(responseData);

    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
};

export default authController;
