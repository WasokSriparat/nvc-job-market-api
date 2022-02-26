const Position = require("../models/positionModel");

exports.getPositions = async (req, res) => {

    Position.find().exec((err, result) => {
        res.status(200).json({
            msg: "ok",
            data: result
        })
    });

};

exports.getPositionById = async (req, res) => {

    Position.findById(req.params.id).exec((err, result) => {
        res.status(200).json({
            msg: "ok",
            data: result
        })
    });

};

exports.addPosition = async (req, res) => {
    try {
        let position = new Position({
            name: req.body.name
        });
        let createdPosition = await position.save();
        res.status(200).json({
            msg: "ok",
            data: createdPosition
        })
    } catch (error) {
        res.status(500).json({
            error: error
        })
    }

};

exports.updatePosition = async (req, res) => {
    let position = {
        name: req.body.name,
    };
    Position.findByIdAndUpdate(req.params.id, position)       //find by id first, then update the returned document
        .exec((err, result) => {
            Position.findById(req.params.id)
                .exec((err, result) => {
                    // return doc ที่แก้ไขแล้วกลับไป
                    res.status(200).json({
                        msg: "OK",
                        data: result
                    });
                });
        });
};

exports.deletePosition = async (req, res) => {

    Position.findByIdAndDelete(req.params.id)      
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
