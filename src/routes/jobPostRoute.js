const express = require('express');
const app = express.Router();
const jobPostController = require('../controllers/jobPostController')

// Get Jop Post
app.get("/", jobPostController.getJobPosts);
app.get("/:id", jobPostController.getJobPostById);
app.get("/title/:title", jobPostController.getJobPostByTitle);
app.get("/company/:id",jobPostController.getJobPostByCompanyId);
// app.get("/company/name/",jobPostController.getJobPostByCompanyName);

// Job Posting
app.post("/",jobPostController.addJobPost);

// Update Post
app.put("/:id", jobPostController.updateJobPost);

// App Applicant
app.patch("/applicant/add/:id",jobPostController.addApplicant);

// Update Status
app.patch("/update/status/:id",jobPostController.updatePostStatus);
app.patch("/applicant/update/status/:id",jobPostController.updateRegisStatus);

// Delete Post
app.delete("/:id", jobPostController.deleteJobPost);

module.exports = app;