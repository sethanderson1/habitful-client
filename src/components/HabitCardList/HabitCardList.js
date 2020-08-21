import React, { useState, useEffect, useContext } from 'react';
// import axios from 'axios';
// import dayjs from 'dayjs';
// import config from '../../config';
import HabitCard from '../HabitCard/HabitCard';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { HabitContext } from '../../context/HabitContext';
import HabitRecordsService from '../../service/habit-record-service';
import HabitsService from '../../service/habits-service';
import './HabitCardList.css';
// import { getNodeText } from '@testing-library/react';

const HabitCardList = (props) => {
    // console.log('HabitCardList ran')
    const context = useContext(HabitContext)

    const { habits, setHabits, setHabitRecords } = context;

    useEffect(() => {
        console.log('useEffect in HabitCardList ran')

        updateHabitsInContext();
        updateHabitRecordsInContext();
    }, [])


    const getHabits = async () => {
        try {
            const resHabits = await HabitsService.getHabits();
            return resHabits;
        } catch (error) {
            console.log('error', error)
        }
    }
    const updateHabitsInContext = async () => {
        try {
            const resHabits = await getHabits();
            setHabits(resHabits);
        } catch (error) {
            console.log('error', error)
        }
    }
    const getHabitRecords = async () => {
        // console.log('getHabitRecords ran')
        try {
            const resHabitRecords = await HabitRecordsService
                .getHabitRecords();
            // console.log('resHabitRecords', resHabitRecords)
            return resHabitRecords;
        } catch (error) {
            console.log('error', error)
        }
    }
    const updateHabitRecordsInContext = async () => {
        try {
            const resHabitRecords = await getHabitRecords();
            setHabitRecords(resHabitRecords);
        } catch (error) {
            console.log('error', error)
        }
    }

    const habitCards = habits && habits.map(habit => {
        return (
            <div className="habit-card-list"
                key={habit.id}>
                <HabitCard
                    id={habit.id}
                    name={habit.name}
                />
            </div>
        )
    })

    return (
        <section className="habit-card-list-container">
            {habitCards}
            <div className="habit-card-list-bottom-space">

            </div>
        </section>
    )
}

export default HabitCardList;
