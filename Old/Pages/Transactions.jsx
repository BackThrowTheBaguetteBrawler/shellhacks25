import React, { useState, useEffect, useCallback } from "react";
import { Transaction } from "@/entities/Transaction";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2 } from "lucide-react";
import TransactionList from "../components/transactions/TransactionList";
import TransactionForm from "../components/transactions/TransactionForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);

    const loadTransactions = useCallback(async () => {
        setIsLoading(true);
        const data = await Transaction.list("-date");
        setTransactions(data);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        loadTransactions();
    }, [loadTransactions]);

    const handleFormSubmit = async (data) => {
        if (editingTransaction) {
            await Transaction.update(editingTransaction.id, data);
        } else {
            await Transaction.create(data);
        }
        await loadTransactions();
        setIsDialogOpen(false);
        setEditingTransaction(null);
    };

    const handleEdit = (transaction) => {
        setEditingTransaction(transaction);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id) => {
        await Transaction.delete(id);
        await loadTransactions();
    };
    
    const openNewTransactionDialog = () => {
        setEditingTransaction(null);
        setIsDialogOpen(true);
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Transactions</h1>
                    <p className="text-gray-400">A record of your income and expenses.</p>
                </div>
                 <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={openNewTransactionDialog} className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold">
                            <PlusCircle className="w-5 h-5 mr-2" />
                            Add Transaction
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-900 border-gray-700 text-white">
                        <DialogHeader>
                            <DialogTitle className="text-amber-400">
                                {editingTransaction ? "Edit Transaction" : "New Transaction"}
                            </DialogTitle>
                        </DialogHeader>
                        <TransactionForm
                            onSubmit={handleFormSubmit}
                            transaction={editingTransaction}
                            onCancel={() => setIsDialogOpen(false)}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
                </div>
            ) : (
                <TransactionList
                    transactions={transactions}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}
        </div>
    );
}