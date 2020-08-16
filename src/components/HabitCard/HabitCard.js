import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import dayjs, { isDayjs, utc } from 'dayjs';
import { ToastContainer, toast, cssTransition } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { HabitContext } from '../../context/HabitContext';
import HabitRecordsService from '../../service/habit-record-service';
import HabitsService from '../../service/habits-service';
import './HabitCard.css';

const HabitCard = props => {

    const habitID = props.id;
    const context = useContext(HabitContext)
    const { habitRecords, setHabitRecords } = context;

    const [selectedId, setSelectedId] = useState('');
    const [checkedDates, setCheckedDates] = useState([])

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
        // console.log('handleError ran')
        errorToast();
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
        const resHabit = await HabitsService.getHabitById(habit_id);
        const habitName = resHabit && resHabit.name;

        // how to wait for loading to disappear from screen
        // before displaying successToast ?

        const dismissPromise = () => {
            // return new Promise((resolve, reject) => {
            removeToasts()
            // })
        }

        const removeToasts = () => {
            toast.clearWaitingQueue();
            toast.dismiss();
        }

        dismissPromise()

        if (habitName) {
            // const timer = window.setTimeout(() => {
            toast.success(`completed '${habitName}' on ${dateFormatted}`, {
                position: toast.POSITION.BOTTOM_CENTER,
                autoClose: 3000,
                // delay:1000
            })
            // }, 1500)
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

    const errorToast = async () => {
        toast.error(`something went wrong, please try again`, {
            className: 'error-toast',
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: 2000
        })
    }

    const loadingToastAnimation = cssTransition({
        enter: 'zoomIn',
        exit: 'zoomOut'
    })

    const loadingToast = async () => {
        console.log('loadingToast ran')
        toast.info(`loading...`, {
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: 5000,
            transition: loadingToastAnimation
        })
    }

    const deleteRecord = async (idx) => {
        await HabitRecordsService
            .deleteHabitRecord(habitRecords[idx].id)
    }

    const getRecords = async () => {
        try {
            const resHabitRecords = await HabitRecordsService
                .getHabitRecords();
            if (!resHabitRecords) handleError()
            return resHabitRecords;
        } catch (err) {
            // handleError();
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

    const postRecord = async (dateSelected) => {
        const newHabitRecord = {
            habit_id: habitID,
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

    const handleClickName = (name) => {
        context.setHabitId(habitID)
    }

    // const isChecked = (props_id, i) => {

    //     const recordExists = (props_id) => {
    //         if (!habitRecords) {
    //             return false;
    //         }
    //         // search thru habitRecords to see if the record exists
    //         for (let j = 0; j < habitRecords.length; j++) {
    //             if (habitRecords[j].habit_id === props_id
    //                 && dayjs(actualDays[i])
    //                     .isSame(dayjs(habitRecords[j].date_completed), 'day')
    //             ) {
    //                 return true;
    //             }
    //         }
    //     }

    //     if (recordExists(props_id)) {
    //         return true;
    //     }
    // }



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












    // ensures that no duplicate toasts
    const renderToastContainer = () => {
        // console.log('renderToastContainer ran')
        // console.log('habitID', habitID)
        // console.log('selectedId', selectedId)

        const toastToDisplay = habitID === selectedId
            // const toastToDisplay = habitID === habitID
            ? <ToastContainer limit={1} />
            : null;

        return toastToDisplay;
    }

    const randomFadeTime = (max, i) => {
        // console.log('i', i)
        const num = Math.random() * max;

        // console.log('num', num)
        return num.toString();
    }

    const fetchCheckedStatusForHabitID = async (startDate, endDate, habitID) => {

        try {
            const checkedStatusArray = await HabitRecordsService
                .getCheckedStatusRange(startDate, endDate, habitID)
            // convert checked dates to local dates
            // convertCheckedDatesToLocal()
            setCheckedDates(checkedStatusArray.data)
            // console.log('checkedStatusArray', checkedStatusArray)
        } catch (error) {
            console.log('error', error)
        }
    }

    const convertCheckedDatesToLocal = async () => {
        console.log('convertCheckedDatesToLocal ran')

        // if (checkedDates.length>0) {

        const localizedCheckedDates = checkedDates.map(checkedDate => {
            checkedDate.calendar_day = dayjs(checkedDate.calendar_day).format()
            console.log('checkedDate.calendar_day', checkedDate.calendar_day)
            return checkedDate.calendar_day
        })

        console.log('localizedCheckedDates', localizedCheckedDates)

        // }





    }

    useEffect(() => {

        if (checkedDates.length === 0) {
            const startDate = dayjs()
                .startOf('day')
                .subtract(6, 'day')
                .format('YYYY-MM-DD')
            const endDate = dayjs()
                .startOf('day')
                .format('YYYY-MM-DD')
            console.log('startDate', startDate)
            console.log('endDate', endDate)
            fetchCheckedStatusForHabitID(
                startDate
                , endDate
                , habitID)

        }
        console.log('checkedDates', checkedDates)
    }, [checkedDates])



    // const handleSelectDay = async (day) => {
    //     console.log('handleSelectDay ran')

    //     loadingToast();

    //     const dateSelected = getDateSelected(day);

    //     // if a user selects a date, then clicks again to unselect,
    //     // need to delete that date from the record
    //     const isAlreadyChecked = isChecked(habitID, day);

    //     if (isAlreadyChecked) {
    //         await deleteRecord(await findIdxToDelete(habitID, dateSelected));
    //         setHabitRecordsToContext();
    //         setSelectedId(habitID);
    //         successToastDelete(habitID, dateSelected);
    //     } else {
    //         await postRecord(dateSelected);
    //         setHabitRecordsToContext();
    //         setSelectedId(habitID);
    //         successToastPost(habitID, dateSelected);
    //     }
    // }

    const toggleDateCompleted = async (i, habitID) => {
        console.log('i', i)
        loadingToast();

        const date = dayjs().subtract(6 - i, 'day')
            // .format('YYYY-MM-DD')
        console.log('date', date)
        try {
            const toggledDate = await HabitRecordsService.toggleDate(date, habitID)
            console.log('toggledDate', toggledDate)
        } catch (error) {
            console.log('error', error)
        }
    }

    function renderCheckMarkOptions() {
        // console.log('checkedDates', checkedDates)
        // const correctedDates = checkedDates.map((date, i) => {
        //     // console.log('date.calendar_day', date.calendar_day)
        //     // console.log('date.checked', date.checked)
        //     let temp = dayjs(date.calendar_day).startOf('day').utc().format();
        //     date.calendar_day = temp
        //     // console.log('date.calendar_day', date.calendar_day)
        //     return date

        // })
        // console.log('correctedDates', correctedDates)


        console.log('dayjs().format()', dayjs().format())

        console.log('checkedDates', checkedDates)
        return checkedDates.map((date, i) =>
            (
                <div className="day-option" key={date.calendar_day}
                    style={{ animation: `fadeIn ${i / 4}s` }}
                >
                    <label
                        htmlFor={'' + habitID + '' + i}
                        className="day-label"
                    >
                        {/* <input onClick={() => handleSelectDay(i)}  */}
                        <input onClick={() => toggleDateCompleted(i, habitID)}
                            type={"checkbox"}
                            id={'' + habitID + '' + i} value={dayjs().subtract(6-i,'day').format('YYYY-MM-DD')}
                            defaultChecked={date.checked}
                        />

                        <div className="day-label-info-container">
                            <p className="day-name">{dayjs().subtract(6-i,'day').format('ddd')}</p>
                            <p className="day-number">{dayjs().subtract(6-i,'day').format('DD')}</p>
                        </div>
                    </label>
                </div>
            )
        )
    }
    //     return checkedDates.map((date, i) =>
    //         (
    //             <div className="day-option" key={date.calendar_day}
    //                 style={{ animation: `fadeIn ${i / 4}s` }}
    //             >
    //                 <label
    //                     htmlFor={'' + habitID + '' + i}
    //                     className="day-label"
    //                 >
    //                     {/* <input onClick={() => handleSelectDay(i)}  */}
    //                     <input onClick={() => toggleDateCompleted(i, habitID)}
    //                         type={"checkbox"}
    //                         id={'' + habitID + '' + i} value={dayjs(date.calendar_day).format('ddd')}
    //                         defaultChecked={date.checked}
    //                     />

    //                     <div className="day-label-info-container">
    //                         <p className="day-name">{dayjs(date.calendar_day).format('ddd')}</p>
    //                         <p className="day-number">{dayjs(date.calendar_day).format('DD')}</p>
    //                     </div>
    //                 </label>
    //             </div>
    //         )
    //     )
    // }
    //     return daysNames.map((day, i) =>
    //         (
    //             <div className="day-option" key={day}
    //                 style={{ animation: `fadeIn ${i / 4}s` }}
    //             >
    //                 <label
    //                     htmlFor={'' + habitID + '' + i}
    //                     className="day-label"
    //                 >
    //                     {/* <input onClick={() => handleSelectDay(i)}  */}
    //                     <input onClick={() => toggleDateCompleted(i, habitID)}
    //                         type={"checkbox"}
    //                         id={'' + habitID + '' + i} value={day}
    //                         defaultChecked={checkedDates[i] &&
    //                              convertCheckedDatesToLocal(checkedDates[i].checked)}
    //                     // defaultChecked={isChecked(habitID, i)}
    //                     />

    //                     <div className="day-label-info-container">
    //                         <p className="day-name">{day}</p>
    //                         <p className="day-number">{daysNums[i]}</p>
    //                     </div>
    //                 </label>
    //             </div>
    //         )
    //     )
    // }

    return (
        <div className="habit-card-container">
            {renderToastContainer(habitID)}
            <div className="habit-card-wrapper" >
                <Link to={`/habits/${habitID}/habit-data`}
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

