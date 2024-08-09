import Users from './Users';
import { socket } from './Socket';
import { useState, useEffect, useRef } from 'react';

const Chat = () => {

    const [connected, setConnected] = useState(false);
    const [msgInput, setMsgInput] = useState('');
    const [msgHistory, setMsgHistory] = useState([]);

    const initCon = useRef(false);

    useEffect(() => {
        if (!initCon.current) {
            socket.connect();
            setConnected(true);
        }

        return () => {
            initCon.current = true;
            setConnected(false);
        }
    }, []);

    socket.on('message', (data) => {
        console.log(data.text);
    });

    const sendMessage = (e) => {
        e.preventDefault();
        socket.emit('message', {
            name: 'test',
            text: 'test message'
        });
    }

    return (
        <section>

        </section>
    )
}

export default Chat