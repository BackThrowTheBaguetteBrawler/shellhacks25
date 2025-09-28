import React, { useState, useEffect } from 'react';
import { User } from '@/entities/User';
import { Transaction } from '@/entities/Transaction';
import { Budget } from '@/entities/Budget';
import { FinancialGoal } from '@/entities/FinancialGoal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Download, Upload, Save, Loader2, LogOut, User as UserIcon } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function Settings() {
    const [user, setUser] = useState(null);
    const [fullName, setFullName] = useState('');
    const [isSaving, setSaving] = useState(false);
    const [isExporting, setExporting] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const currentUser = await User.me();
                setUser(currentUser);
                setFullName(currentUser.full_name || '');
            } catch (e) {
                console.error('Error fetching user:', e);
            }
        };
        fetchUser();
    }, []);

    const handleSaveProfile = async () => {
        setSaving(true);
        try {
            await User.updateMyUserData({ full_name: fullName });
            setMessage('Profile updated successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Error updating profile. Please try again.');
            setTimeout(() => setMessage(''), 3000);
        }
        setSaving(false);
    };

    const handleExportData = async () => {
        setExporting(true);
        try {
            const [transactions, budgets, goals] = await Promise.all([
                Transaction.list(),
                Budget.list(),
                FinancialGoal.list()
            ]);

            const exportData = {
                exported_at: new Date().toISOString(),
                transactions,
                budgets,
                financial_goals: goals
            };

            const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
                type: 'application/json' 
            });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `financ-ai-data-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            setMessage('Data exported successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Error exporting data. Please try again.');
            setTimeout(() => setMessage(''), 3000);
        }
        setExporting(false);
    };

    const handleLogout = async () => {
        try {
            await User.logout();
            window.location.reload();
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    if (!user) {
        return (
            <div className="flex justify-center items-center h-full min-h-[60vh]">
                <Loader2 className="w-12 h-12 text-amber-400 animate-spin" />
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
            <p className="text-gray-400 mb-8">Manage your account and app preferences.</p>

            {message && (
                <Alert className="mb-6 bg-green-500/10 border-green-500/20 text-green-400">
                    <AlertDescription>{message}</AlertDescription>
                </Alert>
            )}

            <div className="space-y-6 max-w-2xl">
                {/* Profile Settings */}
                <Card className="bg-gray-950/30 border-gray-700/50">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <UserIcon className="w-5 h-5 text-amber-400" />
                            Profile Settings
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="email" className="text-gray-300">Email Address</Label>
                            <Input 
                                id="email"
                                value={user.email} 
                                disabled 
                                className="bg-gray-800 border-gray-600 text-gray-400"
                            />
                        </div>
                        <div>
                            <Label htmlFor="fullName" className="text-gray-300">Full Name</Label>
                            <Input 
                                id="fullName"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="bg-gray-800 border-gray-600 text-white"
                                placeholder="Enter your full name"
                            />
                        </div>
                        <div>
                            <Label className="text-gray-300">Role</Label>
                            <Input 
                                value={user.role} 
                                disabled 
                                className="bg-gray-800 border-gray-600 text-gray-400"
                            />
                        </div>
                        <Button 
                            onClick={handleSaveProfile} 
                            disabled={isSaving}
                            className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold"
                        >
                            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                            Update Profile
                        </Button>
                    </CardContent>
                </Card>

                {/* Data Management */}
                <Card className="bg-gray-950/30 border-gray-700/50">
                    <CardHeader>
                        <CardTitle className="text-white">Data Management</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button 
                                onClick={handleExportData} 
                                disabled={isExporting}
                                variant="outline"
                                className="border-gray-600 text-white hover:bg-gray-700 flex-1"
                            >
                                {isExporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                                Export All Data
                            </Button>
                        </div>
                        <p className="text-sm text-gray-400">
                            Export your transactions, budgets, and goals as a JSON file for backup purposes.
                        </p>
                    </CardContent>
                </Card>

                {/* Account Actions */}
                <Card className="bg-gray-950/30 border-gray-700/50">
                    <CardHeader>
                        <CardTitle className="text-white">Account</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Separator className="mb-4 bg-gray-700" />
                        <Button 
                            onClick={handleLogout}
                            variant="outline"
                            className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-500"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign Out
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}