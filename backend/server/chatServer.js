const Server = require('socket.io').Server;
const Message = require('./models/Message');
const { format } = require('date-fns');

let onlineUsers = [];
let typingUsers = new Set();

const getNumUsers = async () => {
    // const onlineUsers = await User.countDocuments({ online: true });
    const numOnline = new Set(onlineUsers).size;
    return numOnline;
}

const storeMessage = async (name, text) => {
    const newMessage = await Message.create({
        sender: name,
        datetime: `${format(new Date(), 'yyyMMdd\tHH:mm:ss')}`,
        message: text
    });
}

const chatServer = (server) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.NODE_ENV === "production" ? false : ['http://localhost:3000', 'http://127.0.0.1:3000']
        }
    });;

    io.on('connection', socket => {
        console.log(`User ${socket.id} connected`);

        setTimeout(async () => {
            io.emit('updateConnections', {
                count: await getNumUsers()
            });

            io.emit('displayMessages', {
                messages: (await Message.find({}, 'sender message').sort({ $natural: -1 }).limit(5)).reverse()
            });
        }, 500);

        // bug: logs in as admin, logs out, logs in as admin2, socket receives initializeUser value as admin instead of admin2
        socket.once('initializeUser', name => {
            socket.user = name
            onlineUsers.push(socket.user);
            console.log(onlineUsers)
        });

        socket.on('message', ({ name, text }) => {
            console.log(`${name}: ${text}`);
            storeMessage(name, text);

            io.emit('message', {
                name,
                text
            });
        });

        socket.on('activity', (name) => {
            typingUsers.add(name);
            console.log(typingUsers)
            socket.broadcast.emit('activity', Array.from(typingUsers));
        });

        // clear after 1 second
        let activityTimer;
        socket.on('stopActivity', (name) => {
            clearTimeout(activityTimer);
            activityTimer = setTimeout(() => {
                typingUsers.delete(name);
                socket.broadcast.emit('stopActivity', Array.from(typingUsers));
            }, 1500);
        });

        socket.on('disconnect', () => {
            console.log(`User ${socket.id} disconnected`);
            const userIndex = onlineUsers.indexOf(socket.user);
            onlineUsers.splice(userIndex, 1);

            setTimeout(async () => {
                io.emit('updateConnections', {
                    count: await getNumUsers()
                });
            }, 500);
        });
    });
}

module.exports = {
    chatServer
}