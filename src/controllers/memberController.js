const Member = require("../models/memberModel");


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