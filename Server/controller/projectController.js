import Project from "../model/ProjectModel.js";

// ➕ Add Project
export const addProject = async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json({ message: "✅ Project added successfully", project });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 📋 Get All Projects
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 👁️ Get Single Project
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✏️ Update Project
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json({ message: "✅ Project updated", project });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 🗑️ Delete Project
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json({ message: "✅ Project deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
