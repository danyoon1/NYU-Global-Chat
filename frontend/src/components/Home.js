import { useNavigate, Link } from "react-router-dom"

const Home = () => {
    const navigate = useNavigate();

    const enterChat = () => {
        navigate('/chat');
    }

    return (
        <section className="Home">
            <h1><span>NYU</span><br /><span>Global Chat</span></h1>
            <p id='description'>NYU Global Chat is an open source project designed to allow unrestricted communication
                exclusively between NYU students/alumni.</p>
            <button id='enter' onClick={enterChat}><span>Enter Chat</span></button>
        </section>
    )
}

export default Home