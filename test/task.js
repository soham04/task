const { expect } = require('chai')
let chai = require('chai')
let chaihttp = require('chai-http')
const { response } = require('express')
let server = require('../app')

// Assertion style 
chai.should()

chai.use(chaihttp)

let token

describe('Task API', () => {
    describe("POST /register", () => {

        it("It should register the Student", (done) => {
            chai.request(server)
                .post("/register")
                .field({
                    first_name: "Soham",
                    last_name: "Shinde",
                    school_name: "St. John High School",
                    email: "sohamshinde04@gmail.com",
                    mobile: "9819035520",
                    password: "mypassword",
                })
                .attach('photo', __dirname + "/sample-files/photo.jpg")
                .end((err, response) => {
                    expect(err).to.be.null;
                    expect(response).to.have.status(200);
                    done()
                })

        })

        it("Registering with the same email should status codde 400", (done) => {
            chai.request(server)
                .post("/register")
                .field({
                    first_name: "Soham",
                    last_name: "Shinde",
                    school_name: "St. John High School",
                    email: "sohamshinde04@gmail.com",
                    mobile: "8819035520",
                    password: "mypassword",
                })
                .attach('photo', __dirname + "/sample-files/photo.jpg")
                .end((err, response) => {
                    expect(err).to.be.null;
                    expect(response).to.have.status(400);
                    done()
                })

        })

        it("Registering with the same phone should status codde 400", (done) => {
            chai.request(server)
                .post("/register")
                .field({
                    first_name: "Soham",
                    last_name: "Shinde",
                    school_name: "St. John High School",
                    email: "soham04@gmail.com",
                    mobile: "9819035520",
                    password: "mypassword",
                })
                .attach('photo', __dirname + "/sample-files/photo.jpg")
                .end((err, response) => {
                    expect(err).to.be.null;
                    expect(response).to.have.status(400);
                    done()
                })

        })

        it("Registering with wrong email format(sohamshinde04@gmail) should status codde 400", (done) => {
            chai.request(server)
                .post("/register")
                .field({
                    first_name: "Soham",
                    last_name: "Shinde",
                    school_name: "St. John High School",
                    email: "sohamshinde04@gmail",
                    mobile: "9819035520",
                    password: "mypassword",
                })
                .attach('photo', __dirname + "/sample-files/photo.jpg")
                .end((err, response) => {
                    expect(err).to.be.null;
                    expect(response).to.have.status(400);
                    done()
                })

        })

        it("Registering with the wrong phone format(9819f35520) should status codde 400", (done) => {
            chai.request(server)
                .post("/register")
                .field({
                    first_name: "Soham",
                    last_name: "Shinde",
                    school_name: "St. John High School",
                    email: "sohamshinde04@gmail.com",
                    mobile: "9819f35520",
                    password: "mypassword",
                })
                .attach('photo', __dirname + "/sample-files/photo.jpg")
                .end((err, response) => {
                    expect(err).to.be.null;
                    expect(response).to.have.status(400);
                    done()
                })

        })

        it("Registering without lastname should status codde 400", (done) => {
            chai.request(server)
                .post("/register")
                .field({
                    first_name: "Soham",
                    school_name: "St. John High School",
                    email: "sohamshinde04@gmail.com",
                    mobile: "9819035520",
                    password: "mypassword",
                })
                .attach('photo', __dirname + "/sample-files/photo.jpg")
                .end((err, response) => {
                    expect(err).to.be.null;
                    expect(response).to.have.status(400);
                    done()
                })

        })


    })
    describe("POST /login", () => {
        it("Loging in with right username(9819035520) and password(mypassword) got status 200", (done) => {
            chai.request(server)
                .post("/login")
                .field({
                    username: "9819035520",
                    password: "mypassword",
                })
                .end((err, response) => {
                    expect(err).to.be.null;
                    expect(response).to.have.status(200);
                    // console.log(response.body);
                    token = response.body
                    done()
                })

        })
        it("Loging in without username or password got status 400", (done) => {
            chai.request(server)
                .post("/login")
                .field({
                    // username: "9819035520",
                    // password: "mypppassword",
                })
                .end((err, response) => {
                    expect(err).to.be.null;
                    expect(response).to.have.status(400);
                    done()
                })

        })
        it("Loging in with right username(9819035520) and wrong password(mypppassword) got status 400", (done) => {
            chai.request(server)
                .post("/login")
                .field({
                    username: "9819035520",
                    password: "mypppassword",
                })
                .end((err, response) => {
                    expect(err).to.be.null;
                    expect(response).to.have.status(400);
                    done()
                })

        })
        it("Loging in with wrong username(8819035520) and wrong password(mypassword) got status 400", (done) => {
            chai.request(server)
                .post("/login")
                .field({
                    username: "8819035520",
                    password: "mypassword",
                })
                .end((err, response) => {
                    expect(err).to.be.null;
                    expect(response).to.have.status(400);
                    done()
                })

        })

    })

    describe("POST /teacher", async () => {
        it("Teacher should be able to upload the assignments got status code 200", (done) => {
            new Promise(resolve => {
                chai.request(server)
                    .post("/teacher")
                    .field({
                        usernames: ['9819035520'],
                    })
                    .attach('files', __dirname + "/sample-files/Soham's Resume (13).pdf")
                    .end((err, response) => {
                        // expect(err).to.be.null;
                        // console.log(err);
                        expect(response).to.have.status(200);
                    })
                resolve()
            }).then(done)
        })

        it("Teacher should not be able to upload the assignments if  not attached got status code 400", (done) => {

            new Promise(resolve => {
                chai.request(server)
                    .post("/teacher")
                    .field({
                        usernames: ['9819035520'],
                    })
                    // .attach('files', __dirname + "/sample-files/Soham's Resume (13).pdf")
                    .end((err, response) => {
                        // expect(err).to.be.null;
                        // console.log(err);
                        expect(response).to.have.status(400);


                    })
                resolve()
            }
            ).then(done)
        })

        it("Teacher should not be able to upload the assignments if the file type not allowed for attached got status code 400", (done) => {
            new Promise(resolve => {
                chai.request(server)
                    .post("/teacher")
                    .field({
                        usernames: ['9819035520'],
                    })
                    .attach('files', __dirname + "/sample-files/app.exe")
                    .end((err, response) => {
                        // expect(err).to.be.null;
                        // console.log(err);
                        expect(response).to.have.status(400);
                    })
                resolve()
            }
            ).then(done)
        })

        it("Teacher should be not be able to upload the assignments with invalid uername(7738877919) got status code 400", (done) => {
            new Promise(resolve => {
                chai.request(server)
                    .post("/teacher")
                    .field({
                        usernames: ['9819035520', '7738877919'],
                    })
                    .attach('files', __dirname + "/sample-files/Soham's Resume (13).pdf")
                    .end((err, response) => {
                        expect(err).to.be.null;
                        expect(response).to.have.status(400);
                    })
                resolve()
            }
            ).then(done)
        })
    })

    describe("GET /assigment", () => {
        it("Getting assignments using the JWT token generated from Login got status 200", (done) => {
            // let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiOTgxOTAzNTUyMCIsImlhdCI6MTY1Njg1NTA5NywiZXhwIjoxNjU2ODU1MTU3fQ.dUD9sq8nmv6_8kgFWGDqhqGzckMA1zUAa7QH7t4VZ2Y"
            chai.request(server)
                .get("/assigment")
                .set("x-access-token", token)
                .end((err, response) => {
                    // expect(err).to.be.null;
                    expect(response).to.have.status(200);
                    done()
                })
        })

        it("Getting assignments using the JWT token generated expired got status 401", (done) => {
            let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiOTgxOTAzNTUyMCIsImlhdCI6MTY1Njg1NTA5NywiZXhwIjoxNjU2ODU1MTU3fQ.dUD9sq8nmv6_8kgFWGDqhqGzckMA1zUAa7QH7t4VZ2Y"
            chai.request(server)
                .get("/assigment")
                .set("x-access-token", token)
                .end((err, response) => {
                    // expect(err).to.be.null;
                    expect(response).to.have.status(401);
                    done()
                })
        })

        it("Getting assignments without the JWT token got status 403", (done) => {
            let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiOTgxOTAzNTUyMCIsImlhdCI6MTY1Njg1NTA5NywiZXhwIjoxNjU2ODU1MTU3fQ.dUD9sq8nmv6_8kgFWGDqhqGzckMA1zUAa7QH7t4VZ2Y"
            chai.request(server)
                .get("/assigment")
                // .set("x-access-token", token)
                .end((err, response) => {
                    // expect(err).to.be.null;
                    expect(response).to.have.status(403);
                    done()
                })
        })
    })

})
