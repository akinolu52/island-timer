import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Toggle } from '@/components';
import { cn } from '@/lib/utils';
import { ArrowRightIcon, PlayIcon, PlusIcon, SquareIcon, TrashIcon } from 'lucide-react';
import { TimePicker } from "./TimePicker";
import { ViewState } from './timerTypes';
import { useTimer } from './useTimer';

export function Timer() {
    const {
        play, stop, plus, initPlus,
        startDate, setStartDate, endDate, setEndDate, schedules,
        removeSchedules, currentTimerView, currentTime, isPlaying
    } = useTimer();

    return (
        <div className="">
            <div className="py-4 gap-10 px-10 border flex items-center justify-end">
                {currentTimerView === ViewState.PLAY && (
                    <span className="font-medium">{currentTime}</span>)
                }

                {currentTimerView === ViewState.INIT_ADD && (
                    <div className="flex items-center gap-4">
                        <TimePicker setDate={setStartDate} date={startDate} />
                        <ArrowRightIcon className='w-6 h-5' />
                        <TimePicker setDate={setEndDate} date={endDate} />
                    </div>
                )}

                {isPlaying ? (
                    <Toggle className='rounded-full border w-10 h-10 bg-red-500 text-white' onClick={stop}>
                        <SquareIcon className='w-4 h-4 flex-shrink-0' />
                    </Toggle>
                ) : (
                    <div className="border border-gray-400 w-24 flex items-center rounded-3xl overflow-hidden">
                        <Toggle
                            className={cn(
                                'p-0 w-12 rounded-none bg-background text-foreground',
                                currentTimerView === ViewState.PLAY && "bg-blue-500 text-white",
                            )}
                            onClick={play}
                        >
                            <PlayIcon className='w-4 h-4' />
                        </Toggle>

                        <Toggle
                            className={cn(
                                'p-0 w-12 rounded-none bg-background text-foreground',
                                [ViewState.INIT_ADD, ViewState.ADD].includes(currentTimerView as ViewState) && "!bg-blue-500 !text-white",
                            )}
                            onClick={() => { currentTimerView === ViewState.INIT_ADD ? plus() : initPlus() }}
                        >
                            <PlusIcon className='w-4 h-4' />
                        </Toggle>
                    </div>
                )}
            </div>

            {schedules.length > 0 && (
                <section className="px-40 pt-20">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">TASK</TableHead>
                                <TableHead>START</TableHead>
                                <TableHead>END</TableHead>
                                <TableHead>DURATION</TableHead>
                                <TableHead className="text-right">&nbsp;</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {schedules.map(({ id, name, start, end, duration }) => (
                                <TableRow key={id}>
                                    <TableCell className="font-medium">{name}</TableCell>
                                    <TableCell>{start}</TableCell>
                                    <TableCell>{end}</TableCell>
                                    <TableCell>{duration}</TableCell>
                                    <TableCell className="text-right" title="remove schedules">
                                        <TrashIcon className='w-4 h-4 cursor-pointer' onClick={() => removeSchedules(id)} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </section>
            )}
        </div>
    );
}