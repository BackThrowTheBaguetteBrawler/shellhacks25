import React from 'react';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

const categoryColors = {
    "Salary": "bg-green-500/10 text-green-400 border-green-500/20",
    "Freelance": "bg-green-500/10 text-green-300 border-green-500/20",
    "Investment": "bg-sky-500/10 text-sky-400 border-sky-500/20",
    "Housing": "bg-red-500/10 text-red-400 border-red-500/20",
    "Utilities": "bg-orange-500/10 text-orange-400 border-orange-500/20",
    "Groceries": "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    "Transport": "bg-blue-500/10 text-blue-400 border-blue-500/20",
    "Entertainment": "bg-purple-500/10 text-purple-400 border-purple-500/20",
    "Health": "bg-pink-500/10 text-pink-400 border-pink-500/20",
    "Shopping": "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    "Dining Out": "bg-rose-500/10 text-rose-400 border-rose-500/20",
    "Travel": "bg-teal-500/10 text-teal-400 border-teal-500/20",
    "Subscriptions": "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    "Other": "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

export default function TransactionList({ transactions, onEdit, onDelete }) {
    if (transactions.length === 0) {
        return (
            <div className="text-center py-20 bg-gray-800/50 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-300">No Transactions Yet</h2>
                <p className="text-gray-400 mt-2">Click "Add Transaction" to get started.</p>
            </div>
        );
    }
    
    return (
        <div className="bg-gray-950/30 rounded-lg border border-gray-700/50">
            <Table>
                <TableHeader>
                    <TableRow className="border-b-gray-700/50">
                        <TableHead className="text-white">Date</TableHead>
                        <TableHead className="text-white">Description</TableHead>
                        <TableHead className="text-white">Category</TableHead>
                        <TableHead className="text-white text-right">Amount</TableHead>
                        <TableHead className="w-10"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactions.map((transaction) => (
                        <TableRow key={transaction.id} className="border-b-gray-800/80 hover:bg-gray-800/50">
                            <TableCell className="py-4">{format(new Date(transaction.date), 'MMM d, yyyy')}</TableCell>
                            <TableCell>{transaction.description}</TableCell>
                            <TableCell>
                                <Badge variant="outline" className={`font-semibold ${categoryColors[transaction.category] || categoryColors['Other']}`}>
                                    {transaction.category}
                                </Badge>
                            </TableCell>
                            <TableCell className={`text-right font-semibold ${transaction.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                                {transaction.type === 'income' ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
                            </TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="hover:bg-gray-700">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white">
                                        <DropdownMenuItem onClick={() => onEdit(transaction)} className="cursor-pointer hover:!bg-gray-700">
                                            <Pencil className="w-4 h-4 mr-2" /> Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => onDelete(transaction.id)} className="cursor-pointer !text-red-400 hover:!bg-red-500/20">
                                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
