import { STORAGE_KEYS } from '@/constants';
import { useEffect, useState } from 'react';
import { ISchedules, ViewState, type ITime, type ITimerState, type IViewState } from "./timerTypes";

const parseTime = (timeString: string): ITime => {
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    return { hours, minutes, seconds };
};

const formatTimeHMS = ({ hours, minutes, seconds }: ITime): string => {
    const format = (value: number) => (value < 10 ? `0${value}` : `${value}`);
    return `${format(hours)}:${format(minutes)}:${format(seconds)}`;
};

const formatTimeHM = (date: Date): string => {
    let hours: number = date.getHours();
    const minutes: number = date.getMinutes();
    const ampm: string = hours >= 12 ? 'pm' : 'am';

    hours = hours % 12;
    hours = hours === 0 ? 12 : hours; // Handle midnight (12:00 am)

    const formattedTime: string = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${ampm}`;

    return formattedTime;
};

const calculateDuration = (startDate: Date, endDate: Date): number | null => {
    if (endDate) {
        const durationInMillis = endDate.getTime() - startDate.getTime();
        const durationInSeconds = durationInMillis / 1000;
        return durationInSeconds;
    }

    return null;
};

const storageKey = STORAGE_KEYS.TIMER;

const useTimer = (startTime = '00:00:00') => {
    const storedState = localStorage.getItem(storageKey);
    const initialTimerState: ITimerState = storedState ? JSON.parse(storedState) : {
        currentTime: parseTime(startTime),
        isPlaying: false,
        lastUpdated: Date.now(),
        schedules: [],
    };

    const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();

    const [currentTimerView, setCurrentTimerView] = useState<IViewState>(ViewState.PLAY);
    const [timerState, setTimerState] = useState<ITimerState>(initialTimerState);

    useEffect(() => {
        const handleStorageEvent = (event: StorageEvent) => {
            if (event.key === storageKey && event.newValue) {
                const newState = JSON.parse(event.newValue);

                if (newState.lastUpdated > timerState.lastUpdated) {
                    setTimerState(newState);
                }
            }
        };

        window.addEventListener('storage', handleStorageEvent);

        return () => {
            window.removeEventListener('storage', handleStorageEvent);
        };
    }, [timerState.lastUpdated]);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        if (timerState.isPlaying) {
            intervalId = setInterval(() => {
                setTimerState((prev) => {
                    const newTime: ITime = { ...prev.currentTime };
                    newTime.seconds++;

                    if (newTime.seconds === 60) {
                        newTime.seconds = 0;
                        newTime.minutes++;
                    }

                    if (newTime.minutes === 60) {
                        newTime.minutes = 0;
                        newTime.hours++;
                    }

                    // Save the current time and isPlaying state to local storage
                    const newState: ITimerState = {
                        currentTime: newTime,
                        isPlaying: true,
                        lastUpdated: Date.now()
                    };
                    localStorage.setItem(storageKey, JSON.stringify(newState));

                    return newState;
                });
            }, 1000);
        }

        return () => clearInterval(intervalId);
    }, [timerState.isPlaying, timerState.lastUpdated]);

    const play = () => {
        setCurrentTimerView(ViewState.PLAY);
        setTimerState((prev) => {
            // Save the isPlaying state to local storage
            const newState: ITimerState = { ...prev, isPlaying: true, lastUpdated: Date.now() };
            localStorage.setItem(storageKey, JSON.stringify(newState));
            return newState;
        });
    };

    const stop = () => {
        setCurrentTimerView(ViewState.PLAY);
        setTimerState((prev) => {
            // Save the isPlaying state to local storage
            const newState: ITimerState = {
                ...prev,
                isPlaying: false,
                lastUpdated: Date.now()
            };
            localStorage.setItem(storageKey, JSON.stringify(newState));
            return newState;
        });
    };

    const initPlus = () => setCurrentTimerView(ViewState.INIT_ADD);

    const plus = () => {
        if (!startDate || !endDate) {
            return;
        }

        setTimerState((prev) => {
            const prevSchedule = prev.schedules;

            let schedules: ISchedules[] = [{
                id: new Date().getTime(),
                name: (Math.random() + 1).toString(36).substring(10),
                start: formatTimeHM(startDate),
                end: formatTimeHM(endDate),
                duration: calculateDuration(startDate, endDate),
            }]

            if (prevSchedule) {
                schedules = [...schedules, ...prevSchedule];
            }

            const newState: ITimerState = {
                ...prev,
                isPlaying: false,
                lastUpdated: Date.now(),
                schedules,
            };

            localStorage.setItem(storageKey, JSON.stringify(newState));
            return newState;
        });
        setCurrentTimerView(ViewState.PLAY);
    };

    const removeSchedules = (id: number) => {
        const schedules = timerState.schedules || [];
        if (schedules?.length < 1) {
            return;
        }

        const updatedSchedules = schedules?.filter((schedule) => schedule.id !== id);
        setTimerState((prev) => {
            const newState = {
                ...prev,
                lastUpdated: Date.now(),
                schedules: updatedSchedules
            };

            localStorage.setItem(storageKey, JSON.stringify(newState));
            return newState;
        });
    };

    return {
        currentTime: formatTimeHMS(timerState.currentTime),
        isPlaying: timerState.isPlaying,
        schedules: timerState.schedules || [],
        currentTimerView,
        removeSchedules,
        startDate,
        setStartDate,
        setEndDate,
        endDate,
        initPlus,
        play,
        stop,
        plus,
    };
};

export { useTimer };
