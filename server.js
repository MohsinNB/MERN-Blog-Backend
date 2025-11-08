import express from "express";
import dotenv from "dotenv";
import connectDB from "./database/db.js";
import userroutes from "./routes/user.route.js";
const app = express();
app.use(express.json());
app.use("/api/v1/user", userroutes);

//config
dotenv.config();
const PORT = process.env.PORT;
app.listen(PORT, () => {
  connectDB();
  console.log(`Server start at ${PORT}`);
});
