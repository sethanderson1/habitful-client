import React, { useContext, useState } from 'react';
import './Login.css';
import config from '../../config';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboardList } from "@fortawesome/free-solid-svg-icons";
import { HabitContext } from '../../context/HabitContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Login(props) {
    const [error, setError] = useState(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const context = useContext(HabitContext);
    const {  setIsLoggedIn } = context;

    const loadingToast = async () => {
        console.log('loadingToast ran')
        toast.info(`loading...`, {
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: false,
        })
    }

    function handleCancel() {
        props.history.push(`/`);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        loadingToast();
        postLoginUser({
            email: username,
            password,
        });
    };

    async function postLoginUser(credentials) {
        return fetch(`${config.API_ENDPOINT}/auth/login`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(credentials),
        })
            .then((res) => {
                return !res.ok
                    ? res.json().then((e) => Promise.reject(e))
                    : res.json();
            })
            .then(async (res) => {
                const { authToken } = res;
                await storeToken(authToken);
                setIsLoggedIn(true);
                props.history.push('/habits');
            })
            .catch(err => {
                setError(
                    <div className="login-error">
                        Incorrect username or password</div>
                )
            });
    };

    async function storeToken(authToken) {
        localStorage.setItem('authToken', authToken);
    };

    return (
        <div className='Login__login-form-container-wrapper'>
            <div className='Login__login-form-container'>
                <h1 className='Login__login-title'>Login</h1>
                <form id='login-form'
                    onSubmit={handleSubmit}
                >
                    <div className='Login__label-input-wrapper'>
                        <label htmlFor="email">Email </label>
                        <input placeholder='Email' type="text"
                            name='email' id='email'
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            required
                            autoFocus />
                    </div>
                    <div className='Login__label-input-wrapper'>
                        <label htmlFor="password">Password </label>
                        <input placeholder='password' type="password"
                            name='password' id='password'
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required />
                    </div>
                    {error}
                    <div className='login-form-buttons-wrapper'>
                        <button type='button' onClick={handleCancel}>Cancel</button>
                        <button type='submit'>Log In</button>
                    </div>
                </form>
                <div className='demo-credentials'>
                    Demo user credentials:
                    <div className="credential-wrapper-wrapper">

                        <div className='credential-wrapper'>
                            <p className='credential'>
                                Email:
                            <span className='credential-bold'>  user1@gmail.com</span>
                            </p>
                            <button className="copy-to-clipboard"
                                aria-label='copy-to-clipboard'
                                onClick={() => navigator.clipboard.writeText(`user1@gmail.com`)}
                            >
                                <p>copy</p>
                                <FontAwesomeIcon icon={faClipboardList} size="2x" />
                            </button>
                        </div>
                        <div className='credential-wrapper'>
                            <p className='credential'>
                                Password:
                            <span className='credential-bold'>  Password1!</span>
                            </p>
                            <div className="copy-button-wrapper">
                                <button className="copy-to-clipboard"
                                    aria-label='copy-to-clipboard'
                                    onClick={() => navigator.clipboard.writeText(`Password1!`)}
                                >
                                    <p>copy</p>
                                    <FontAwesomeIcon icon={faClipboardList} size="2x" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};