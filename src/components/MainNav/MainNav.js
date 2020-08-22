import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { HabitContext } from '../../context/HabitContext';
import './MainNav.css';
import { toast } from 'react-toastify';


function MainNav(props) {
    const context = useContext(HabitContext);
    const { isLoggedIn, setIsLoggedIn, habitId } = context;

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        setIsLoggedIn(false);
    }

    const loadingToast = async () => {
        toast.info(`loading...`, {
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: 12000,
        })
    }

    const handleClickMyHabits = () => {

        // console.log('props', props)
        if (props.location.pathname === '/') {
            loadingToast();
        }
    }

    const renderAddOrEdit = () => {

        if (props.location && props.location.pathname === '/habits') {
            return (
                <>
                    <Link className="add-habit" to={'/add-habit'}>
                        <p>Add</p>
                    </Link>
                    <div className="pipe">
                    </div>
                </>
            )
        }

        if (props.location && props.location.pathname.endsWith('habit-data')) {
            return (
                <>
                    <Link className="edit-habit" to={`/${habitId}/edit-habit`}>
                        <p>Edit</p>
                    </Link>
                    <div className="pipe">
                    </div>
                </>
            )
        }
    }

    const renderLogInOrOut = () => {

        if (isLoggedIn) {
            return (
                <>
                    <Link className="my-habits" to={'/habits'}
                        onClick={handleClickMyHabits}
                    >
                        <p>My Habits</p>
                    </Link>
                    <div className="pipe"></div>
                    <Link className="last-nav-item"
                        onClick={handleLogout}
                        to={'/'}>
                        <p>Logout</p>
                    </Link>
                </>
            )
        } else {
            return (
                <>
                    <Link className="last-nav-item" to={'/signup'}>
                        <p> Signup</p>
                    </Link>
                    <div className="pipe"></div>
                    <Link className="last-nav-item" to={'/login'}>
                        <p>Login</p>
                    </Link>
                </>
            )
        }
    }

    return (

        <nav className="MainNav__nav ">
            <Link className="nav-home" to={'/'}>
                <p>Home</p>
            </Link>
            <div className="middle-links">
                {renderAddOrEdit()}

                {renderLogInOrOut()}
            </div>
        </nav>
    );
}

export default MainNav;