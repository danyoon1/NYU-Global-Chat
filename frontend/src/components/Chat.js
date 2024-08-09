import Users from '../components/Users';
import { io } from 'socket.io-client';
import { useState, useEffect, useRef } from 'react';

const Chat = () => {

    const [socket, setSocket] = useState(null);

    const initCon = useRef(false);

    useEffect(() => {
        if (!initCon.current) {
            setSocket(io('http://localhost:3500'));
        }

        return () => {
            initCon.current = true;
        }
    }, []);

    return (
        <>
            <Users />
        </>
    )
}

export default Chat