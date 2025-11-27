import { Router } from "express";
import {} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { singleUpload } from "../middleware/multer.js";
import {
  createBlog,
  deleteBlog,
  disLikeBlog,
  getMytotalBlogLikes,
  getOwnBlog,
  getPublishedBlog,
  likeBlog,
  publishToggleHandler,
  updateBlog,
} from "../controllers/blog.controller.js";

const blogRoutes = Router();

blogRoutes.post("/", isAuthenticated, createBlog);
blogRoutes.put("/:blogId", isAuthenticated, singleUpload, updateBlog);
blogRoutes.get("/get-own-blogs", isAuthenticated, getOwnBlog);
blogRoutes.delete("/delete/:id", isAuthenticated, deleteBlog);
blogRoutes.get("/:id/like", isAuthenticated, likeBlog);
blogRoutes.get("/:id/dislike", isAuthenticated, disLikeBlog);
blogRoutes.get("/my-blogs/likes", isAuthenticated, getMytotalBlogLikes);
blogRoutes.get("/get-published-blogs", getPublishedBlog);
blogRoutes.patch("/:blogId", publishToggleHandler);
export default blogRoutes;
