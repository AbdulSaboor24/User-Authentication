const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

const fetchuser = (req, res, next) => {
    const token = req.header('Authorization') && req.header('Authorization').replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).send({ message: "Please authenticate using a valid token." });
    }

    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();
    } catch (error){
        return res.status(401).send({ message: "Please authenticate using a valid token." });
    }
};

module.exports = fetchuser;