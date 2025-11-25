import { Router } from "express";
import {} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { singleUpload } from "../middleware/multer.js";
import {
  createBlog,
  deleteBlog,
  getOwnBlog,
  updateBlog,
} from "../controllers/blog.controller.js";

const blogRoutes = Router();

blogRoutes.post("/", isAuthenticated, createBlog);
blogRoutes.put("/:blogId", isAuthenticated, singleUpload, updateBlog);
blogRoutes.get("/get-own-blogs", isAuthenticated, getOwnBlog);
blogRoutes.delete("/delete/:id", isAuthenticated, deleteBlog);
export default blogRoutes;
