import { Router } from "express";
import {} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";

import { createBlog } from "../controllers/blog.controller.js";

const blogRoutes = Router();

blogRoutes.post("/", isAuthenticated, createBlog);
export default blogRoutes;
