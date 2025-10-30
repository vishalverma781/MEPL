import Role from "../model/RoleModel.js";

// Get all roles
export const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find()
      .populate("employeeId", "fullName username")
      .populate("assignedProject", "projectName")
      .populate("assignedPlaza", "plazaName")
      .populate("assignBy.adminId", "username"); // ensure assignBy.user populated
    res.json(roles);
  } catch (err) {
    res.status(500).json({ message: "Error fetching roles", error: err.message });
  }
};

// Create new role
export const createRole = async (req, res) => {
  try {
    const { employeeId, role, assignedProject, assignedPlaza, office, fromDate } = req.body;

    // Logged-in admin from JWT middleware
    const admin = req.user;

    const roleData = {
      employeeId,
      role,
      assignedProject,
      assignedPlaza,
      office,
      fromDate,
     assignBy: req.body.assignBy, // frontend se aa raha
    };

    const newRole = new Role(roleData);
    await newRole.save();
    res.status(201).json(newRole);
  } catch (err) {
    res.status(400).json({ message: "Error creating role", error: err.message });
  }
};
