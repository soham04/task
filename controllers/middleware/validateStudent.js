const jwt = require("jsonwebtoken");

function validateStudent(req, res, next) {
    const token = req.headers["x-access-token"];
    if (!token) {
        return res.status(403).send("Authentication token not found");
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded;

    } catch (err) {
        return res.status(401).send("Authentication token invalid");
    }
    next()
};

module.exports = validateStudent;