import Department from "../model/DepartmentModel.js";

// GET all departments
export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    res.json(departments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST add new department
export const addDepartment = async (req, res) => {
  try {
    const { name } = req.body;
    const newDept = new Department({ name });
    const savedDept = await newDept.save();
    res.status(201).json(savedDept);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT update department
export const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const updatedDept = await Department.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );
    res.json(updatedDept);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE department
export const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    await Department.findByIdAndDelete(id);
    res.json({ message: "Department deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
