const mongoose = require("mongoose");
const Joi = require('joi');
const { required } = require("joi");
// const joi = require("@hapi/joi");


const Assignment = mongoose.model("assignment", new mongoose.Schema({

    link: {
        type: String,
        required: true
    },
    file_name: {
        type: String,
        required: true
    },
    usernames: [{
        type: String,
        required: true
    }]

}));


exports.Assignment = Assignment;
// exports.validateAssignment = validateAssignment
