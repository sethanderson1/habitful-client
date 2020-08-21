import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { toast, cssTransition } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { HabitContext } from '../../context/HabitContext';
import HabitRecordsService from '../../service/habit-record-service';
import HabitsService from '../../service/habits-service';
import './HabitCard.css';

const HabitCard = props => {
    const context = useContext(HabitContext)
    const { setHabitId, habitRecords, setHabitRecords, setErrorInContext } = context;

    const numDaystoDisplay = 7;
    const today = dayjs();
    const dayNames = [];
    const dayNums = [];
    const dayObjects = [];

    // generates day option names to display on card
    for (let i = numDaystoDisplay - 1; i > 0; i--) {
        dayNames.push(today.subtract(i, 'days')
            .format('ddd').toUpperCase())
        dayNums.push(today.subtract(i, 'days')
            .format('D'))
        dayObjects.push(today.subtract(i, 'days'))
    }

    dayNames.push('Today'.toUpperCase())
    dayNums.push(today.format('D'))
    dayObjects.push(today)

    const loadingToastAnimation = cssTransition({
        enter: 'zoomIn',
        exit: 'zoomOut'
    })

    const loadingToast = async () => {
        toast.info(`loading...`, {
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: false,
            transition: loadingToastAnimation
        })
    }

    const handleError = () => {
        toast.clearWaitingQueue();
        toast.dismiss();
        toast.error(`something went wrong, please try again`, {
            className: 'error-toast',
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: false,
        })
    }

    const handleSuccess = async (habit_id, dateSelected, successType) => {
        const dateFormatted = dayjs(dateSelected).format('MMM DD');
        try {
            const resHabit = await HabitsService.getHabitById(habit_id);
            const habitName = resHabit && resHabit.name;
            toast.clearWaitingQueue();
            toast.dismiss();

            if (habitName && successType === 'post') {
                toast.success(`completed '${habitName}' on ${dateFormatted}`, {
                    position: toast.POSITION.BOTTOM_CENTER,
                    autoClose: 3000,
                })
            } else {
                toast.success(`did not complete '${habitName}' on ${dateFormatted}`, {
                    className: "success-toast-delete",
                    position: toast.POSITION.BOTTOM_CENTER,
                    autoClose: 3000,
                })
            }
        } catch (error) {
            setErrorInContext(error)
        }
    }

    const getRecords = async () => {
        try {
            const resHabitRecords = await HabitRecordsService
                .getHabitRecords();
            if (!resHabitRecords) handleError()
            return resHabitRecords;
        } catch (err) {
            handleError();
        }
    }

    const deleteRecord = async (idx) => {
        try {
            const resDeleted = await HabitRecordsService
                .deleteHabitRecord(habitRecords[idx].id)
            return resDeleted;
        } catch (error) {
            setErrorInContext(error);
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
        setHabitId(props.id)
    }

    const isChecked = (props_id, dayIdx) => {

        const recordExists = (props_id) => {
            if (!habitRecords) {
                return false;
            }

            if (habitRecords.find(record => {
                return record.habit_id === props_id
                    && dayjs(dayObjects[dayIdx])
                        .isSame(dayjs(record.date_completed), 'day')
            })) {
                return true
            }
        }

        if (recordExists(props_id)) {
            return true;
        }
    }

    const postRecord = async (dateSelected) => {
        const newHabitRecord = {
            habit_id: props.id,
            date_completed: dateSelected
        }
        try {
            const resHabitRecords = await HabitRecordsService
                .postHabitRecord(newHabitRecord);
            return resHabitRecords;
        } catch (err) {
            handleError();
        }
    }

    const handleSelectDay = async (day) => {

        loadingToast();

        const dateSelected = getDateSelected(day);

        // if a user selects a date, then clicks again to unselect,
        // need to delete that date from the record
        const isAlreadyChecked = isChecked(props.id, day);

        if (isAlreadyChecked) {
            const idxToDelete = await findIdxToDelete(props.id, dateSelected)
            const deleted = await deleteRecord(idxToDelete);
            try {
                if (deleted.status !== 204) {
                    handleError();
                } else {
                    setHabitRecordsToContext();
                    handleSuccess(props.id, dateSelected, 'delete');
                }
            } catch (error) {
                setErrorInContext(error)
            }
        } else {
            try {
                const postedStatus = await postRecord(dateSelected);
                if (postedStatus.HTTPStatusCode) {
                    handleError();
                } else {
                    setHabitRecordsToContext();
                    handleSuccess(props.id, dateSelected, 'post');
                }
            } catch (error) {
                setErrorInContext(error)
            }
        }
    }

    function renderDaySelectionOptions() {
        return dayNames.map((day, i) =>
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
                            <p className="day-number">{dayNums[i]}</p>
                        </div>
                    </label>
                </div>
            )
        )
    }

    return (
        <div className="habit-card-container">
            <div className="habit-card-wrapper" >
                <Link to={`/habits/${props.id}/habit-data`}
                    onClick={handleClickName}>
                    <p className="habit-card-name">{props.name}</p>
                </Link>
                <div className="checkmarks-container">
                    {renderDaySelectionOptions()}
                </div>
            </div>
        </div>
    )
}

export default HabitCard;

