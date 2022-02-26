const Member = require("../models/memberModel");

exports.getMembers = async (req,res) => {
    
    Member.find().exec((err,result) => {
        res.status(200).json({
            msg: "ok",
            data: result
        })
    });

};

exports.getMemberById = async (req,res) => {
    
    Member.findById(req.params.id).exec((err,result) => {
        res.status(200).json({
            msg: "ok",
            data: result
        })
    });

};

exports.updateMember = async (req, res) => {
    let member = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        birthDay: req.body.birthDay,
        description: req.body.description,
    };
    Member.findByIdAndUpdate(req.params.id, member)       //find by id first, then update the returned document
        .exec((err, result) => {
            Member.findById(req.params.id)
                .exec((err, result) => {
                    res.status(200).json({
                        msg: "OK",
                        data: result
                    });
                });
        });
};

exports.updateAddress = async (req, res) => {
    let addressData = {
        address:
            {
                houseNo:req.body.houseNo,
                district:req.body.district,
                subDistrict:req.body.subDistrict,
                province:req.body.province,
                country:req.body.country,
                zipCode:req.body.zipCode
            }
    };
    Member.findByIdAndUpdate(req.params.id, addressData)
        .exec((err, result) => {
            Member.findById(req.params.id)
                .exec((err, result) => {
                    // return doc ที่แก้ไขแล้วกลับไป
                    res.status(200).json({
                        msg: "OK",
                        data: result
                    });
                });
        });
};

exports.addEducation = async (req, res) => {
    let educationData = {
        $push: {
            educations:
            {
                academy:req.body.academy,
                qualification:req.body.qualification,
                department:req.body.department,
                gpa:req.body.gpa
            }
        }
    };
    Member.findByIdAndUpdate(req.params.id, educationData)
        .exec((err, result) => {
            Member.findById(req.params.id)
                .exec((err, result) => {
                    // return doc ที่แก้ไขแล้วกลับไป
                    res.status(200).json({
                        msg: "OK",
                        data: result
                    });
                });
        });
};

exports.updateEducation = async (req, res) => {
    let query = {_id: req.params.id, "educations._id":req.body._id };
    let educationData = {
        $set: {
            "educations.$.academy":req.body.academy,
            "educations.$.qualification":req.body.qualification,
            "educations.$.department":req.body.department,
            "educations.$.gpa":req.body.gpa
        }
    }
    Member.updateOne(query,educationData).exec((err, result) => {
        Member.findById(req.params.id)
            .exec((err, result) => {
                // return doc ที่แก้ไขแล้วกลับไป
                res.status(200).json({
                    msg: "OK",
                    data: result
                });
            });
    });
        
};

exports.deleteEducation = async (req, res) => {
    Member.updateOne(
        {
            _id: req.params.id
        },{
            $pull: {
                educations: { _id : req.body._id }
            }
        }
    ).exec((err, result) => {
        Member.findById(req.params.id)
            .exec((err, result) => {
                // return doc ที่แก้ไขแล้วกลับไป
                res.status(200).json({
                    msg: "OK",
                    data: result
                });
            });
    });
        
};

exports.register = async (req, res) => {
    try {

        let member = new Member({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            birthDay: req.body.birthDay,
            gender: req.body.gender,
        })
        member.password = await member.hashPassword(req.body.password);
        let createdMember = await member.save();
        res.status(200).json({
            msg: "New Member created",
            data: createdMember
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: err
        })
    }
};

exports.login = async (req, res) => {
    const login = {
        email: req.body.email,
        password: req.body.password
    }
    // console.log(login)
    try {
        let member = await Member.findOne({
            email: login.email
        });
        // console.log(user);
        //check if user exit
        if (!member) {
            res.status(400).json({
                type: "Not Found",
                msg: "Wrong Login Details"
            })
        } else {
            let match = await member.compareUserPassword(login.password, member.password);
            if (match) {
                //ไม่เอา password ตอนส่งค่า
                member.password = null;

                let token = await member.generateJwtToken({
                    member
                }, "secret", {
                    expiresIn: 604800
                })

                if (token) {
                    res.status(200).json({
                        success: true,
                        token: token,
                        userCredentials: member
                    })
                }
            } else {
                res.status(400).json({
                    type: "Not Found",
                    msg: "Wrong Login Details"
                })
            }
        }


    } catch (err) {
        console.log(err)
        res.status(500).json({
            type: "Something Went Wrong",
            msg: err
        })
    }
};

exports.deleteMember = async (req, res) => {
    Member.findByIdAndDelete(req.params.id) 
        .exec((err)=>{
            if(err){
                res.status(500).json({
                    msg: err
                });
            } else{
                res.status(200).json({
                    msg: "Delete complete"
                });
            }
        });
};
