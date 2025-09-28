import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Transaction } from '@/entities/Transaction';

const incomeCategories = ["Salary", "Freelance", "Investment", "Other"];
const expenseCategories = ["Housing", "Utilities", "Groceries", "Transport", "Entertainment", "Health", "Shopping", "Dining Out", "Travel", "Subscriptions", "Other"];

export default function TransactionForm({ onSubmit, transaction, onCancel }) {
    const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm({
        defaultValues: transaction || {
            type: 'expense',
            date: new Date().toISOString(),
            amount: '',
            description: ''
        }
    });
    
    const transactionType = watch('type');

    useEffect(() => {
        if (transaction) {
            Object.keys(transaction).forEach(key => {
                setValue(key, transaction[key]);
            });
        }
    }, [transaction, setValue]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-white">
            <div className="grid grid-cols-2 gap-4">
                <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="bg-gray-800 border-gray-600">
                                <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-600 text-white">
                                <SelectItem value="income" className="cursor-pointer hover:!bg-gray-700">Income</SelectItem>
                                <SelectItem value="expense" className="cursor-pointer hover:!bg-gray-700">Expense</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
                <Controller
                    name="category"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                         <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="bg-gray-800 border-gray-600">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-600 text-white">
                                {(transactionType === 'income' ? incomeCategories : expenseCategories).map(cat => (
                                    <SelectItem key={cat} value={cat} className="cursor-pointer hover:!bg-gray-700">{cat}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>
            
            <div>
                <Label htmlFor="description">Description</Label>
                <Input id="description" {...register('description', { required: true })} className="bg-gray-800 border-gray-600" />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="amount">Amount</Label>
                    <Input id="amount" type="number" step="0.01" {...register('amount', { required: true, valueAsNumber: true })} className="bg-gray-800 border-gray-600" />
                </div>
                <div>
                     <Label>Date</Label>
                     <Controller
                        name="date"
                        control={control}
                        render={({ field }) => (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start font-normal bg-gray-800 border-gray-600 hover:bg-gray-700 hover:text-white">
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {field.value ? format(new Date(field.value), 'PPP') : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0 bg-gray-900 border-gray-700" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={new Date(field.value)}
                                        onSelect={(date) => field.onChange(date.toISOString())}
                                        initialFocus
                                        className="text-white"
                                    />
                                </PopoverContent>
                            </Popover>
                        )}
                    />
                </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="ghost" onClick={onCancel} className="hover:bg-gray-700">
                    <XCircle className="w-5 h-5 mr-2" />
                    Cancel
                </Button>
                <Button type="submit" className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Save Transaction
                </Button>
            </div>
        </form>
    );
}