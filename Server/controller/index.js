import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {dotenvVar }from "../config.js";

const authEssentials = {
  createHash: async (password, salt) => {
    
    const SALT= Number(salt)
    return await bcrypt.hash(password, SALT);
  },

  createToken: (payload) => {
    return jwt.sign(payload, dotenvVar.JWT_SECRET, { expiresIn: "1d" });
  },

  // createRefreshToken :(payload)=>{
  //  return jwt.sign(payload, dotenvVar.REFRESH_SECRET, {expiresIn: "7d"})
  // },

  verifyPassword: async (usergiven, existpassword) => {
    return await bcrypt.compare(usergiven, existpassword);
  },

  verifyToken: (token) => {
    try {
      return jwt.verify(token, dotenvVar.JWT_SECRET);
    } catch (err) {
      return null; // Return `null` if the token is invalid
    }
  },
};

export default authEssentials;
