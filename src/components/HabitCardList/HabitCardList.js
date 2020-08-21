import React, { useEffect, useContext } from 'react';
import HabitCard from '../HabitCard/HabitCard';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { HabitContext } from '../../context/HabitContext';
import HabitRecordsService from '../../service/habit-record-service';
import HabitsService from '../../service/habits-service';
import './HabitCardList.css';

const HabitCardList = (props) => {
    const context = useContext(HabitContext)

    const { habits, setHabits, setHabitRecords, setErrorInContext } = context;

    useEffect(() => {
        console.log('useEffect in HabitCardList ran')
        toast.clearWaitingQueue();
        toast.dismiss();
        updateHabitsInContext();
        updateHabitRecordsInContext();
    }, [])

    const getHabits = async () => {
        try {
            const resHabits = await HabitsService.getHabits();
            return resHabits;
        } catch (error) {
            setErrorInContext(error)
            console.log('error', error)
        }
    }
    const updateHabitsInContext = async () => {
        try {
            const resHabits = await getHabits();
            console.log('resHabits', resHabits)
            setHabits(resHabits);
        } catch (error) {
            setErrorInContext(error)

            console.log('error', error)
        }
    }
    const getHabitRecords = async () => {
        try {
            const resHabitRecords = await HabitRecordsService
                .getHabitRecords();
            return resHabitRecords;
        } catch (error) {
            setErrorInContext(error)
        }
    }
    const updateHabitRecordsInContext = async () => {
        try {
            const resHabitRecords = await getHabitRecords();
            setHabitRecords(resHabitRecords);
        } catch (error) {
            setErrorInContext(error)
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
            {/* this space is to leave room for the toasts
            so they don't obstruct the view of options*/}
            <div className="habit-card-list-bottom-space">

            </div>
        </section>
    )
}

export default HabitCardList;
