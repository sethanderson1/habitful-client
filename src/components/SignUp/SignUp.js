import React, { useContext, useState } from 'react';
import config from '../../config';
import ValidationError from '../ValidationError/ValidationError';
import './SignUp.css';
import dayjs from 'dayjs';
import { HabitContext } from '../../context/HabitContext';
import HabitsService from '../../service/habits-service';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const utc = require('dayjs/plugin/utc')
dayjs.extend(utc);
 
export default function SignUp(props) {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [touched, setTouched] = useState(false);
    const [nameTaken, setNameTaken] = useState(false);

    const context = useContext(HabitContext);
    const { setIsLoggedIn } = context;

    const loadingToast = async () => {
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
        postSignUpUser({
            email: name,
            password,
            date_created: dayjs().utc().format()
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

                await HabitsService.postHabit(
                    defaultNewUserHabit
                );
                props.history.push('/habits');
            })
            .catch(err => {
            });
    };

    async function storeToken(authToken) {
        localStorage.setItem('authToken', authToken);
    };

    const defaultNewUserHabit = {
        name: 'Drink two liters of water',
        description: '',
        num_times: 7,
        time_interval: 'week',
        date_created: dayjs().utc().format()
    };

    const PASSWORD_REGEX = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!_@#$%^&])[\S]+/;
    const EMAIL_REGEX = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
    let usernameTrue = false;
    let passwordTrue = false;
    let confirmPasswordTrue = false;

    function validateUsername() {
        if (name.length === 0 && touched) {
            return `*Must have an Email`
        };
        if (!EMAIL_REGEX.test(name) && touched) {
            return `*Must be a valid email address`
        };
        usernameTrue = true;
        return false;
    };

    function validatePassword() {
        if (password.length === 0) {
            return null;
        }
        if (password.length < 8) {
            return `*Password must be at least 8 characters`;
        }
        if (password.length > 72) {
            return `*Password must be no more than 72 characters`;
        };
        if (password.startsWith(' ') || password.endsWith(' ')) {
            return `*Password cannot start or end with empty spaces`
        };
        if (!PASSWORD_REGEX.test(password)) {
            return `*Password must contain at least one each of: upper case, lower case, number, and special character`;
        };
        passwordTrue = true;
        return false;
    };

    function validateConfirmPassword() {
        if (confirmPassword.length === 0) {
            return null;
        }
        if (confirmPassword !== password) {
            return `*Passwords must match`;
        };
        confirmPasswordTrue = true;
        return true;
    };

    const updateTouched = () => {
        if (!touched) {
            return setTouched(true);
        };
    };

    const updateName = (e) => {
        setName(e.target.value);
        updateTouched();
    };

    function checkIfValid() {
        if (
            !usernameTrue || !passwordTrue || !confirmPasswordTrue
        ) {
            return true;
        };
        return false;
    };

    function toggleHoverClass() {
        if (!checkIfValid()) {
            return ['SignUp__submit', 'allowHover'].join(' ')
        } else {
            return 'SignUp__submit'
        };
    };


    function postSignUpUser(signUpFields) {
        return fetch(`${config.API_ENDPOINT}/users`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(signUpFields),
        })
            .then((res) => {
                return !res.ok
                    ? res.json().then((e) => Promise.reject(e))
                    : res.json();
            })
            .then((res) => {
                postLoginUser({
                    email: name,
                    password,
                });
            })
            .catch(async (err) => {
                // console.log('err', err)
                if (err.error.message === '*Email already in use') {
                    setNameTaken(true);
                };
            });
    };

    function errorMessage() {
        if (nameTaken) {
            return '*Email already in use';
        };
    };

    return (
        <div className='SignUp__signup-form-container-wrapper'>
            <ToastContainer />
            <div className='SignUp__signup-form-container'>
                <h1 className='SignUp__signup-title'>Sign up</h1>
                <form
                    onSubmit={handleSubmit}
                    className='SignUp__signup-form'>
                    <div className='SignUp__label-input-wrapper'>
                        <label htmlFor="SignUp__email">Email </label>
                        <input placeholder='Email' type="text"
                            name='email' id='SignUp__email'
                            value={name}
                            onChange={updateName}
                            required
                            autoFocus />
                    </div>
                    <div className='SignUp__label-input-wrapper'>
                        <label htmlFor="password">Password </label>
                        <input placeholder='password' type="password"
                            name='password' id='password'
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required />

                        <div className='SignUp__label-input-wrapper'>
                            <label className='confirm-password-label' htmlFor="confirm_password">Confirm Password </label>
                            <input placeholder='password' type="password"
                                name='confirm_password' id='confirm_password'
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                required />
                        </div>
                        <div className="validation-container">
                            <ValidationError
                                message={validateUsername()}
                                errorPosition={'relative'} />
                            <ValidationError
                                message={validatePassword()}
                                errorPosition={'relative'} />
                            <ValidationError
                                message={validateConfirmPassword()}
                                errorPosition={'relative'} />
                            <ValidationError
                                message={errorMessage()}
                                errorPosition={'relative'} />
                        </div>
                    </div>
                    <div className='signup-form-buttons-wrapper'>
                        <button
                            className='allowHover'
                            type="button"
                            aria-label='Cancel'
                            onClick={handleCancel}>Cancel</button>
                        <button
                            className={toggleHoverClass()}
                            type="submit"
                            aria-label='submit'
                            disabled={checkIfValid()}
                        >Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
};