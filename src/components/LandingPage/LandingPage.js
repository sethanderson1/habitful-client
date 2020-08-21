import React, { useContext } from 'react';
import './LandingPage.css';

function LandingPage(props) {

    return (
        <section className='LandingPage-main-container'>
            <h1 className='LandingPage-app-title'>
                Habitful
                </h1>
            <h2>About Habitful</h2>
            <p className='app-description-content'>
                Use Habitful to track your progress on your habit goals!
                </p>
            <h2>Get Started</h2>
            <p>
                Try it out by signing up or logging in with the demo credentials
                and then select whether you've completed a given habit.
                If you forget to use the app for a few days, that's totally fine!
                You can retroactively check off the habits you completed during the last week.
                The more consistently you complete your habits, the higher your habit strength score gets!
                </p>
            {/* <p className='get-started-content primary-text-color'>
                    Sign up <span onClick={handleClickSignUp}>here</span> or try out the demo <span onClick={handleClickLogin}>here</span> to get started!
                </p> */}
        </section>
    );
};

export default LandingPage;