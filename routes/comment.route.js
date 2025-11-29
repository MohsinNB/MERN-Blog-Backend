import { Router } from "express";

import { isAuthenticated } from "../middleware/isAuthenticated.js";

import {
  createComment,
  deleteComment,
  editComment,
  getAllCommentsOnMyBlogs,
  getCommentsOfPost,
  likeComment,
} from "../controllers/comment.controller.js";

const commentroutes = Router();

commentroutes.post("/:id/create", isAuthenticated, createComment);
commentroutes.delete("/:id/delete", isAuthenticated, deleteComment);
commentroutes.put("/:id/edit", isAuthenticated, editComment);
commentroutes.get("/:id/all", getCommentsOfPost);
commentroutes.get("/:id/like", isAuthenticated, likeComment);
commentroutes.get(
  "/my-blogs/comments",
  isAuthenticated,
  getAllCommentsOnMyBlogs
);
export default commentroutes;
