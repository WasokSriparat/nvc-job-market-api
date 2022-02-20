const Company = require("../models/companyModel");


exports.register = async (req, res) => {
    try {

        let company = new Company({
            name: req.body.companyName,
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