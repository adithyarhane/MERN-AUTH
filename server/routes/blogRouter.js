import express from "express";
import { createBlog } from "../controllers/blogController.js";

const blogRouter = express.Router();

blogRouter.route("/create-blog").post(createBlog);

export default blogRouter;
