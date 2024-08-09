import { useNavigate, Link } from "react-router-dom"

const Home = () => {
    const navigate = useNavigate();

    const enterChat = () => {
        navigate('/chat');
    }

    return (
        <section>
            <h1><span>NYU</span><span>Global Chat</span></h1>
            <p>NYU Global Chat is an open source project designed to allow unrestricted communication
                exclusively between NYU students/alumni.</p>
            <button onClick={enterChat}>Enter Chat</button>
        </section>
    )
}

export default Home