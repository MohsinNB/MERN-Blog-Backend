import { Blog } from "../models/blog.model.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";

export const createBlog = async (req, res) => {
  try {
    const { title, category } = req.body;
    if (!title || !category) {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }
    const blog = await Blog.create({
      title,
      category,
      author: req.id,
    });

    return res.status(201).json({
      success: true,
      blog,
      message: "Blog created successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "failed to create blog",
      error,
    });
  }
};
export const updateBlog = async (req, res) => {
  try {
    const blogId = req.params.blogId;
    const { title, subtitle, description, category } = req.body;
    const file = req.file;

    let blog = await Blog.findById(blogId);
    if (!blog) {
      res.status(404).json({
        message: "Blog not found",
        success: false,
      });
    }

    let thumbnail;
    if (file) {
      const fileUri = getDataUri(file);
      thumbnail = await cloudinary.uploader.upload(fileUri);
    }

    const updatedData = {
      title,
      subtitle,
      description,
      category,
      author: req.id,
      thumbnail: thumbnail.secure_url,
    };
    blog = await Blog.findByIdAndUpdate(blogId, updatedData, { new: true });
    return res.status(201).json({
      success: true,
      blog,
      message: "Blog updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "failed to update blog",
      error,
    });
  }
};

export const getOwnBlog = async (req, res) => {
  try {
    const userId = req.id;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "user not found",
      });
    }

    const blogs = await Blog.find({ author: userId }).populate({
      // Blog.find({ author: userId }) this line means, go to Blog ebong amake oi sobgula blog find kore dao jegular author === userId  hobe.
      path: "author",
      select: "fitstName lastName photoUrl",
    });
    if (!blogs) {
      return res.status(404).json({
        success: false,
        message: "No blogs found",
        blogs: [],
      });
    }
    return res.status(201).json({
      success: true,
      blogs,
      message: "Blog retrieved successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "failed to retreived blog",
      error,
    });
  }
};
