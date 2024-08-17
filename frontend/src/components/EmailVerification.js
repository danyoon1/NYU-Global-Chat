import { useState, useEffect } from "react";
import axios from '../api/axios';
import { useNavigate, useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const EMAIL_URL = '/verification';

const EmailVerification = () => {

    const { auth, setAuth } = useAuth();

    const { username } = useParams();
    const { token } = useParams();
    const navigate = useNavigate();

    const [isValidToken, setIsValidToken] = useState(false);

    // test on production
    const activateVerification = () => {
        verifyEmailToken(username, token);
        navigate('../../login');
    }

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
                    <span>Click the button to verify your email.</span>
                    <br />
                    <button onClick={activateVerification}>Verify</button>
                </section>
                : <section className="Verification">
                    <span>Email verification failed. Please try again.</span>
                </section>
            }
        </div>
    )
}

export default EmailVerification