const express = require('express');
const router = express.Router();
const { Student, validate } = require('../models/Student')
const bcrypt = require("bcryptjs")
var fs = require('fs');
var path = require('path');
const formidable = require('formidable');

router.post('/', async (req, res) => {

    const form = formidable({ multiples: true });

    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.log(err);
        }
        // console.log(fields);
        // console.log(files);

        // Validating the body parameters with Joi schema
        const { error } = validate(req.body);
        // console.log(error);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }

        // console.log(files.photo.filepath)

        // Check if this user already exisits with given Email or Phone 
        let student1 = await Student.findOne({ email: fields.email });
        let student2 = await Student.findOne({ mobile: fields.mobile });

        if (student1) {
            return res.status(400).send('Student with the given email already exists');
        } else if (student2) {
            return res.status(400).send('Student with the given mobile already exists');
        }
        else {

            // Insert the new user

            // encrypting the password using Bycrypt
            bcrypt.genSalt(10, function (saltError, salt) {
                if (saltError) {
                    throw saltError
                } else {
                    bcrypt.hash(fields.password, salt, async function (hashError, hash) {
                        if (hashError) {
                            throw hashError
                        } else {

                            let student = new Student({
                                first_name: fields.first_name,
                                last_name: fields.last_name,
                                school_name: fields.school_name,
                                email: fields.email,
                                mobile: fields.mobile,
                                password: hash,
                                photo: {
                                    data: fs.readFileSync(path.join(files.photo.filepath)),
                                    contentType: 'image/png'
                                },
                            });

                            await student.save();

                            res.status(200).send("Student sccessfully registered");
                        }
                    })
                }
            })
        }
    })
})

module.exports = router