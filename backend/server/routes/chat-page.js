const express = require('express');
const router = express.Router();
const path = require('path');
const verifyRoles = require('../middleware/verifyRoles');
const ROLES_LIST = require('../config/rolesList');

router.route('/')
    .get(verifyRoles(ROLES_LIST.User), (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'views', 'chat.html'))
    });

module.exports = router;