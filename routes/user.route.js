import { Router } from "express";
import {
  loginUser,
  logOut,
  registerUser,
} from "../controllers/user.controller.js";

const userroutes = Router();

userroutes.post("/register", registerUser);
userroutes.post("/login", loginUser);
userroutes.get("/logout", logOut);

export default userroutes;
