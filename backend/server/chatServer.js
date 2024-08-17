const Server = require('socket.io').Server;
const Message = require('./models/Message');
const { format } = require('date-fns');

const ROLES_LIST = require('./config/rolesList');

let onlineUsers = [];
let typingUsers = new Set();

const getNumUsers = async () => {
    // const onlineUsers = await User.countDocuments({ online: true });
    const numOnline = new Set(onlineUsers).size;
    return numOnline;
}

const storeMessage = async (name, text, color) => {
    const newMessage = await Message.create({
        sender: name,
        datetime: `${format(new Date(), 'yyyMMdd\tHH:mm:ss')}`,
        message: text,
        color
    });
}

const chatServer = (server) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.NODE_ENV === "production" ? ['https://nyu-global-chat.onrender.com', 'https://nyuglobalchat.com'] : ['http://localhost:3000', 'http://127.0.0.1:3000']
        }
    });;

    io.on('connection', socket => {
        console.log(`User ${socket.id} connected`);

        setTimeout(async () => {
            io.emit('updateConnections', {
                count: await getNumUsers()
            });

            io.emit('displayMessages', {
                messages: (await Message.find({}, 'sender message color').sort({ $natural: -1 }).limit(50)).reverse()
            });
        }, 1500);

        socket.once('initializeUser', ({ name, roles }) => {
            socket.user = name
            socket.color = 0;
            if (roles.includes(ROLES_LIST.Admin)) {
                socket.color = 1;
            }
            onlineUsers.push(socket.user);
            console.log(onlineUsers);
        });

        socket.on('message', ({ name, text }) => {
            console.log(`${name}: ${text}`);
            storeMessage(name, text, socket.color);

            io.emit('message', {
                name,
                text,
                color: socket.color
            });
        });

        // sometimes bugged / shows typing when not typing
        // switching page before releasing prevents firing stop activity
        socket.on('activity', (name) => {
            const encoded = `${name}${socket.color}`;
            typingUsers.add(encoded);
            socket.broadcast.emit('updateActivity', Array.from(typingUsers));
        });

        socket.on('stopActivity', (name) => {
            const encoded = `${name}${socket.color}`;
            typingUsers.delete(encoded);
            socket.broadcast.emit('updateActivity', Array.from(typingUsers));
        });

        socket.on('disconnect', () => {
            console.log(`User ${socket.id} disconnected`);
            onlineUsers = onlineUsers.filter((user) => user !== socket.user);

            setTimeout(async () => {
                io.emit('updateConnections', {
                    count: await getNumUsers()
                });

                const encoded = `${socket.user}${socket.color}`;
                typingUsers.delete(encoded);
                io.emit('updateActivity', Array.from(typingUsers));
            }, 500);
        });
    });
}

module.exports = {
    chatServer
}