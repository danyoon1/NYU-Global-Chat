import { socket } from './Socket';
import { useState, useEffect, useRef } from 'react';
import useAuth from '../hooks/useAuth';

const Chat = () => {

    const { auth } = useAuth();

    const [connected, setConnected] = useState(false);
    const [msgInput, setMsgInput] = useState('');
    const [msgHistory, setMsgHistory] = useState([]);
    const [numUsers, setNumUsers] = useState();
    const [isLoading, setIsLoading] = useState(true);

    const initCon = useRef(false);
    const msgRef = useRef();

    useEffect(() => {

        if (!initCon.current) {
            socket.connect();
            msgRef.current.focus();
        }

        return () => {
            if (initCon.current) {
                socket.disconnect();
                initCon.current = false;
            }
            initCon.current = true;
        }
    }, []);

    const sendMessage = (e) => {
        e.preventDefault();
        if (msgInput) {
            socket.emit('message', {
                name: auth.user,
                text: msgInput
            });
            setMsgInput('');
        }
        msgRef.current.focus();
    }

    socket.on('connect', () => {
        setConnected(true);
        console.log(auth.user)
        socket.emit('initializeUser', auth.user);
    });

    socket.on('disconnect', () => {
        setConnected(false);
    });

    socket.on('message', (data) => {
        setMsgHistory([
            ...msgHistory,
            { name: data.name, text: data.text }
        ]);
    });

    socket.on('updateConnections', (data) => {
        setNumUsers(data.count);
        setIsLoading(false);
    });

    socket.on('displayMessages', (data) => {
        setMsgHistory(data.messages.map((msg) => (
            { name: msg.sender, text: msg.message }
        )));
    });

    return (
        <section>
            <p>{`Online Users: ${isLoading ? 'Loading...' : numUsers}`}</p>
            <ul className='chat-display'>
                {msgHistory.map((msg, i) => (
                    <li key={i}>{`${msg.name}: ${msg.text}`}</li>
                ))}
            </ul>
            <form onSubmit={sendMessage}>
                <input
                    type='text'
                    id='message'
                    placeholder='Your message'
                    onChange={(e) => setMsgInput(e.target.value)}
                    value={msgInput}
                    required
                    ref={msgRef}
                />
                <button type='submit'>Send</button>
            </form>
        </section>
    )
}

export default Chat