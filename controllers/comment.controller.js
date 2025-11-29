import { Blog } from "../models/blog.model.js";
import { Comment } from "../models/comment.model.js";

export const createComment = async (req, res) => {
  try {
    const blogId = req.params.id;
    const personWhoComment = req.id;

    const { content } = req.body;

    const blog = await Blog.findById(blogId);
    if (!content) {
      return res.status(400).json({
        success: false,
        message: "You must be write something to post your comment",
      });
    }
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }
    const comment = await Comment.create({
      content,
      userId: personWhoComment,
      postId: blogId,
    });

    await comment.populate({
      path: "userId",
      select: "firstName lastName photoUrl",
    });

    blog.comments.push(comment._id);
    await blog.save();
    return res.status(200).json({
      success: true,
      message: `your comment is posted on ${blog.title}`,
      comment,
    });
  } catch (error) {
    console.log("Error from backend create Comment: ", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong for creating comments",
      error: error.message,
    });
  }
};
export const getCommentsOfPost = async (req, res) => {
  try {
    const blogId = req.params.id;

    const comments = await Comment.find({ postId: blogId })
      .populate({
        path: "userId",
        select: "firstName lastName photUrl",
      })
      .sort({ createdAt: -1 });
    console.log("Comments from Backend comment controller: ", comments);

    if (!comments) {
      return res.status(404).json({
        success: false,
        message: "No comments found for this blog",
      });
    }

    return res.status(200).json({
      success: true,
      message: `All comments here`,
      comments,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong for getting comments",
      error: error.message,
    });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const authorId = req.id;

    const comment = await Comment.findById(commentId);
    const blogId = comment.postId;
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "No comments found",
      });
    }
    if (comment.userId.toString() !== authorId) {
      return res.status(403).json({
        success: false,
        message: "You can't delete others comments",
      });
    }
    // delete comment
    await Comment.findByIdAndDelete(commentId);
    // remove comment from blog's comment array
    await Blog.findOneAndUpdate(blogId, {
      $pull: { comments: commentId },
    });
    res.status(200).json({
      success: true,
      message: "comment deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong for deleting comments",
      error: error.message,
    });
  }
};
export const editComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const authorId = req.id;
    const { content } = req.body;
    const comment = await Comment.findById(commentId);
    const blogId = comment.postId;
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "No comments found",
      });
    }
    if (comment.userId.toString() !== authorId) {
      return res.status(403).json({
        success: false,
        message: "You can't edit others comments",
      });
    }
    // edit comment

    comment.content = content;
    comment.editedAt = new Date();
    await comment.save();
    res.status(200).json({
      success: true,
      message: "comment updated successfully",
      comment,
    });
  } catch (error) {
    console.log("Error from edit comment", error);
    return res.status(500).json({
      success: false,
      message: "Failed to edit comments",
      error: error.message,
    });
  }
};
export const likeComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const authorId = req.id;

    const comment = await Comment.findById(commentId).populate("userId");

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "No comments found",
      });
    }
    const alreadyLiked = comment.likes.includes(authorId);
    if (alreadyLiked) {
      // if already liked, unlike it
      comment.likes = comment.likes.filter((uId) => uId !== authorId);
      comment.numberOfLikes -= 1;
    } else {
      comment.likes.push(authorId);
      comment.numberOfLikes += 1;
    }

    await comment.save();
    res.status(200).json({
      success: true,
      message: alreadyLiked ? "Commetn unliked" : "Comment liked",
      updatedComment: comment,
    });
  } catch (error) {
    console.log("Error from edit comment", error);
    return res.status(500).json({
      success: false,
      message: "Error while like comments",
      error: error.message,
    });
  }
};
export const getAllCommentsOnMyBlogs = async (req, res) => {
  try {
    const userId = req.id;
    // get all blogs created by me
    const myBlogs = await Blog.find({ author: userId }).select("_id");
    const blogIds = myBlogs.map((blog) => blog._id);
    if (blogIds.length === 0) {
      return res.status(200).json({
        success: true,
        totalComments: 0,
        comments: [],
        message: "No blogs found for this user",
      });
    }
    const comments = await Comment.find({ postId: { $in: blogIds } }) //postId: { $in: blogIds } er mane hocche, puro comment model er upor ekta find chalao. jokhon kuno comment er postId(je comment koreche sei user) uporer blogIds array er jekuno ekta value er under e blog er postId er sathe milbe, tokhon e oitake return koro. ** eta oi comment take return korbe **
      .populate("userId", "firstName lastName email")
      .populate("postId", "title");
    // er pore ami comment er upor populate chaliye userId er under er user er data gula ar blog/postId er under er data/title ta peye jabo.
    return res.status(200).json({
      success: true,
      totalComments: comments.length,
      comments,
    });
  } catch (error) {
    console.log("Error from backend get All comments", error);
  }
};
