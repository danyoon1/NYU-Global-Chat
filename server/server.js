require('dotenv').config();
const express = require('express');
const app = express();
const Server = require('socket.io').Server;
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3500;

expressServer = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// set response header before cors to prevent error
app.use(credentials);

// cors configuration
app.use(cors(corsOptions));

// built in middleware for urlencoded data
app.use(express.urlencoded({extended: false}));

// built in middleware for json
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

// serve static files
app.use(express.static(path.join(__dirname, '/public')));

const io = new Server(expressServer, {
    cors: {
        origin: process.env.NODE_ENV === "production" ? false : []
    }
});

io.on('connection', socket => {

});