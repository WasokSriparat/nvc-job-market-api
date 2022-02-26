const JobPost = require("../models/jobPostModel");
const Company = require("../models/companyModel");
const Member = require("../models/memberModel");

exports.getJobPosts = async (req, res) => {

    JobPost.find().sort({createdAt:-1}).exec((err, result) => {
        res.status(200).json({
            msg: "ok",
            data: result
        })
    });

};

exports.getJobPostById = async (req, res) => {

    JobPost.findById(req.params.id).exec((err, result) => {
        res.status(200).json({
            msg: "ok",
            data: result
        })
    });

};

exports.getJobPostByTitle = async (req, res) => {
    let psotTitle = req.params.title;
    JobPost.find({
        title: {
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
                        departments: updateResult.department,
                        positions: updateResult.position,
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
                                "jobPostings.$.departments": updateResult.department,
                                "jobPostings.$.positions": updateResult.position,
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

exports.addApplicant = async (req,res) => {
    let applicantData = {
        $push:{
            applicants:{
                member_id: req.body.member_id,
                memberName: req.body.memberName,
                positions: req.body.position,
                description: req.body.description,
                resume: req.body.resume
            }
        }
    }
    JobPost.findByIdAndUpdate(req.params.id,applicantData)
        .exec((err,result)=>{
            JobPost.findById(req.params.id)
            .exec((err,jobPostResult)=>{
                let postRegisData = {
                    $push:{
                        jobRegises:{
                            jobPost_id: req.params.id,
                            title: jobPostResult.title,
                            company_id: jobPostResult.company_id,
                            companyName: jobPostResult.companyName,
                            departments: jobPostResult.department,
                            positions: jobPostResult.position,
                            description: jobPostResult.description
                        }
                    }
                }
                Member.findByIdAndUpdate(req.body.member_id,postRegisData)
                    .exec((err,result)=>{
                        Member.findById(req.body.member_id)
                        .exec((err,result)=>{
                            res.status(200).json({
                                msg: "OK",
                                postData: jobPostResult,
                                data: result,
                            });
                        })
                    })
            })
        })

}

exports.updatePostStatus = async (req,res) => {

    let status = Boolean;

    jobPost.findById(req.params.id).exec((err,result)=>{
        let postData = result.data;
        if(postData.postStatus){
            status = false;
        }else{
            status = true;
        }

        jobPost.updateOne(
            {
                _id:req.params.id
            },
            {
                $set:{postStatus:status}
            }
        ).exec((err,result)=>{
            JobPost.findById(req.params.id).exec((err,result)=>{
                res.status(200).json({
                    msg: "OK",
                    data: result,
                });
            })
        })
        
    })
   
}

exports.updateRegisStatus = async (req,res) =>{
    JobPost.updateOne(
        {
            _id:req.params.id,
            "applicants._id":req.body.applicant_id
        },
        {
            $set:{"applicants.$.regisStatus":req.body.status}
        }
    ).exec((err,result)=>{
        JobPost.findById(req.params.id).exec((err,postResult)=>{
            Member.updateOne(
                {
                    _id:req.body.member_id,
                    "jobRegises.jobPost_id":req.params.id
                },
                {
                    $set:{"jobRegises.$.regisStatus":req.body.status}
                }
            ).exec((err,result)=>{
                Member.findById(req.body.member_id).exec((err,result)=>{
                    res.status(200).json({
                        msg: "OK",
                        postData: postResult,
                        data: result,
                    });
                })
            })
        })
    })
}

exports.deleteJobPost = async (req, res) => {
    JobPost.findByIdAndDelete(req.params.id)
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
