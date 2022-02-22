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

exports.addPhoneNumber = async (req, res) => {
    let phoneData = {
        phoneNumber:req.body.phoneNumber
    };
    Member.findByIdAndUpdate(req.params.id, phoneData)
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
exports.updatePhoneNumber = async (req, res) => {
    let query = {_id: req.params.id};
    let phoneData = {
        $set: {
            phoneNumber:req.body.phoneNumber
        }
    }
    Member.updateOne(query,phoneData).exec((err, result) => {
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

exports.addDescription = async (req, res) => {
    let descriptionData = {
        description:req.body.description
    };
    Member.findByIdAndUpdate(req.params.id, descriptionData)
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
exports.updateDescription = async (req, res) => {
    let query = {_id: req.params.id};
    let descriptionData = {
        $set: {
            description:req.body.description
        }
    }
    Member.updateOne(query,descriptionData).exec((err, result) => {
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

exports.addAddress = async (req, res) => {
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
exports.updateAddress = async (req, res) => {
    let query = {_id: req.params.id};
    let addressData = {
        $set: {
            "address.houseNo":req.body.houseNo,
            "address.district":req.body.district,
            "address.subDistrict":req.body.subDistrict,
            "address.province":req.body.province,
            "address.country":req.body.country,
            "address.zipCode":req.body.zipCode,
        }
    }
    Member.updateOne(query,addressData).exec((err, result) => {
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
            education:
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
    let query = {_id: req.params.id, "education._id":req.body._id };
    let educationData = {
        $set: {
            "education.$.academy":req.body.academy,
            "education.$.qualification":req.body.qualification,
            "education.$.department":req.body.department,
            "education.$.gpa":req.body.gpa
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
                education: { _id : req.body._id }
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
