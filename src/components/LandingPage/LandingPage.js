import React, { useContext } from 'react';
import { HabitContext } from '../../context/HabitContext';
import select_date from './select_date.png';
import select_title from './select_title.png';
import graph_page from './graph_page.png';
import add_habits from './add_habits.png';
import './LandingPage.css';

function LandingPage(props) {


    const context = useContext(HabitContext);
    const { isLoggedIn, setIsLoggedIn } = context;

    async function handleClickSignUp() {
        // await context.handleLogout();
        props.history.push('/signup');
    };

    async function handleClickLogin() {
        // await context.handleLogout();
        props.history.push('/login');
    };

    return (
        <section className='LandingPage-main-container'>
            <h1 className='LandingPage-app-title'>
                Habitful
                </h1>
            <h2>About Habitful</h2>
            <p className='app-description-content'>
                An app to help you stick to new habits, Habitful allows you
                to create habit goals and track your progress on reaching
                those goals
                </p>
            <h2>Get Started</h2>
            <p>
                Add habits and specify how often you plan on completing them
            </p>

            <div className="how-to-guide">
                <img src={add_habits} alt="how-to-add-habits" />
            </div>
            <p>
                Each time you complete a habit, simply mark it as completed.
            </p>
            <p>
                If you forget to use the app for a few days, no worries, you can
                retroactively check off the habits you completed during the last week.
            </p>
            <div className="how-to-guide">
                <img src={select_date} alt="how-to-select-date" />
            </div>
            <p>
                Click on the habit name to check how well you've been sticking
                to the habit
            </p>
            <div className="how-to-guide">
                <img src={select_title} alt="how-to-select-title" />
            </div>
            <div className="how-to-guide">
                <img src={graph_page} alt="how-to-graph-page" />
            </div>
            <p className='get-started-here'>
                Sign up <span onClick={handleClickSignUp}>here</span> or try out the demo <span onClick={handleClickLogin}>here</span> to get started!
            </p>
        </section>
    );
};

export default LandingPage;