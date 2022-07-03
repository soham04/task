const express = require('express');
const router = express.Router();
const formidable = require('formidable');
const { Student } = require('../models/Student')
const bcrypt = require("bcryptjs")
var jwt = require('jsonwebtoken');

router.post('/', async (req, res) => {

    const form = formidable({ multiples: true });

    form.parse(req, async (err, fields, files) => {

        // Validating given input
        if (!(fields.username && fields.password)) {
            return res.status(400).send("Username or Password empty")
        }

        Student.findOne({ mobile: fields.username }).then(student => {

            bcrypt.compare(fields.password, student.password, (err, result) => {
                if (err) {
                    console.log("Bycrypt Error : \n" + err);
                }
                if (result) {
                    // Create JWT token
                    const token = jwt.sign(
                        { user_id: fields.username },
                        process.env.JWT_SECRET_KEY,
                        {
                            expiresIn: 60,
                        }
                    );

                    // send JWT token 
                    return res.status(200).json(token);
                } else {
                    // response is OutgoingMessage object that server response http request
                    return res.status(400).send("Wrong password")
                }
            })
        }).catch(err => {
            // console.log(err);
            return res.status(400).send("Username not found")
        })

    })
})

module.exports = router