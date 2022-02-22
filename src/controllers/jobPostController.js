const JobPost = require("../models/jobPostModel");
const Company = require("../models/companyModel");

exports.getJobPosts = async (req, res) => {

    JobPost.find().exec((err, result) => {
        res.status(200).json({
            msg: "ok",
            data: result
        })
    });

};

exports.getJobPostById = async (req, res) => {

    getJobPosts.findById(req.params.id).exec((err, result) => {
        res.status(200).json({
            msg: "ok",
            data: result
        })
    });

};

exports.getJobPostByTitle = async (req, res) => {
    let psotTitle = req.body.title;
    JobPost.find({      //find product by a name field, using regular expression
        name: {
            $regex: new RegExp(psotTitle),
            $options: 'i'
        }
    })
        .exec((err, result) => {
            res.status(200).json({
                msg: "OK",
                data: result
            });
        });
};

exports.getJobPostByCompanyId = async (req, res) => {
    JobPost.find({
        company_id: req.params.id
    })
        .exec((err, result) => {
            res.status(200).json({
                msg: "OK",
                data: result
            });
        });
};

exports.getJobPostByCompanyName = async (req, res) => {
    JobPost.find({
        companyName: {
            $regex: new RegExp(req.body.companyName),
            $options: 'i'
        }
    })
        .exec((err, result) => {
            res.status(200).json({
                msg: "OK",
                data: result
            });
        });
};

exports.addJobPost = async (req, res) => {
    try {
        let jobPost = new JobPost({
            company_id: req.body.company_id,
            companyName: req.body.companyName,
            title: req.body.title,
            description: req.body.description,
            department: req.body.department,
            position: req.body.position,
            salaryMin: req.body.salaryMin,
            salaryMax: req.body.salaryMax,
            ageMin: req.body.ageMin,
            ageMax: req.body.ageMax,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
        })

        let createdJobPost = await jobPost.save();
        let jobPostData = {
            $push: {
                jobPostings:
                {
                    jobPost_id: createdJobPost._id,
                    title: createdJobPost.title,
                    description: createdJobPost.description,
                    department: createdJobPost.department,
                    position: createdJobPost.position,
                    postDate: createdJobPost.createdAt,
                }
            }
        }
        Company.findByIdAndUpdate(createdJobPost.company_id, jobPostData)
            .exec((err, result) => {
                Company.findById(createdJobPost.company_id)
                    .exec((err, result) => {
                        res.status(200).json({
                            msg: "Post Complete",
                            postData: createdJobPost,
                            data: result,
                        });
                    });
            });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: error
        });
    }
}

exports.updateJobPost = async (req, res) => {
    let jobPost = {
        title: req.body.title,
        description: req.body.description,
        department: req.body.department,
        position: req.body.position,
        salaryMin: req.body.salaryMin,
        salaryMax: req.body.salaryMax,
        ageMin: req.body.ageMin,
        ageMax: req.body.ageMax,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
    }
    JobPost.findByIdAndUpdate(req.params.id, jobPost)       //find by id first, then update the returned document
        .exec((err, result) => {
            JobPost.findById(req.params.id)
                .exec((err, updateResult) => {
                    let updatePostData = {
                        title: updateResult.title,
                        description: updateResult.description,
                        department: updateResult.department,
                        position: updateResult.position,
                    }
                    Company.updateOne(
                        {
                            _id: updateResult.company_id,
                            "jobPostings.jobPost_id": req.params.id
                        },
                        {
                            $set: {
                                "jobPostings.$.title": updateResult.title,
                                "jobPostings.$.description": updateResult.description,
                                "jobPostings.$.department": updateResult.department,
                                "jobPostings.$.position": updateResult.position,
                            }
                        }
                    ).exec((err, result) => {
                        Company.findById(updateResult.company_id).exec((err, result) => {
                            res.status(200).json({
                                msg: "OK",
                                postData: updateResult,
                                data: result,
                            });
                        })
                    })
                });
        });
};

exports.deleteJobPost = async (req, res) => {
    JobPost.findByIdAndDelete(req.params.id)        //find product by id, then delete
        .exec((err) => {
            if (err) {
                res.status(500).json({
                    msg: err
                });
            } else {
                res.status(200).json({
                    msg: "Delete complete"
                });
            }
        });
};
