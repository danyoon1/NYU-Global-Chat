import { useState, useEffect } from "react";
import axios from '../api/axios';
import { Link, useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const EMAIL_URL = '/verification';

const EmailVerification = () => {

    const { auth, setAuth } = useAuth();

    const { username } = useParams();
    const { token } = useParams();
    const [isValidToken, setIsValidToken] = useState(false);

    useEffect(() => {
        verifyEmailToken(username, token);
    }, []);

    const verifyEmailToken = async (user, emailToken) => {
        const verificationInfo = {
            username: user,
            emailToken
        }

        try {
            const response = await axios.post(EMAIL_URL, verificationInfo,
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );

            if (response.status === 201) {
                setIsValidToken(true);
                setAuth({
                    ...auth,
                    verification: true
                });
            }
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div>
            {isValidToken
                ? <section className="Verification">
                    Email has been verified. You can now sign in.
                    <br />
                    <Link to='../../login'>Login</Link>
                </section>
                : <section className="Verification">
                    Email verification failed. Please try again.
                </section>
            }
        </div>
    )
}

export default EmailVerification