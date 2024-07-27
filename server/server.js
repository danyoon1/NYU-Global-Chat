require('dotenv').config();
const express = require('express');
const app = express();
const Server = require('socket.io').Server;
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const PORT = process.env.PORT || 3500;

// connect to MongoDB
connectDB();

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
});

const expressServer = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});;

const io = new Server(expressServer, {
    cors: {
        origin: process.env.NODE_ENV === "production" ? false : []
    }
});;

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

io.on('connection', socket => {
    
});