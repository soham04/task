const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const mongoose = require('mongoose');
require('dotenv').config()

// Conntecting to the MongoDB cluster
async function main() {
  mongoose.connect(process.env.MONGOCONNECT);
  console.log("Connected to mongoDB");
}
main().catch((err) => console.log("MongoDB cluster error : \n" + err));

// Registration route
app.use('/register', require("./routes/registration"))

// Login route
app.use('/login', require("./routes/login"))

// Teacher route
app.use('/teacher', require('./routes/teacher'))

// Assingment route
app.use('/assigment', require('./routes/assignment'))

// Error hanlder in any of the routes
app.use(function (req, res, next) {
  res.status(404);
  res.send({ error: 'Something went wrong' });
});

// Listening to the incomming requests on the assigned port
app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})

module.exports = app
