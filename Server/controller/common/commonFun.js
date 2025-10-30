import mongoose from "mongoose";
import { dotenvVar } from "../../config.js";
import authEssentials from "../index.js";
import Admin from "../../model/adminModel.js";
const commontController = {

    addAdmin: async (req, res) => {

        const {firstName, lastName, address, username,  email, password, } = req.body
        try {
            if ( !firstName || !lastName || !email || !password || !username || !address || !address.city || !address.state || !address.homeAddress) {
                return res.status(400).json({ message: "all feilds are required" })
            }


            const emailRegex = /^\S+@\S+\.\S+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ error: "Invalid email format" });
            }
            const existEmail = await Admin.findOne({ email });
            if (existEmail) {
                return res.status(400).json({ message: "Emal already exist" })
            }

            // const checkSite = await Site.findById(siteLocation)
            // if (!checkSite) {
            //     return res.status(400).json({ message: "this site not available " })
            // }

            const hashedPwd = await authEssentials.createHash(password, dotenvVar.SALT);

            const newAdmin = new Admin({
                firstName,
                lastName,
                address,
               username,
                email,
                password: hashedPwd,
              
            })
            await newAdmin.save();
            return res.status(201).json({ message: "new employee added", newAdmin })
        } catch (err) {
            console.log(err);

            return res.status(500).json({ message: "internal server error" })
        }

    },

    getallAdmins: async(req, res) => {
        try {
            const admins = await Admin.find();
            if (!admins) {
                return res.status(400).json("No Admins found")
            }
            res.status(200).json({ message: "Admins found found", admins })
        }
        catch (err) {
            console.log(err);
            return res.status(500).json({ message: "internal server error" })

        }
    },
    getallActiveAdmins: async(req, res) => {
        try {
            const admins = await Admin.find({isActive: true});
            if (!admins) {
                return res.status(400).json("No Admins found")
            }
            res.status(200).json({ message: "Admins found found", admins })
        }
        catch (err) {
            console.log(err);
            return res.status(500).json({ message: "internal server error" })

        }
    },

    updateAdmin: async (req, res) => {
        const { id } = req.params;
        const { username, email, password, } = req.body;

        try {
            // Validate ID
            if (!id || !mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ message: "Invalid or missing ID" });
            }

            // Check if employee exists
            const existingAdmin = await Admin.findById(id);
            if (!existingAdmin) {
                return res.status(404).json({ message: "Employee not found" });
            }

            // // Validate required fields (optional)
            // if (!firstName || !lastName || !email) {
            //     return res.status(400).json({ message: "First name, last name, and email are required" });
            // }

            // Update employee
            const updatedAdmin = await Admin.findByIdAndUpdate(
                id,
                {username, email, password },
                { new: true, runValidators: true } // Return updated doc & apply validation
            );

            // If update fails
            if (!updatedAdmin) {
                return res.status(500).json({ message: "Failed to update Admin" });
            }

            // Success response
            return res.status(200).json({
                message: "Admin updated successfully",
                updatedAdmin,
            });

        } catch (err) {
            console.error("Error updating employee:", err);
            return res.status(500).json({ message: "Internal server error", error: err.message });
        }
    },

    deleteAdmin: async (req,res)=>{
        console.log("agyi");
        
        const {username}= req.params;
        try {
            // Validate ID
            if (!username) {
                return res.status(400).json({ message: "no username in params" });
            }

            // Check if employee exists
            const existingAdmin = await Admin.findOne({username:username});
            if (!existingAdmin) {
                return res.status(404).json({ message: "Admin not found" });
            }

   // Soft delete (set isActive to false)
   const deletedAdmin = await Admin.findOneAndUpdate(
    { username },
    { $set: { isActive: false } }, // Fix here: update the field correctly
    { new: true } // Return the updated document
);

            if(!deletedAdmin){
                return res.status(401).json({message: "error in deleting Admin"})

            }

            return res.status(200).json({message: "admin  deleted successfully", deletedAdmin})
        }catch(err){
            console.log(err);
            
            return res.status(500).json({message: "internal server error"})
        }
        
    },

    

}

export default commontController;