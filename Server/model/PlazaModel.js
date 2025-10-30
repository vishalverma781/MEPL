import mongoose from "mongoose";

const PlazaSchema = new mongoose.Schema({
  plazaName: { type: String, required: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  employees: [
    {
      name: { type: String },
    },
  ],
});

const Plaza = mongoose.model("Plaza", PlazaSchema);
export default Plaza;
