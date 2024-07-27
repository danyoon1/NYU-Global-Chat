const User = require('../models/User');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const {user, pwd} = req.body;
    if (!user || !pwd) {
        return res.status(400).json({'message': 'username and password are required'});
    }

    // check for duplicate usernames in the db
    const duplicate = await User.findOne({username: user}).exec();
    if (duplicate) {
        return res.sendStatus(409); // conflict
    }

    try {
        // encrypt password
        const hashedPwd = await bcrypt.hash(pwd, 10);

        // create and store new user
        const newUser = await User.create({
            "username": user,
            "password": hashedPwd
        })

        res.status(201).json({'success': `new user ${user} created`});
    } catch (err) {
        res.status(500).json({'message': err.message});
    }
}

module.exports = {handleNewUser}