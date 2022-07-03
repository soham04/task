const mongoose = require("mongoose");
const Joi = require('joi');

const Student = mongoose.model("student", new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    school_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
        minLength: 10,
        maxLength: 10
    },
    password: {
        type: String,
        required: true
    },
    photo: {
        data: Buffer,
        contentType: String,
    }
}));

function validateStudent(body) {
    const schema = Joi.object({
        first_name: Joi.string().alphanum().required(),
        last_name: Joi.string().alphanum().required(),
        school_name: Joi.string().required(),
        email: Joi.string().required().email(),
        mobile: Joi.string().max(10).min(10).required().regex(/^\d+$/).messages(
            {
                'string.pattern.base': "Invalid Mobile number"
            }
        ),
        password: Joi.string().required(),
    })

    return schema.validate(body)
}

exports.Student = Student;
exports.validate = validateStudent
