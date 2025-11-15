import { Router } from "express";
import {
  loginUser,
  logOut,
  registerUser,
  updateProfile,
} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { singleUpload } from "../middleware/multer.js";

const userroutes = Router();

userroutes.post("/register", registerUser);
userroutes.post("/login", loginUser);
userroutes.get("/logout", logOut);
userroutes.put("/profile/update", isAuthenticated, singleUpload, updateProfile);
export default userroutes;
