import React, { useState } from 'react';
import dayjs from 'dayjs';
import HabitsService from '../../service/habits-service';
import ValidationError from '../ValidationError/ValidationError';
import './AddHabit.css';

function AddHabit(props) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [numTimes, setNumTimes] = useState(7);
    const [timeInterval, setTimeInterval] = useState('week');

    function handleCancel() {
        props.history.goBack();
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
        return nums.map(numTimes => (
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
        await HabitsService.postHabit(newHabit);
        props.history.goBack();
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
        <section className="add-habit-outer-wrapper">
            <div className='add-habit-form-container'>
                <h1 className='add-habit-form-title'>Add Habit</h1>

                <fieldset>
                    <form id='add-habit-form'
                        onSubmit={handleSubmit}
                    >
                        <div className='add-habit-label-input-wrapper 
                        add-habit-name-wrapper'>
                            <label
                                htmlFor='add-habit-name'>
                                Habit Name </label>
                            <input type='text'
                                name='add-habit-name'
                                id='add-habit-name'
                                aria-label='habit-name'
                                value={name}
                                onChange={handleChangeName}
                                autoFocus
                            />
                        </div>
                        <ValidationError
                            message={validateName()}
                            errorPosition={'absolute'}
                        />
                        <br />
                        <div className='add-habit-label-input-wrapper'>
                            <label
                                className="add-habit-description-label"
                                htmlFor='add-habit-description'>
                                Description </label>
                            <input type='text'
                                name='add-habit-description'
                                id='add-habit-description'
                                aria-label='habit-description'
                                value={description}
                                onChange={handleChangeDescription}
                            />
                        </div>
                        <br />
                        <div className='add-habit-label-input-wrapper 
                        frequency-goal-statement'>
                            <label
                                htmlFor='add-habit-num-times'>
                                I plan to repeat this habit </label>
                            <select
                                name='add-habit-num-times'
                                id='add-habit-num-times'
                                aria-label='habit-number-of-times'
                                value={numTimes}
                                onChange={handleChangeNumTimes}
                            >
                                {renderNumTimesOptions()}
                            </select>
                            <span> times </span>
                            <label
                                htmlFor='add-habit-time-interval'>
                                per </label>
                            <select
                                name='add-habit-time-interval'
                                id='add-habit-time-interval'
                                aria-label='habit-time-interval'
                                value={timeInterval}
                                onChange={handleChangeTimeInterval}
                            >
                                {renderIntervalOptions()}
                            </select>
                        </div>
                        <div className="add-habit-buttons-wrapper">
                            <button
                                type="button"
                                onClick={handleCancel}>Cancel</button>
                            <button
                                type="submit"
                                disabled={name.length === 0}
                            >Add</button>
                        </div>
                    </form>
                </fieldset>
            </div>
        </section>
    )
};

export default AddHabit