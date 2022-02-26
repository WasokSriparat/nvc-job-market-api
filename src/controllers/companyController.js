const Company = require("../models/companyModel");

exports.getCompanies = async (req,res) => {
    
    Company.find().exec((err,result) => {
        res.status(200).json({
            msg: "ok",
            data: result
        })
    });

};

exports.getCompanyById = async (req,res) => {
    
    Company.findById(req.params.id).exec((err,result) => {
        res.status(200).json({
            msg: "ok",
            data: result
        })
    });

};

exports.updateCompany = async (req, res) => {
    let company = {
        name: req.body.name,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        description: req.body.description,
    };
    Company.findByIdAndUpdate(req.params.id, company)       //find by id first, then update the returned document
        .exec((err, result) => {
            Company.findById(req.params.id)
                .exec((err, result) => {
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
    Company.findByIdAndUpdate(req.params.id, addressData)
        .exec((err, result) => {
            Company.findById(req.params.id)
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
    Company.updateOne(query,addressData).exec((err, result) => {
        Company.findById(req.params.id)
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

        let company = new Company({
            name: req.body.name,
            email: req.body.email,
        })
        company.password = await company.hashPassword(req.body.password);
        let createdCompany = await company.save();
        res.status(200).json({
            msg: "New Member created",
            data: createdCompany
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
        let company = await Company.findOne({
            email: login.email
        });
        // console.log(user);
        //check if user exit
        if (!company) {
            res.status(400).json({
                type: "Not Found",
                msg: "Wrong Login Details"
            })
        } else {
            let match = await company.compareUserPassword(login.password, company.password);
            if (match) {
                //ไม่เอา password ตอนส่งค่า
                company.password = null;

                let token = await company.generateJwtToken({
                    company
                }, "secret", {
                    expiresIn: 604800
                })

                if (token) {
                    res.status(200).json({
                        success: true,
                        token: token,
                        userCredentials: company
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

exports.deleteCompany = async (req, res) => {
    Company.findByIdAndDelete(req.params.id) 
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
