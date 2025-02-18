require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');

// Apply some basic security headers
app.use(helmet());

// Limit repeated requests to public APIs
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(express.json());

const mongoURL = process.env.MONGODB_URI;

mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log("Database connected");
})
.catch((e) => {
    console.log("Database connection error", e);
});

require('./MongoDB/UserDetails');
const User = mongoose.model("UserInfo");

app.get("/", (req, res) => {
    res.send({ status: "Started" });
});

app.post('/register', async (req, res) => {
    const { name, email, username, password } = req.body;

    const emailExists = await User.findOne({ email });
    if (emailExists) {
        return res.status(409).send({ status: "error", error: "Email already exists" });
    }

    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
        return res.status(409).send({ status: "error", error: "Username already exists" });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);
    try {
        const user = await User.create({
            name: name,
            email: email,
            username: username,
            password: encryptedPassword,
        });
        res.send({ status: "ok", data: "User Created" });
    } catch (error) {
        res.status(500).send({ status: "error", data: error });
    }
});

// Login endpoint
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (user && await bcrypt.compare(password, user.password)) {
        // Create token
        const token = jwt.sign(
            { user_id: user._id, username },
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );
        res.status(200).json({ data: "Login successful", token });
    } else {
        res.status(400).send({ data: "Invalid Credentials" });
    }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server has started on port ${PORT}`);
});
