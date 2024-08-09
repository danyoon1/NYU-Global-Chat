require('dotenv').config();
const express = require('express');
const app = express();
const Server = require('socket.io').Server;
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
const verifyJWT = require('./middleware/verifyJWT');
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
        origin: process.env.NODE_ENV === "production" ? false : ['http://localhost:3000', 'http://127.0.0.1:3000']
    }
});;

// set response header before cors to prevent error
app.use(credentials);

// cors configuration
app.use(cors(corsOptions));

// built in middleware for urlencoded data
app.use(express.urlencoded({ extended: false }));

// built in middleware for json
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

// serve static files
app.use(express.static(path.join(__dirname, '/public')));

// ROUTES
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));

// protected backend routes
app.use(verifyJWT);
app.use('/users', require('./routes/api/users'));

// fallback 404
app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ error: '404 not found' });
    } else {
        res.type('txt').send('404 not found');
    }
});

/* ------------------------------------------------------- */

// chat app server
io.on('connection', socket => {
    console.log(`User ${socket.id} connected`);

    socket.on('message', ({ name, text }) => {
        console.log('message received');

        io.emit('message', {
            name: 'server',
            text: 'server message'
        });
    });

    socket.on('disconnect', () => {
        console.log(`User ${socket.id} disconneted`);
    });
});