import React, { useState, createContext } from 'react';

export const HabitContext = createContext();

export const HabitContextProvider = props => {

    const [habits, setHabits] = useState();
    const [habitRecords, setHabitRecords] = useState(null);
    const [habitId, setHabitId] = useState(0);
    const [test, setTest] = useState([]);
    const [gapArray, setGapArray] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [errorInContext, setErrorInContext] = useState(null);

    // checkBeforeAnything = () => {
    //     const authToken = localStorage.getItem('authToken');
    //     if (!authToken) {
    //       return (
    //         <Redirect to={'/'} />
    //       )
    //     };
    //   };

    const displayError = () => {
        if (errorInContext) {
            return (
                <section>
                    <h1>{JSON.stringify(errorInContext)}</h1>
                </section>
            )
        }
        return null
    }


    return (
        <HabitContext.Provider value={{
            test,
            setTest,
            habits,
            setHabits,
            habitRecords,
            setHabitRecords,
            habitId,
            setHabitId,
            gapArray,
            setGapArray,
            isLoggedIn,
            setIsLoggedIn,
            errorInContext,
            setErrorInContext,
            displayError
        }}>
            {props.children}
        </HabitContext.Provider>
    )
}