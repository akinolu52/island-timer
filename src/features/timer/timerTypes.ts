export interface ITime {
    hours: number;
    minutes: number;
    seconds: number;
}

export interface Todo {
    id: number;
    name: string;
    start: string;
    end: string | null;
    duration: number | null;
}

export interface ISchedules {
    id: number;
    name: string;
    start: string;
    end: string | null;
    duration: number | null;
}

export interface ITimerState {
    currentTime: ITime;
    isPlaying: boolean;
    lastUpdated: number;
    schedules?: Array<ISchedules>;
}

export enum ViewState {
    PLAY = 'play',
    STOP = 'stop',
    INIT_ADD = 'init-add',
    ADD = 'add',
}

export type IViewState = `${ViewState}`;

export interface CustomTimerHook {
    currentTimerView: IViewState;
    currentTime: string;
    isPlaying: boolean;
    play: () => void;
    stop: () => void;
    initPlus: () => void;
    removeSchedules: (id: number) => void;
    plus: (start: string, end: string) => void;
}