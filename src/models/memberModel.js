const mongoose = require("mongoose");
var uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;
const memberSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    profilePic:{
        data:Buffer,
        contentType:String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber:String,
    address:{
        houseNo:String,
        district:String,
        subDistrict:String,
        province:String,
        country:String,
        zipCode:String
    },
    birthDay:{
        type:Date,
        default: Date.now(),
        required: true
    },
    gender:{
        type:String,
        required: true
    },
    education:[{
        academy:String,
        qualification:String,
        department:String,
        gpa:String
    }],
    jobRegis:[{
        job_post_id:String,
        post_title:String,
        company_id:String,
        company_name:String,
        department:String,
        description:String,
        regisStatus:String,
        comment:String,
        regis_date:Date
    }],
    category:{
        type:String,
        default:"member"
    }
}, {
    timestamps: true,
});

memberSchema.methods.hashPassword = async (password) => {
    return await bcrypt.hashSync(password, 10);
}
memberSchema.methods.compareUserPassword = async (inputtedPassword, hashedPassword) => {
    return await bcrypt.compare(inputtedPassword, hashedPassword)
}
memberSchema.methods.generateJwtToken = async (payload, secret, expires) => {
    return jwt.sign(payload, secret, expires)
}
module.exports = mongoose.model("Member", memberSchema);
memberSchema.plugin(uniqueValidator, {
    message: '{PATH} Already in use'
});