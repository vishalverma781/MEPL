import Plaza from "../model/PlazaModel.js";

// Get all plazas with project populated
export const getAllPlazas = async (req, res) => {
  try {
    const plazas = await Plaza.find().populate("projectId"); // ✅ populate projectId
    res.status(200).json(plazas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Add new plaza
export const addPlaza = async (req, res) => {
  try {
    const { plazaName, projectId } = req.body;

    const newPlaza = new Plaza({
      plazaName,
      projectId,
      employees: [],
    });

    const savedPlaza = await newPlaza.save();
    res.status(201).json(savedPlaza);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Delete plaza by ID
export const deletePlaza = async (req, res) => {
  try {
    const plaza = await Plaza.findById(req.params.id);
    if (!plaza) return res.status(404).json({ message: "Plaza not found" });

     await Plaza.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Plaza deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
