const express = require('express');
const router = express.Router();
const validateStudent = require("../middleware/validateStudent");
const { Assignment } = require('../models/Assignment');
var fs = require('fs');
const { link } = require('joi');

router.get('/', validateStudent, async (req, res) => {
    // querrying the DB for the assigments having this user_id in their array
    let userAssignments = await Assignment.find({
        usernames: req.user.user_id
    })

    let links = []
    // iterating and pushing each file detalis in the files array
    for (let index = 0; index < userAssignments.length; index++) {
        const element = userAssignments[index];

        links.push({
            file_name: element.file_name,
            link: element.link
        })
    }

    res.status(200).send(links)
})

module.exports = router