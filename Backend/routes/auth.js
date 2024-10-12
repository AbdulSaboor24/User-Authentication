const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchUser');

const JWT_SECRET = process.env.JWT_SECRET;

// Route 1: creating a user using POST "api/auth/createUser".
router.post('/createUser', [
    body('name', 'Enter a valid Name').isLength({ min: 1 }),
    body('email', 'Enter a valid Email').isEmail(),
    body('password', 'The Password should be at least 8 characters long').isLength({ min: 2 })
], async (req, res) => {
    console.log("Request Body:", req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        let userWithEmail = await User.findOne({ email: req.body.email });
        if (userWithEmail) {
            return res.status(400).json({ error: "User with this email already exists." });
        }
        
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);

        let user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
        });

        const data = {
            user: {
                id: user.id,
            },
        };

        const token = jwt.sign(data, JWT_SECRET, { expiresIn: '5h' });
        res.json({ token });

    } catch (error) {
        console.error(error.message);
        console.log("JWT_SECRET:", process.env.JWT_SECRET);
        console.error("Error during user creation:", error.message);
        res.status(500).send("Failed to create user");
    }
});

// Route 2: Authenticating a user using POST "api/auth/login".
router.post('/login', [
    body('email', 'Enter a valid Email').isEmail(),
    body('password', 'Password is required').exists()
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ error: "Invalid Credentials" });
        }

        const passCompare = await bcrypt.compare(password, user.password);
        if (!passCompare) {
            return res.status(400).json({ error: "Invalid Credentials" });
        }

        const data = {
            user: {
                id: user.id
            }
        };

        const token = jwt.sign(data, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });

    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Error Occurred");
    }
});

// Route 3: getting logged in user details POST "api/auth/getUser". login required
router.post('/getUser', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        // Fetch the user and exclude the password field
        const user = await User.findById(userId).select("-password");
        
        res.send(user);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Error Occurred");
    }
});

module.exports = router;