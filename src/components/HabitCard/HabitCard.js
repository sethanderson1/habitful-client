import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { ToastContainer, toast, cssTransition } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { HabitContext } from '../../context/HabitContext';
import HabitRecordsService from '../../service/habit-record-service';
import HabitsService from '../../service/habits-service';
import './HabitCard.css';

const HabitCard = props => {

    const context = useContext(HabitContext)
    const { habitRecords, setHabitRecords, setErrorInContext } = context;

    const [selectedId, setSelectedId] = useState('');

    // const toastId = useRef(null);

    const numDaystoDisplay = 7;
    const todayDayOfWeek = dayjs();
    const daysNames = [];
    const daysNums = [];
    const actualDays = [];

    for (let i = numDaystoDisplay - 1; i > 0; i--) {
        daysNames.push(todayDayOfWeek.subtract(i, 'days')
            .format('ddd').toUpperCase())
        daysNums.push(todayDayOfWeek.subtract(i, 'days')
            .format('D'))
        actualDays.push(todayDayOfWeek.subtract(i, 'days'))
    }
    daysNames.push('Today'.toUpperCase())
    daysNums.push(todayDayOfWeek.format('D'))
    actualDays.push(todayDayOfWeek)


    const handleError = () => {


        console.log('handleError ran')
        toast.clearWaitingQueue();
        toast.dismiss();
        // const timer = window.setTimeout(() => {
        // }, 500)
        errorToast();


    }

    const errorToast = async () => {
        console.log('errorToast ran')
        toast.error(`something went wrong, please try again`, {
            className: 'error-toast',
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: false,
            // delay:1000
        })
    }


    // const handleSuccess = async (dateSelected, habit_id) => {

    //         const dateFormatted = dayjs(dateSelected).format('MMM DD');
    //         const resHabit = await HabitsService.getHabitById(habit_id);
    //         const habitName = resHabit && resHabit.name;

    //         toast.clearWaitingQueue();
    //         toast.dismiss();

    // }

    const successToastPost = async (habit_id, dateSelected) => {

        const dateFormatted = dayjs(dateSelected).format('MMM DD');
        try {

            const resHabit = await HabitsService.getHabitById(habit_id);
            const habitName = resHabit && resHabit.name;
            // how to wait for loading to disappear from screen
            // before displaying successToast ?

            toast.clearWaitingQueue();
            toast.dismiss();

            if (habitName) {
                // const timer = window.setTimeout(() => {
                toast.success(`completed '${habitName}' on ${dateFormatted}`, {
                    position: toast.POSITION.BOTTOM_CENTER,
                    autoClose: 3000,
                    // delay:1000
                })
                // }, 1500)
            }
        } catch (error) {
            console.log('successToastPost error', error)
            setErrorInContext(error)

        }

    }

    const successToastDelete = async (habit_id, dateSelected) => {

        const dateFormatted = dayjs(dateSelected).format('MMM DD');
        const resHabit = await HabitsService.getHabitById(habit_id);
        const habitName = resHabit && resHabit.name;
        toast.clearWaitingQueue();
        toast.dismiss();
        if (habitName) {
            toast.success(`did not complete '${habitName}' on ${dateFormatted}`, {
                className: "success-toast-delete",
                position: toast.POSITION.BOTTOM_CENTER,
                autoClose: 3000,
                // delay:1000

            })
        }
    }


    const loadingToastAnimation = cssTransition({
        enter: 'zoomIn',
        exit: 'zoomOut'
    })

    const loadingToast = async () => {
        console.log('loadingToast ran')
        toast.info(`loading...`, {
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: false,
            transition: loadingToastAnimation
        })
    }

    const deleteRecord = async (idx) => {
        console.log('deleteRecord ran')
        try {
            const resDeleted = await HabitRecordsService
                .deleteHabitRecord(habitRecords[idx].id)
            console.log('resDeleted', resDeleted)
            return resDeleted;
        } catch (error) {
            console.log('deleteRecord error', error)
        }
    }

    const getRecords = async () => {
        try {
            const resHabitRecords = await HabitRecordsService
                .getHabitRecords();
            // console.log('resHabitRecords', resHabitRecords)
            if (!resHabitRecords) handleError()
            return resHabitRecords;
        } catch (err) {
            console.log('err', err)
            handleError();
        }
    }

    const getDateSelected = (day) => {
        const dateSelected = dayjs()
            .subtract(numDaystoDisplay - 1 - day, 'days')
            .format();
        return dateSelected
    }

    const findIdxToDelete = async (habit_id, dateSelected) => {
        if (habitRecords) {
            const idxToDelete = habitRecords.findIndex(record => {
                return record.habit_id === habit_id &&
                    dayjs(record.date_completed).isSame(dateSelected, 'day');
            })
            return idxToDelete;
        }
    }

    const setHabitRecordsToContext = async () => {
        setHabitRecords(await getRecords());
    }


    const handleClickName = (name) => {
        context.setHabitId(props.id)
    }

    const isChecked = (props_id, i) => {

        const recordExists = (props_id) => {
            if (!habitRecords) {
                return false;
            }
            // search thru habitRecords to see if the record exists
            for (let j = 0; j < habitRecords.length; j++) {
                if (habitRecords[j].habit_id === props_id
                    && dayjs(actualDays[i])
                        .isSame(dayjs(habitRecords[j].date_completed), 'day')
                ) {
                    return true;
                }
            }
        }

        if (recordExists(props_id)) {
            return true;
        }
    }

    const postRecord = async (dateSelected) => {
        console.log('postRecord ran')
        const newHabitRecord = {
            habit_id: props.id,
            date_completed: dateSelected
        }
        try {
            const resHabitRecords = await HabitRecordsService
                .postHabitRecord(newHabitRecord);
            return resHabitRecords;
        } catch (err) {
            console.log('err', err)
            handleError();
        }
    }

    // todo: rewire post succcess toast and delete success toasts

    const handleSelectDay = async (day) => {
        console.log('handleSelectDay ran')

        loadingToast();

        const dateSelected = getDateSelected(day);

        // if a user selects a date, then clicks again to unselect,
        // need to delete that date from the record
        const isAlreadyChecked = isChecked(props.id, day);
        console.log('isAlreadyChecked', isAlreadyChecked)

        if (isAlreadyChecked) {
            const idxToDelete = await findIdxToDelete(props.id, dateSelected)
            const deleted = await deleteRecord(idxToDelete);

            console.log('deleted.status', deleted.status)
            console.log('deleted', deleted)
            // // console.log('deleted.HTTPStatusCode', deleted.HTTPStatusCode)


            setSelectedId(props.id);
            try {
                if (deleted.status !== 204) {
                    console.log('error in delete')
                    handleError();
                } else {
                    console.log('successful delete')
                    setHabitRecordsToContext();
                    successToastDelete(props.id, dateSelected);
                }
            } catch (error) {
                console.log('error', error)
            }
        } else {
            try {
                const postedStatus = await postRecord(dateSelected);
                console.log('postedStatus', postedStatus)
                console.log('postedStatus.HTTPStatusCode', postedStatus.HTTPStatusCode)
                setSelectedId(props.id); // todo: check if i need this                
                if (postedStatus.HTTPStatusCode) {
                    console.log('error in post')
                    handleError();
                } else {
                    console.log('successful post')
                    setHabitRecordsToContext();
                    successToastPost(props.id, dateSelected);
                }
            } catch (error) {
                console.log('error', error)
            }

        }
    }

    // ensures that no duplicate toasts
    const renderToastContainer = () => {
        const toastToDisplay = props.id === selectedId
            ? <ToastContainer limit={1} />
            : null;

        return toastToDisplay;
    }

    const randomFadeTime = (max, i) => {
        console.log('i', i)
        const num = Math.random() * max;

        console.log('num', num)
        return num.toString();
    }

    function renderCheckMarkOptions() {
        return daysNames.map((day, i) =>
            (
                <div className="day-option" key={day}
                    style={{ animation: `fadeIn ${i / 4}s` }}
                >
                    <label
                        htmlFor={'' + props.id + '' + i}
                        className="day-label"
                    >
                        <input onClick={() => handleSelectDay(i)} type={"checkbox"}
                            id={'' + props.id + '' + i} value={day}
                            defaultChecked={isChecked(props.id, i)}
                        />

                        <div className="day-label-info-container">
                            <p className="day-name">{day}</p>
                            <p className="day-number">{daysNums[i]}</p>
                        </div>
                    </label>
                </div>
            )
        )
    }

    return (
        <div className="habit-card-container">
            {/* {renderToastContainer(props.id)} */}
            <div className="habit-card-wrapper" >
                <Link to={`/habits/${props.id}/habit-data`}
                    onClick={handleClickName}>
                    <p className="habit-card-name">{props.name}</p>
                </Link>
                <div className="checkmarks-container">
                    {renderCheckMarkOptions()}
                </div>
            </div>
        </div>
    )
}

export default HabitCard;

