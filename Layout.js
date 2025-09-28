import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
    LayoutDashboard, 
    Wallet, 
    PiggyBank, 
    Target, 
    BrainCircuit,
    Settings,
    UserCircle
} from "lucide-react";
import { User } from '@/entities/User';

const navigationItems = [
    { title: "Dashboard", urlKey: "Dashboard", icon: LayoutDashboard },
    { title: "Transactions", urlKey: "Transactions", icon: Wallet },
    { title: "Budgets", urlKey: "Budgets", icon: PiggyBank },
    { title: "Forecasting", urlKey: "Forecasting", icon: BrainCircuit },
    { title: "Goals", urlKey: "Goals", icon: Target },
];

export default function Layout({ children, currentPageName }) {
    const location = useLocation();
    const [user, setUser] = React.useState(null);

    React.useEffect(() => {
        const fetchUser = async () => {
            try {
                const currentUser = await User.me();
                setUser(currentUser);
            } catch (e) {
                // Not logged in
            }
        };
        fetchUser();
    }, []);

    return (
        <div className="min-h-screen flex bg-gray-900 text-gray-100 font-sans">
            <style jsx global>{`
                :root {
                    --background: 224 71% 4%;
                    --foreground: 210 40% 98%;
                    --primary: 45 93% 47%;
                    --primary-foreground: 224 71% 4%;
                }
                .dark {
                    --background: 224 71% 4%;
                    --foreground: 210 40% 98%;
                    --primary: 45 93% 47%;
                    --primary-foreground: 224 71% 4%;
                }
            `}</style>
            <aside className="w-64 bg-gray-950/50 border-r border-gray-700/50 flex flex-col p-4">
                <div className="flex items-center gap-3 p-4 mb-8">
                    <BrainCircuit className="w-8 h-8 text-amber-400" />
                    <h1 className="text-2xl font-bold text-white tracking-wider">Financ<span className="text-amber-400">AI</span></h1>
                </div>
                <nav className="flex-1 space-y-2">
                    {navigationItems.map((item) => {
                        const pageUrl = createPageUrl(item.urlKey);
                        const isActive = location.pathname.startsWith(pageUrl);
                        return (
                            <Link
                                key={item.title}
                                to={pageUrl}
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-gray-300 hover:bg-amber-400/10 hover:text-amber-400 ${
                                    isActive ? 'bg-amber-400/20 text-amber-300 font-semibold' : ''
                                }`}
                            >
                                <item.icon className="w-5 h-5" />
                                <span>{item.title}</span>
                            </Link>
                        );
                    })}
                </nav>
                <div className="mt-auto">
                    <div className="border-t border-gray-700/50 pt-4 space-y-2">
                         <Link
                                to={createPageUrl("Settings")}
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-gray-300 hover:bg-amber-400/10 hover:text-amber-400 ${
                                    location.pathname.startsWith(createPageUrl("Settings")) ? 'bg-amber-400/20 text-amber-300 font-semibold' : ''
                                }`}
                            >
                                <Settings className="w-5 h-5" />
                                <span>Settings</span>
                            </Link>
                         <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-gray-800/50">
                            {user ? (
                                <>
                                    <UserCircle className="w-8 h-8 text-gray-400" />
                                    <div className="truncate">
                                        <p className="font-semibold text-white truncate">{user.full_name}</p>
                                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                                    </div>
                                </>
                            ): (
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gray-600 rounded-full animate-pulse"></div>
                                    <div className="space-y-2">
                                        <div className="h-3 w-24 bg-gray-600 rounded animate-pulse"></div>
                                        <div className="h-2 w-32 bg-gray-600 rounded animate-pulse"></div>
                                    </div>
                                </div>
                            )}
                         </div>
                    </div>
                </div>
            </aside>
            <main className="flex-1 overflow-auto bg-gray-900">
                <div className="p-4 sm:p-6 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}