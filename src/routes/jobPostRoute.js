const express = require('express');
const app = express.Router();
const jobPostController = require('../controllers/jobPostController')

// Get Jop Post
app.get("/", jobPostController.getJobPosts);
app.get("/:id", jobPostController.getJobPostById);
app.get("/title", jobPostController.getJobPostByTitle);
app.get("/company/:id",jobPostController.getJobPostByCompanyId);
app.get("/company/name",jobPostController.getJobPostByCompanyName);

// Job Posting
app.post("/",jobPostController.addJobPost);

// Update Post
app.put("/:id", jobPostController.updateJobPost);

// app.patch("/:id",memberController.editProduct);

// Delete Post
app.delete("/:id", jobPostController.deleteJobPost);

module.exports = app;