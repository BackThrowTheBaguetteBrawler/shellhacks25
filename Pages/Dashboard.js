import React, { useState, useEffect } from 'react';
import { Transaction } from '@/entities/Transaction';
import { FinancialGoal } from '@/entities/FinancialGoal';
import { Loader2, TrendingUp, TrendingDown, DollarSign, PiggyBank } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import SummaryChart from '../components/dashboard/SummaryChart';
import CategoryDonutChart from '../components/dashboard/CategoryDonutChart';
import GoalsOverview from '../components/dashboard/GoalsOverview';

export default function Dashboard() {
    const [transactions, setTransactions] = useState([]);
    const [goals, setGoals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const [transactionData, goalData] = await Promise.all([
                Transaction.list('-date'),
                FinancialGoal.list()
            ]);
            setTransactions(transactionData);
            setGoals(goalData);
            setIsLoading(false);
        };
        fetchData();
    }, []);

    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const netBalance = totalIncome - totalExpense;

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full min-h-[60vh]">
                <Loader2 className="w-12 h-12 text-amber-400 animate-spin" />
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-gray-400 mb-8">Your real-time financial command center.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard 
                    title="Total Income"
                    value={totalIncome}
                    icon={TrendingUp}
                    color="text-green-400"
                    isCurrency
                />
                <StatCard 
                    title="Total Expense"
                    value={totalExpense}
                    icon={TrendingDown}
                    color="text-red-400"
                    isCurrency
                />
                <StatCard 
                    title="Net Balance"
                    value={netBalance}
                    icon={DollarSign}
                    color={netBalance >= 0 ? "text-green-400" : "text-red-400"}
                    isCurrency
                />
                <StatCard 
                    title="Active Goals"
                    value={goals.length}
                    icon={PiggyBank}
                    color="text-amber-400"
                />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-gray-950/30 rounded-lg border border-gray-700/50 p-6">
                    <h3 className="text-xl font-semibold text-white mb-4">Income vs. Expense</h3>
                    <SummaryChart transactions={transactions} />
                </div>
                <div className="bg-gray-950/30 rounded-lg border border-gray-700/50 p-6">
                     <h3 className="text-xl font-semibold text-white mb-4">Expense by Category</h3>
                    <CategoryDonutChart transactions={transactions} />
                </div>
            </div>

            <div className="mt-8">
                <GoalsOverview goals={goals} />
            </div>
        </div>
    );
}