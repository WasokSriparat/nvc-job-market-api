const mongoose = require("mongoose");
var uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;
const companySchema = new Schema({
    name: {
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
    phoneNumber: {
        house: String,
        tel: String
    },
    description: String,
    address: {
        houseNo: String,
        district: String,
        subDistrict: String,
        province: String,
        country: String,
        zipCode: String
    },
    category: {
        type: String,
        default: "company"
    }
}, {
    timestamps: true,
});

companySchema.methods.hashPassword = async (password) => {
    return await bcrypt.hashSync(password, 10);
}
companySchema.methods.compareUserPassword = async (inputtedPassword, hashedPassword) => {
    return await bcrypt.compare(inputtedPassword, hashedPassword)
}
companySchema.methods.generateJwtToken = async (payload, secret, expires) => {
    return jwt.sign(payload, secret, expires)
}
module.exports = mongoose.model("Company", companySchema);
companySchema.plugin(uniqueValidator, {
    message: '{PATH} Already in use'
});