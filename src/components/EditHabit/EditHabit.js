import React, { useContext, useState, useEffect } from 'react';
import dayjs from 'dayjs';
import './EditHabit.css';
import HabitsService from '../../service/habits-service';
import ValidationError from '../ValidationError/ValidationError';


function EditHabit(props) {
    const habitId = +props.match.params.habit_id;

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [numTimes, setNumTimes] = useState(1);
    const [timeInterval, setTimeInterval] = useState('week');

    useEffect(() => {
        const getHabit = async () => {
            const resHabit = await HabitsService
                .getHabitById(habitId)
            setName(resHabit && resHabit.name);
            setDescription(resHabit && resHabit.description);
            setNumTimes(resHabit && resHabit.num_times);
            setTimeInterval(resHabit && resHabit.time_interval);
        }

        getHabit()

    }, []);


    function handleCancel() {
        props.history.goBack();
    }

    async function handleDelete() {
        await HabitsService.deleteHabit(habitId);
        props.history.push(`/habits`);
    }

    function validateName() {
        const habitName = name.trim();
        if (habitName.length === 0) {
            return ` *name is required `
        };
    };

    function renderIntervalOptions() {
        return ['week', 'month'].map(interval => (
            <option
                key={interval}
                id={interval}
                value={interval}
            >
                {interval}
            </option>
        ))
    };

    function renderNumTimesOptions() {
        let nums;
        if (timeInterval === 'week') {
            nums = Array.from(new Array(7), (x, i) => i + 1);
        } else if (timeInterval === 'month') {
            nums = Array.from(new Array(30), (x, i) => i + 1);
        }
        return nums && nums.map(numTimes => (
            <option
                key={numTimes}
                id={numTimes}
                value={numTimes}
            >
                {numTimes}
            </option>
        ))
    };

    async function handleSubmit(e) {
        e.preventDefault();

        const date_created = dayjs().format();
        const newHabit = {
            name: name,
            description: description,
            num_times: numTimes,
            time_interval: timeInterval,
            date_created: date_created
        };
        await HabitsService.updateHabit(newHabit, habitId);
        await HabitsService.getHabits();
        props.history.push(`/habits/${habitId}/habit-data`)
    };

    const handleChangeName = (e) => {
        setName(e.target.value)
        return e.target.value
    }

    const handleChangeDescription = (e) => {
        setDescription(e.target.value)
        return e.target.value
    }

    const handleChangeNumTimes = (e) => {
        setNumTimes(e.target.value)
        return e.target.value
    }

    const handleChangeTimeInterval = (e) => {
        setTimeInterval(e.target.value)
        return e.target.value
    }

    return (
        <section className="edit-habit-outer-wrapper">
            <div className='edit-habit-form-container'>
                <fieldset>
                    <h1 className='edit-habit-form-title'>Edit Habit</h1>
                    <form
                        onSubmit={handleSubmit}
                    >
                        <div className='edit-habit-label-input-wrapper 
                        edit-habit-name-wrapper'>

                            <label
                                htmlFor='edit-habit-name'>
                                Habit Name</label>
                            <input type='text'
                                name='edit-habit-name'
                                id='edit-habit-name'
                                aria-label='edit-habit-name'
                                value={name}
                                onChange={handleChangeName}
                                autoFocus
                            />
                        </div>
                        <ValidationError
                            message={validateName()}
                            errorPosition={'relative'}
                        />
                        <br />
                        <div className='edit-habit-label-input-wrapper'>
                            <label
                                htmlFor='edit-habit-description'>
                                Description</label>
                            <input type='text'
                                name='edit-habit-description'
                                id='edit-habit-description'
                                aria-label='edit-habit-description'
                                value={description}
                                onChange={handleChangeDescription}
                            />
                        </div>
                        <br />
                        <div className='edit-habit-label-input-wrapper 
                            frequency-goal-statement'>
                            <label
                                htmlFor='edit-habit-num-times'>
                                I plan to repeat this habit </label>
                            <select
                                name='edit-habit-num-times'
                                id='edit-habit-num-times'
                                aria-label='edit-habit-num-times'
                                value={numTimes}
                                onChange={handleChangeNumTimes}
                            >
                                {renderNumTimesOptions()}
                            </select>
                            <span> times </span>
                            <label
                                htmlFor='edit-habit-time-interval'>
                                per </label>
                            <select
                                name='edit-habit-time-interval'
                                id='edit-habit-time-interval'
                                aria-label='edit-habit-time-interval'
                                value={timeInterval}
                                onChange={handleChangeTimeInterval}
                            >
                                {renderIntervalOptions()}
                            </select>
                        </div>
                        <div className="edit-habit-buttons-wrapper">
                            <button
                                type="button"
                                onClick={handleCancel}>Cancel</button>
                            <button
                                type="submit"
                                disabled={name.length === 0}
                            >Save</button>
                        </div>
                        <br />
                    </form>
                    <button
                        className='btn delete-button'
                        aria-label='delete-button'
                        onClick={() => {
                            if (window.confirm('Are you sure you want to delete this habit?')) {
                                handleDelete()
                            }
                        }}
                    >
                        Delete Habit
                        </button>
                </fieldset>
            </div>
        </section>
    )
};

export default EditHabit