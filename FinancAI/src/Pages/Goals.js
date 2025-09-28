import React, { useState, useEffect } from 'react';
import { FinancialGoal } from '@/entities/FinancialGoal';
import { Button } from '@/components/ui/button';
import { PlusCircle, Loader2 } from 'lucide-react';
import GoalItem from '../components/goals/GoalItem';
import GoalForm from '../components/goals/GoalForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Goals() {
    const [goals, setGoals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingGoal, setEditingGoal] = useState(null);

    const loadGoals = async () => {
        setIsLoading(true);
        const data = await FinancialGoal.list();
        setGoals(data);
        setIsLoading(false);
    };

    useEffect(() => {
        loadGoals();
    }, []);

    const handleFormSubmit = async (data) => {
        if (editingGoal) {
            await FinancialGoal.update(editingGoal.id, data);
        } else {
            await FinancialGoal.create(data);
        }
        await loadGoals();
        setIsDialogOpen(false);
        setEditingGoal(null);
    };

    const handleEdit = (goal) => {
        setEditingGoal(goal);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id) => {
        await FinancialGoal.delete(id);
        await loadGoals();
    };
    
    const openNewGoalDialog = () => {
        setEditingGoal(null);
        setIsDialogOpen(true);
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Financial Goals</h1>
                    <p className="text-gray-400">Set, track, and achieve your financial targets.</p>
                </div>
                 <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={openNewGoalDialog} className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold">
                            <PlusCircle className="w-5 h-5 mr-2" />
                            New Goal
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-900 border-gray-700 text-white">
                        <DialogHeader>
                            <DialogTitle className="text-amber-400">
                                {editingGoal ? "Edit Goal" : "Set a New Goal"}
                            </DialogTitle>
                        </DialogHeader>
                        <GoalForm
                            onSubmit={handleFormSubmit}
                            goal={editingGoal}
                            onCancel={() => setIsDialogOpen(false)}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
                </div>
            ) : goals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {goals.map(goal => (
                        <GoalItem key={goal.id} goal={goal} onEdit={handleEdit} onDelete={handleDelete} />
                    ))}
                </div>
            ) : (
                 <div className="text-center py-20 bg-gray-800/50 rounded-lg">
                    <h2 className="text-xl font-semibold text-gray-300">No Goals Defined</h2>
                    <p className="text-gray-400 mt-2">Click "New Goal" to set your first financial target.</p>
                </div>
            )}
        </div>
    );
}