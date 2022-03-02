const express = require('express');
const app = express.Router();
const jobPostController = require('../controllers/jobPostController')
const auth = require("../middleware/auth");

// Get Jop Post
app.get("/", jobPostController.getJobPosts);
app.get("/:id", jobPostController.getJobPostById);
app.get("/title/:title", jobPostController.getJobPostByTitle);
app.get("/company/:id",jobPostController.getJobPostByCompanyId);
app.get("/member/:id",jobPostController.getJobPostByMemberId);


// Job Posting
app.post("/",auth,jobPostController.addJobPost);

// Update Post
app.put("/:id",auth, jobPostController.updateJobPost);

// App Applicant
app.patch("/applicant/add/:id",auth,jobPostController.addApplicant);

// Update Status
app.patch("/update/status/:id",auth,jobPostController.updatePostStatus);
app.patch("/applicant/update/status/:id",auth,jobPostController.updateRegisStatus);

//
app.patch("/applicant/delete/:id",auth,jobPostController.deleteApplicant);

// Delete Post
app.delete("/:id",auth, jobPostController.deleteJobPost);

module.exports = app;