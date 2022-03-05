const JobPost = require("../models/jobPostModel");
const Company = require("../models/companyModel");
const Member = require("../models/memberModel");

exports.getJobPosts = async (req, res) => {

    JobPost.find().sort({ createdAt: -1 }).exec((err, result) => {
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
    }).sort({ createdAt: -1 })
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
    }).sort({ createdAt: -1 })
        .exec((err, result) => {
            res.status(200).json({
                msg: "OK",
                data: result
            });
        });
};

exports.getJobPostByMemberId = async (req, res) => {
    JobPost.find(
        {
            applicants:{
                $elemMatch:{
                    member_id:req.params.id
                }
            }
        }
    ).sort({ "applicants.regisDate" : -1 }).exec((err, result) => {
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
        JobPost.find()
            .exec((err, result) => {
                res.status(200).json({
                    msg: "Post Complete",
                    data: result,
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
            JobPost.find()
                .exec((err, result) => {
                    res.status(200).json({
                        msg: "OK",
                        data: result,
                    });
                });
        });
};

exports.addApplicant = async (req, res) => {
    let applicantData = {
        $push: {
            applicants: {
                member_id: req.body.member_id,
                memberName: req.body.memberName,
                description: req.body.description
            }
        }
    }
    JobPost.findByIdAndUpdate(req.params.id, applicantData)
        .exec((err, result) => {
            JobPost.findById(req.params.id)
                .exec((err, result) => {
                    res.status(200).json({
                        msg: "Apply Complete",
                        data: result,
                    });
                });
        })

}

exports.updatePostStatus = async (req, res) => {

    let status = Boolean;

    JobPost.findById(req.params.id).exec((err, result) => {
        let postData = result;
        if (postData.postStatus) {
            status = false;
        } else {
            status = true;
        }

        JobPost.updateOne(
            {
                _id: req.params.id
            },
            {
                $set: { postStatus: status }
            }
        ).exec((err, result) => {
            JobPost.findById(req.params.id).exec((err, result) => {
                res.status(200).json({
                    msg: "OK",
                    data: result,
                });
            })
        })

    })

}

exports.updateRegisStatus = async (req, res) => {
    JobPost.updateOne(
        {
            _id: req.params.id,
            "applicants._id": req.body.applicant_id
        },
        {
            $set: { "applicants.$.regisStatus": req.body.status }
        }
    ).exec((err, result) => {
        JobPost.findById(req.params.id).exec((err, result) => {
            res.status(200).json({
                msg: "OK",
                data: result,
            });
        })
    })
}

exports.deleteApplicant = async (req, res) => {
    JobPost.updateOne(
        {
            _id: req.params.id
        },{
            $pull: {
                applicants: { _id : req.body.applicant_id }
            }
        }
    ).exec((err, result) => {
        JobPost.findById(req.params.id)
            .exec((err, result) => {
                // return doc ที่แก้ไขแล้วกลับไป
                res.status(200).json({
                    msg: "OK",
                    data: result
                });
            });
    });
        
};

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
