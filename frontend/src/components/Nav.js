import useAuth from '../hooks/useAuth';
import useLogout from '../hooks/useLogout';
import { Link, useNavigate } from 'react-router-dom';

const Nav = () => {
    const { auth } = useAuth();
    const navigate = useNavigate();
    const logout = useLogout();

    const signOut = async () => {
        await logout();
        navigate('');
    }

    return (
        <nav>
            <ul>
                <li><Link to='/'>Home</Link></li>
                {!auth?.user
                    ? (
                        <>
                            <li><Link to='register'>Register</Link></li>
                            <li><Link to='login'>Login</Link></li>
                        </>
                    )
                    : (
                        <>
                            <li>Logged in as {auth.user}</li>
                            <Link><span onClick={signOut}>Logout</span></Link>
                        </>
                    )
                }

            </ul>
        </nav>
    )
}

export default Nav