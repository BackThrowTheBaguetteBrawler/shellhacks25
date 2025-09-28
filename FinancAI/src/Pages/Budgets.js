import React, { useState, useEffect } from 'react';
import { Budget } from '@/entities/Budget';
import { Transaction } from '@/entities/Transaction';
import { Button } from '@/components/ui/button';
import { PlusCircle, Loader2 } from 'lucide-react';
import BudgetItem from '../components/budgets/BudgetItem';
import BudgetForm from '../components/budgets/BudgetForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Budgets() {
    const [budgets, setBudgets] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingBudget, setEditingBudget] = useState(null);

    const loadData = async () => {
        setIsLoading(true);
        const [budgetData, transactionData] = await Promise.all([
            Budget.list(),
            Transaction.list('-date')
        ]);
        setBudgets(budgetData);
        setTransactions(transactionData);
        setIsLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleFormSubmit = async (data) => {
        if (editingBudget) {
            await Budget.update(editingBudget.id, data);
        } else {
            await Budget.create(data);
        }
        await loadData();
        setIsDialogOpen(false);
        setEditingBudget(null);
    };

    const handleEdit = (budget) => {
        setEditingBudget(budget);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id) => {
        await Budget.delete(id);
        await loadData();
    };
    
    const openNewBudgetDialog = () => {
        setEditingBudget(null);
        setIsDialogOpen(true);
    }

    const getSpentAmount = (category) => {
        const currentMonth = new Date().toISOString().slice(0, 7);
        return transactions
            .filter(t => t.type === 'expense' && 
                     t.category === category && 
                     t.date.startsWith(currentMonth))
            .reduce((sum, t) => sum + t.amount, 0);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Budgets</h1>
                    <p className="text-gray-400">Set spending limits and track your progress.</p>
                </div>
                 <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={openNewBudgetDialog} className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold">
                            <PlusCircle className="w-5 h-5 mr-2" />
                            Add Budget
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-900 border-gray-700 text-white">
                        <DialogHeader>
                            <DialogTitle className="text-amber-400">
                                {editingBudget ? "Edit Budget" : "Create Budget"}
                            </DialogTitle>
                        </DialogHeader>
                        <BudgetForm
                            onSubmit={handleFormSubmit}
                            budget={editingBudget}
                            onCancel={() => setIsDialogOpen(false)}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
                </div>
            ) : budgets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {budgets.map(budget => (
                        <BudgetItem 
                            key={budget.id} 
                            budget={budget} 
                            spent={getSpentAmount(budget.category)}
                            onEdit={handleEdit} 
                            onDelete={handleDelete} 
                        />
                    ))}
                </div>
            ) : (
                 <div className="text-center py-20 bg-gray-800/50 rounded-lg">
                    <h2 className="text-xl font-semibold text-gray-300">No Budgets Set</h2>
                    <p className="text-gray-400 mt-2">Click "Add Budget" to create your first spending limit.</p>
                </div>
            )}
        </div>
    );
}