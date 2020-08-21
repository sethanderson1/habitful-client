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
            setErrorInContext
        }}>
            {props.children}
        </HabitContext.Provider>
    )
}