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
    profilePic: {
        type: String,
        default: ""
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
    phoneNumber: String,
    description: String,
    address: {
        houseNo: String,
        district: String,
        subDistrict: String,
        province: String,
        country: String,
        zipCode: String
    },
    birthDay: {
        type: Date,
        default: Date.now(),
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    educations: [{
        academy: String,
        qualification: String,
        department: String,
        gpa: String
    }],
    category: {
        type: String,
        default: "member"
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