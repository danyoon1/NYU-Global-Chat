import { useState, useEffect, useRef } from 'react';
import { socket } from './Socket';
import useAuth from '../hooks/useAuth';

const Chat = () => {

    const { auth } = useAuth();

    const [connected, setConnected] = useState(false);
    const [msgInput, setMsgInput] = useState('');
    const [msgHistory, setMsgHistory] = useState([]);
    const [numUsers, setNumUsers] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [typingUsers, setTypingUsers] = useState([]);
    const [bottom, setBottom] = useState(true);
    const [activityTimer, setActivityTimer] = useState(null);

    const initCon = useRef(false);
    const msgRef = useRef();
    const endRef = useRef(null);

    useEffect(() => {

        // strict mode countermeasures issue in development
        if (!initCon.current) {
            socket.connect();
            msgRef.current.focus();
        }

        return () => {
            socket.removeAllListeners();
            socket.disconnect(true);
            initCon.current = true;
        }
    }, []);

    useEffect(() => {
        if (bottom) {
            endRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [msgHistory]);

    const handleScroll = (e) => {
        const bottom = e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight < 10;
        setBottom(bottom);
    }

    const sendActivity = () => {
        socket.emit('activity', auth.user);

        clearTimeout(activityTimer);
        let timer = setTimeout(() => {
            socket.emit('stopActivity', auth.user);
        }, 1500);
        setActivityTimer(timer);
    }

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

    socket.once('connect', () => {
        setConnected(true);
        // console.log(auth.user);
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

    socket.on('updateActivity', (users) => {
        setTypingUsers(users.filter((user) => user !== auth.user));
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
        <section className='Chat'>
            <p className='online'>{`Online Users: ${isLoading ? 'Loading...' : numUsers}`}</p>
            <div className='chat-container' onScroll={handleScroll}>
                <ul className='chat-display'>
                    {msgHistory.map((msg, i) => (
                        <li key={i}>{`${msg.name}: ${msg.text}`}</li>
                    ))}
                </ul>
                <div
                    className='chat-end'
                    ref={endRef}
                />
            </div>
            <ul className='activity'>{
                typingUsers.length > 0 && typingUsers.length === 1
                    ? `${typingUsers[0]} is typing...`
                    : typingUsers.map((user, i) => {
                        if (i === 0) {
                            return user
                        } else if (i === typingUsers.length - 1) {
                            return `, ${user} are typing...`
                        } else {
                            return `, ${user}`
                        }
                    })
            }</ul>
            <form className='chat-form' onSubmit={sendMessage}>
                <input
                    type='text'
                    id='message'
                    className='chat-input'
                    placeholder='Your message...'
                    onChange={(e) => setMsgInput(e.target.value)}
                    value={msgInput}
                    required
                    ref={msgRef}
                    autoComplete='off'
                    onKeyDown={sendActivity}
                />
                <button type='submit' className='chat-submit'>Send</button>
            </form>
        </section>
    )
}

export default Chat