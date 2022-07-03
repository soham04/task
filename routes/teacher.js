const express = require('express');
const router = express.Router();
const { Assignment } = require('../models/Assignment')
const formidable = require('formidable');
const { Student } = require('../models/Student');
const myGoogleAPI = require("../google-api/api-upper-layer")

router.post('/', async (req, res) => {

    const form = formidable({ multiples: true });

    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.log(err);
        }
        // console.log(fields);
        // console.log(files.files);

        // Validating the type of files
        if (files.files) {
            for (let fileNum = 0; fileNum < files.files.length; fileNum++) {
                var fileType = files.files[fileNum].mimetype;
                // console.log(fileType);
                if (!(fileType == "application/msword" || fileType == "application/pdf" || fileType == "application/vnd.ms-powerpoint" || fileType == "application/vnd.ms-powerpoint" || fileType == "application/vnd.ms-powerpoint")) {
                    res.status(400).send("Invalid file Type, allowed file types Images/PDF/Word File/ PPT")
                    return
                }
            }
        } else {
            return res.status(400).send("Files not present")
        }

        // Validating the enterd usernames
        if (fields.usernames) {
            // validating the given user names
            // console.log("Username : ");
            fields.usernames.forEach(element => {
                Student.countDocuments({ mobile: element }, function (err, count) {
                    // console.log(element + " " + count);
                    if (count == 0) {
                        return res.status(400).send("Invalid Username " + element)
                    }
                });
            });
        }

        // Inserting files and the usernames against them in DB

        // the problem with fomidable is it returns single object 
        // if only 1 file is uploaded and an array if more than 1 file is uploaded
        // so first making the single object an array too

        // console.log(Array.isArray(files.files));
        if (!Array.isArray(files.files)) {
            files.files = [files.files]
        }
        // console.log(Array.isArray(files.files));
        let usernames = fields.usernames;
        try {
            for (let fileNum = 0; fileNum < files.files.length; fileNum++) {

                let id = await myGoogleAPI.uploadToFolder(files.files[fileNum].originalFilename, "application/octet-stream", files.files[fileNum].filepath, process.env.FOLDER_ID)

                let assignment = new Assignment({
                    // Uploading files to Google Drive
                    link: "https://drive.google.com/file/d/" + id + "/view",
                    file_name: files.files[fileNum].originalFilename,
                    usernames: usernames,
                });
                await assignment.save();
            }
            res.status(200).send("Done uploading assignments")
        } catch (error) {
            res.status(400).send("Error uploading assignments \n" + error)
            return
        }
    })
})

module.exports = router