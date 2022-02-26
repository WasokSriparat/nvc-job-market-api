const Department = require("../models/departmentModel");

exports.getDepartments = async (req, res) => {

    Department.find().exec((err, result) => {
        res.status(200).json({
            msg: "ok",
            data: result
        })
    });

};

exports.getDepartmentById = async (req, res) => {

    Department.findById(req.params.id).exec((err, result) => {
        res.status(200).json({
            msg: "ok",
            data: result
        })
    });

};

exports.addDepartment = async (req, res) => {
    try {
        let department = new Department({
            name: req.body.name
        });
        let createdDepartment = await department.save();
        res.status(200).json({
            msg: "ok",
            data: createdDepartment
        })
    } catch (error) {
        res.status(500).json({
            error: error
        })
    }

};

exports.updateDepartment = async (req, res) => {
    let department = {
        name: req.body.name,
    };
    Department.findByIdAndUpdate(req.params.id, department)       //find by id first, then update the returned document
        .exec((err, result) => {
            Department.findById(req.params.id)
                .exec((err, result) => {
                    // return doc ที่แก้ไขแล้วกลับไป
                    res.status(200).json({
                        msg: "OK",
                        data: result
                    });
                });
        });
};

exports.deleteDepartment = async (req, res) => {

    Department.findByIdAndDelete(req.params.id)      
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
