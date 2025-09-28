import React from 'react';
import { format, differenceInDays } from 'date-fns';
import { Target, MoreHorizontal, Pencil, Trash2, Calendar } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function GoalItem({ goal, onEdit, onDelete, isCompact = false }) {
    const progress = (goal.currentAmount / goal.targetAmount) * 100;
    const daysLeft = differenceInDays(new Date(goal.targetDate), new Date());

    return (
        <div className="bg-gray-950/30 border border-gray-700/50 rounded-lg p-6 flex flex-col h-full hover:bg-gray-800/50 transition-all">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <Target className="w-6 h-6 text-amber-400" />
                    <h3 className="text-lg font-bold text-white">{goal.name}</h3>
                </div>
                {!isCompact && onEdit && onDelete && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="hover:bg-gray-700 -mt-2 -mr-2">
                                <MoreHorizontal className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white">
                            <DropdownMenuItem onClick={() => onEdit(goal)} className="cursor-pointer hover:!bg-gray-700">
                                <Pencil className="w-4 h-4 mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onDelete(goal.id)} className="cursor-pointer !text-red-400 hover:!bg-red-500/20">
                                <Trash2 className="w-4 h-4 mr-2" /> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
            
            <div className="flex-grow mt-4">
                <div className="flex justify-between items-end mb-2">
                    <span className="text-2xl font-bold text-amber-300">${goal.currentAmount.toLocaleString()}</span>
                    <span className="text-sm text-gray-400">of ${goal.targetAmount.toLocaleString()}</span>
                </div>
                <Progress value={progress} className="h-2 [&>div]:bg-amber-400" />
                <p className="text-right text-sm font-semibold mt-1 text-amber-300">{progress.toFixed(1)}%</p>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-700/50 flex justify-between items-center text-sm text-gray-400">
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Target: {format(new Date(goal.targetDate), 'MMM yyyy')}</span>
                </div>
                <span>{daysLeft > 0 ? `${daysLeft} days left` : 'Past due'}</span>
            </div>
        </div>
    );
}
