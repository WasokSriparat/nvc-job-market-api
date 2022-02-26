const mongoose = require("mongoose");
var uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;
const departmentSchema = new Schema({
    name:{
        type:String,
        required:true
    }
})
module.exports = mongoose.model("Department", departmentSchema);
departmentSchema.plugin(uniqueValidator, {
    message: '{PATH} Already in use'
});