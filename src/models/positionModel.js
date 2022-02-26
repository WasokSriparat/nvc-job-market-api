const mongoose = require("mongoose");
var uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;
const positionSchema = new Schema({
    name:{
        type:String,
        required:true
    }
})
module.exports = mongoose.model("Position", positionSchema);
positionSchema.plugin(uniqueValidator, {
    message: '{PATH} Already in use'
});