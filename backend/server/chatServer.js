const Server = require('socket.io').Server;
const Message = require('./models/Message');
const { format } = require('date-fns');

let onlineUsers = [];

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
                messages: await Message.find({}, 'sender message').sort({ $natural: -1 }).limit(50)
            });
        }, 500);

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