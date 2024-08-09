import Users from '../components/Users';
import { io } from 'socket.io-client';
import { useState, useEffect, useRef } from 'react';

const Chat = () => {

    const [socket, setSocket] = useState(null);
    const [msgInput, setMsgInput] = useState('');
    const [msgHistory, setMsgHistory] = useState([]);

    const initCon = useRef(false);

    useEffect(() => {
        if (!initCon.current) {
            setSocket(io('http://localhost:3500'));
        }

        return () => {
            initCon.current = true;
        }
    }, []);

    socket.on('message', (data) => {

    });

    const sendMessage (e) => {
        e.preventDefault();
    }

    return (
        <section>

        </section>
    )
}

export default Chat