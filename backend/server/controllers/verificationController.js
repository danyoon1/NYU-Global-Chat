const User = require('../models/User');
const jwt = require('jsonwebtoken');

const handleVerification = async (req, res) => {
    const foundUser = await User.findOne({ username: req.body.username }).exec();

    jwt.verify(
        req.body.emailToken,
        process.env.EMAIL_TOKEN_SECRET,
        async (err, decoded) => {
            if (err) {
                console.error(err);
                return res.sendStatus(403); // forbidden
            }

            foundUser.verified = true;
            const result = await foundUser.save();
            return res.status(201).json({ 'success': 'email verified' }); // success
        }
    )
}

module.exports = { handleVerification }