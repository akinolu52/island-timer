"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    TimePickerInput,
} from "@/components";
import { useRef } from "react";

interface TimePickerDemoProps {
    date: Date | undefined;
    setDate: (date: Date | undefined) => void;
}

export function TimePicker({ date, setDate }: TimePickerDemoProps) {
    const minuteRef = useRef<HTMLInputElement>(null);
    const hourRef = useRef<HTMLInputElement>(null);
    const secondRef = useRef<HTMLInputElement>(null);

    return (
        <div className="flex items-center border rounded-lg px-4">
            <TimePickerInput
                picker="hours"
                date={date}
                setDate={setDate}
                ref={hourRef}
                onRightFocus={() => minuteRef.current?.focus()}
                className="w-5 border-none p-0 focus-visible:ring-offset-0 focus-visible:ring-0"
            />
            <span className="text-base">:</span>
            <TimePickerInput
                picker="minutes"
                date={date}
                setDate={setDate}
                ref={minuteRef}
                onLeftFocus={() => hourRef.current?.focus()}
                onRightFocus={() => minuteRef.current?.focus()}
                className="w-5 border-none p-0 focus-visible:ring-offset-0 focus-visible:ring-0"
            />
            <TimePickerInput
                picker="seconds"
                date={date}
                setDate={setDate}
                ref={secondRef}
                onLeftFocus={() => minuteRef.current?.focus()}
                className="hidden"
            />
            <Select>
                <SelectTrigger className="w-6 p-0 ml-0.5 border-none [&>span]:w-full text-base focus-visible:ring-offset-0 focus-visible:ring-0">
                    <SelectValue placeholder="AM" />
                </SelectTrigger>
                <SelectContent defaultValue="AM" className="w-12">
                    <SelectItem value="AM">AM</SelectItem>
                    <SelectItem value="PM">PM</SelectItem>
                </SelectContent>
            </Select>
            <span className="text-base ml-4 text-gray-400">Today</span>
        </div>
    );
}