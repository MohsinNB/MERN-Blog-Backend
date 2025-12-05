import express from "express";
import dotenv from "dotenv";
import connectDB from "./database/db.js";
import userroutes from "./routes/user.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import blogRoutes from "./routes/blog.routes.js";
import commentroutes from "./routes/comment.route.js";
dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "https://mernblogfrontend-lyart.vercel.app",
    credentials: true,
  })
);
app.use("/api/v1/user", userroutes);
app.use("/api/v1/blog", blogRoutes);
app.use("/api/v1/comment", commentroutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  connectDB();
  console.log(`Server start at ${PORT}`);
});
