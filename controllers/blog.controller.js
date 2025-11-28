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
    console.log("back");
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
      thumbnail: thumbnail?.secure_url,
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
      select: "firstName lastName photoUrl",
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

export const deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const authorId = req.id;
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }
    if (blog.author.toString() !== authorId) {
      return res.status(403).json({
        sucess: false,
        message: "Unauthorized to delete this blog",
      });
    }

    //Delete blog
    await Blog.findOneAndDelete(blogId);
    res.status(200).json({
      success: true,
      message: `${blog.title} deleted successfully`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting blog",
      error: error.message,
    });
  }
};

export const getPublishedBlog = async (__, res) => {
  try {
    const PublishedBlogs = await Blog.find({ isPublished: true })
      .sort({
        createdAt: -1,
      })
      .populate({ path: "author", select: "firstName lastName photoUrl" });

    if (!PublishedBlogs) {
      return res.status(404).json({
        success: false,
        message: "There is no blogs",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Successfully published your blogs",
      blogs: PublishedBlogs,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to get published blogs",
    });
  }
};

export const publishToggleHandler = async (req, res) => {
  try {
    const { blogId } = req.params;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // publish status based on query parameter
    blog.isPublished = !blog.isPublished;
    await blog.save();

    const statusMessage = blog.isPublished ? "Published" : "Unpublished";

    return res.status(200).json({
      success: true,
      message: `Blog is ${statusMessage}`,
      blog,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to get published blogs",
    });
  }
};
export const likeBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    console.log("BlogId:", blogId);
    const personWhoLiked = req.id;
    console.log("personWhoLiked: ", personWhoLiked);
    const blog = await Blog.findById(blogId).populate({ path: "likes" });

    if (!blog) {
      res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }
    await blog.updateOne({ $addToSet: { likes: personWhoLiked } });
    await blog.save();
    return res.status(200).json({
      success: true,
      message: "Blog Liked",
      blog,
    });
  } catch (error) {
    console.log(error);
  }
};
export const disLikeBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    console.log("BlogId:", blogId);
    const personWhoLiked = req.id;
    console.log("personWhoLiked: ", personWhoLiked);
    const blog = await Blog.findById(blogId);

    if (!blog) {
      res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }
    await blog.updateOne({ $pull: { likes: personWhoLiked } });
    await blog.save();
    return res.status(200).json({
      success: true,
      message: "Blog DissLiked",
      blog,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getMytotalBlogLikes = async (req, res) => {
  try {
    const userId = req.params.id;
    const myBlogs = await Blog.find({ author: userId }).select("likes");
    const totalLikes = myBlogs.reduce(
      (acc, blog) => acc + (blog.likes?.length || 0),
      0
    );

    return res.status(200).json({
      success: true,
      totalBlogs: myBlogs.length,
      totalLikes,
    });
  } catch (error) {
    console.log(error);
  }
};
