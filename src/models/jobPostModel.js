const mongoose = require("mongoose");
var uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;
const jobPostSchema = new Schema({

    company_id: {
        type: String,
        required: true
    },
    companyName: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    department: [String],
    position: [String],
    salaryMin: Number,
    salaryMax: Number,
    ageMin: Number,
    ageMax: Number,
    startDate: {
        type: Date,
        default: Date.now()
    },
    endDate: Date,
    applicants: [{
        member_id: {
            type: String,
            required: true
        },
        memberName: {
            type: String,
            required: true
        },
        position: {
            type: [String],
            required: true
        },
        description: String,
        resume: {
            data: Buffer,
            contentType: String
        },
        regisStatus: {
            type:String,
            default:"Not View"
        },
        message: [
            {
                messenger_id: String,
                name: String,
                content: String
            }
        ],
        applicantDate: {
            type: Date,
            default: Date.now()
        }
    }]

});
module.exports = mongoose.model("JobPost", jobPostSchema);
jobPostSchema.plugin(uniqueValidator, {
    message: '{PATH} Already in use'
});