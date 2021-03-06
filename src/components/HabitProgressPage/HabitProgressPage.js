import React, { useState, useEffect, useContext, useRef, useLayoutEffect } from 'react';
import { HabitContext } from '../../context/HabitContext';
import { Line, Doughnut } from 'react-chartjs-2';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import HabitsService from '../../service/habits-service';
import HabitRecordsService from '../../service/habit-record-service';
import './HabitProgressPage.css';

const HabitProgressPage = (props) => {

    const [chartData, setChartData] = useState({});
    const [graphInterval, setGraphInterval] = useState(200);
    const [chartDoughnutData, setChartDoughnutData] = useState({});
    const [currHabitStrength, setCurrHabitStrength] = useState(0);
    const [name, setName] = useState(' ');
    const [description, setDescription] = useState('');
    // big number so forces to 0 instead of random number 
    const [numTimes, setNumTimes] = useState(10000000000);
    const [timeInterval, setTimeInterval] = useState('week');
    const [graphResolution, setGraphResolution] = useState('day');
    const [graphWrapperStyle, setGraphWrapperStyle] = useState({
        width: 7000,
        height: "35vh"
    });
    const graphContainerRef = useRef(null);
    const graphWrapperRef = useRef(null);
    const canvasRef = useRef(null);

    const endDate = dayjs().format();

    const context = useContext(HabitContext);
    const { setHabitId, habitRecords,
        setHabitRecords, setErrorInContext } = context;

    const habit_id = +props.match.params.habit_id;
    // console.log('habit_id', habit_id)

    useEffect(() => {
        toast.clearWaitingQueue();
        toast.dismiss();
        const getHabit = async () => {
            try {
                const resHabit = await HabitsService
                    .getHabitById(habit_id);
                setName(resHabit.name);
                setDescription(resHabit.description);
                setNumTimes(resHabit.num_times);
                setTimeInterval(resHabit.time_interval);
                setHabitId(habit_id);
            } catch (error) {
                setErrorInContext(error);
            }
        }

        getHabit()

        const getRecords = async () => {
            try {
                const resHabitRecords = await HabitRecordsService
                    .getHabitRecords();
                return resHabitRecords;
            } catch (error) {
                setErrorInContext(error);
            }
        }

        const setHabitRecordsToContext = async () => {
            setHabitRecords(await getRecords())
        }

        if (habitRecords) {
            chart();
            doughnutChart();
        } else {
            setHabitRecordsToContext();
        }
    },
        [habitRecords, graphResolution, numTimes, timeInterval,]
    );


    // scroll to the rightmost edge of the graph once it has rendered
    // ie to most recent data
    useLayoutEffect(() => {
        if (graphContainerRef && graphContainerRef.current) {

            const timer = window.setTimeout(() => {
                if (graphContainerRef && graphContainerRef.current) {
                    const domElement = graphContainerRef.current;
                    domElement.scrollLeft = domElement.scrollWidth;
                }
            }, 100)

            // sets graph length based on amount of data and screen size
            const getGraphLength = () => {
                const graphLength =
                    graphInterval * 10 / graphResolutionIncrement();

                const domElement = graphContainerRef.current;
                const graphContainerWidth = domElement.clientWidth;

                // this prevents graph from not filling width of page on render
                const graphLen = Math.max(graphLength, graphContainerWidth);
                return graphLen;
            }

            const graphLen = getGraphLength()

            setGraphWrapperStyle({
                // - 10 prevents unnecessary scroll bar space
                width: graphLen - 10,
                height: "35vh",
                position: "relative",
            })

            return () => {
                window.clearTimeout(timer)
            }
        }
    }, [graphInterval, graphResolution])

    // creates datapoints to populate graph with
    const dataForChart = () => {
        // sorted array of correct habit records
        let arr = habitRecords.filter(record =>
            record.habit_id === habit_id)
            .map(record => record.date_completed);
        arr.sort((a, b) => dayjs(a) - dayjs(b));

        // length of graph x axis
        const interval = Math.max(dayjs()
            .diff(dayjs(arr[0]), 'days') + 2, 30);

        setGraphInterval(interval)

        const startDate = dayjs(endDate)
            .subtract(interval, 'days').format();
        let currDay = startDate;

        let filledRecords = [{
            id: habit_id,
            datesWithGaps: []
        }];

        let i = 0;

        // make array of dates where 0 represents
        // a non-completion day ie [7/1/20, 0, 0, 7/4/20]
        while (dayjs(currDay).diff(dayjs(endDate), 'day') <= 0) {
            if (arr[i] === undefined) {
                arr[i] = null;
            }

            if (dayjs(currDay).isSame(dayjs(arr[i]), 'day')) {
                filledRecords[0].datesWithGaps
                    .push(currDay)
                i++;
            } else {
                filledRecords[0].datesWithGaps
                    .push(0);
            }
            currDay = dayjs(currDay).add(1, 'day');
        }

        const graphResInc = graphResolutionIncrement();

        const { dailyData, currDataPoint }
            = makeDailyHabitStrengthData(filledRecords, interval);

        let labels = [];
        let data = [];

        // creates labels array
        for (let i = interval; i >= 0; i -= graphResInc) {
            labels.push(dayjs().subtract(interval - i, 'days')
                .format('MMM DD'));
            data.push(+dailyData[i].toFixed(2))
        }
        labels.reverse();
        data = data.reverse();

        return {
            labels,
            data,
            currDataPoint,
            interval
        }
    }

    const graphResolutionIncrement = () => {
        if (graphResolution === 'day') {
            return 1;
        } else if (graphResolution === 'week') {
            return 7;
        }
    }

    const makeDailyHabitStrengthData = (filledRecords, interval) => {
        let dailyData = [];
        let timeIntervalNum;
        if (timeInterval === 'day') {
            timeIntervalNum = 1;
        } else if (timeInterval === 'week') {
            timeIntervalNum = 7;
        } else if (timeInterval === 'month') {
            timeIntervalNum = 30;
        }

        const freq = numTimes / timeIntervalNum;

        const checkMarkWeight = 1 / freq;
        let prevDataPoint = 0;
        let currDataPoint = prevDataPoint;
        let multiplier = Math.pow(0.5, freq / 10);

        let didCompleteHabit;

        for (let i = 0; i < interval + 1; i++) {

            didCompleteHabit = filledRecords[0].datesWithGaps[i] !== 0
                ? checkMarkWeight
                : 0;

            currDataPoint = currDataPoint * multiplier + didCompleteHabit * (1 - multiplier);

            if (currDataPoint < 0) currDataPoint = 0;
            if (currDataPoint > 1) currDataPoint = 1;
            dailyData.push(100 * currDataPoint);
        }
        currDataPoint = 100 * currDataPoint;
        return { dailyData, currDataPoint }
    }

    const chart = () => {
        const { data, labels } = dataForChart();
        setChartData({
            labels: labels,
            datasets: [
                {
                    label: 'habit strength',
                    data: data,
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                    },
                    backgroundColor: [
                        '#037dff55'
                    ],
                    borderWidth: 1,
                    pointRadius: 2,
                    pointHoverWidth: 4,
                }
            ]
        })
    }

    const doughnutChart = () => {
        let { currDataPoint } = dataForChart();
        currDataPoint = +currDataPoint.toFixed(2);
        const emptySection = +(100 - currDataPoint).toFixed(2);

        setCurrHabitStrength(currDataPoint);
        setChartDoughnutData({
            labels: ['Habit Strength', ''],
            datasets: [
                {
                    // label: ['habit strength'],
                    data: [currDataPoint, emptySection],
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                    },
                    backgroundColor: [
                        '#037dff55',
                        'rgba(221,221,221,0.3)'
                    ],
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0)',
                }
            ]
        })
    }

    const handleGraphResolution = (e) => {
        setGraphResolution(e.target.value);
        return e.target.value
    }

    const renderGraphResolutionOptions = () => {

        return ['day', 'week'].map(timeResolution => (
            <option
                key={timeResolution}
                id={timeResolution}
                value={timeResolution}
            >
                {timeResolution}
            </option>
        ))
    }

    return (

        <section className="habit-data-container">
            <div className="habit-name-description">
                <h1 className="habit-name">
                    {name}
                </h1>
                <p className="habit-description">
                    {description}
                </p>
            </div>

            <div className="habit-strength-wrapper">
                <div className="habit-strength-score card">
                    <p className="habit-indicator">Your Habit Strength is currently </p>
                    <p className="habit-percentage">
                        {currHabitStrength.toFixed(0)} % </p>
                </div>
                <div className="habit-strength card">
                    <Doughnut className="doughnut-chart" data={chartDoughnutData}
                        options={{
                            responsive: true,
                            // maintainAspectRatio: false,
                        }} />
                </div>
            </div>

            <div className='graph-container-wrapper'>
                <div className="time-interval-selector">
                    <label
                        htmlFor='view-type'>
                        Time Interval </label>
                    <select
                        name='view-type'
                        id='view-type'
                        aria-label='view-type'
                        value={graphResolution}
                        onChange={handleGraphResolution}
                    >
                        {renderGraphResolutionOptions()}
                    </select>
                </div>
                <div ref={graphContainerRef} className='graph-container bottom-card'>
                    <div ref={graphWrapperRef} className="graph-wrapper" style={graphWrapperStyle} >
                        <Line
                            ref={canvasRef}
                            className="line-chart" data={chartData} options={{
                                responsive: true,
                                maintainAspectRatio: false,
                            }} />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HabitProgressPage;