import React, { useState, useCallback } from 'react';
import { Transaction } from '@/entities/Transaction';
import { Budget } from '@/entities/Budget';
import { FinancialGoal } from '@/entities/FinancialGoal';
import { InvokeLLM } from '@/integrations/Core';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles, Send, TrendingUp, Shield, Lightbulb } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function Forecasting() {
    const [aiResponse, setAiResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [query, setQuery] = useState('');

    const generatePromptContext = useCallback(async () => {
        const [transactions, budgets, goals] = await Promise.all([
            Transaction.list('-date', 50), // last 50 transactions
            Budget.list(),
            FinancialGoal.list()
        ]);

        return `
            Here is the user's current financial data:

            **Recent Transactions:**
            ${transactions.map(t => `- ${t.date.split('T')[0]}: ${t.description} (${t.type}) - $${t.amount}`).join('\n')}

            **Budgets:**
            ${budgets.map(b => `- ${b.category}: $${b.amount}/${b.period}`).join('\n')}

            **Financial Goals:**
            ${goals.map(g => `- ${g.name}: Target $${g.targetAmount}, Current $${g.currentAmount}, Due ${g.targetDate}`).join('\n')}
        `;
    }, []);

    const handleAIQuery = useCallback(async (promptText) => {
        setIsLoading(true);
        setAiResponse('');
        const context = await generatePromptContext();
        const fullPrompt = `${context}\n\nBased on the data above, please answer the following: "${promptText}"`;

        try {
            const response = await InvokeLLM({ prompt: fullPrompt });
            setAiResponse(response);
        } catch (error) {
            setAiResponse('Sorry, an error occurred while contacting the AI. Please try again.');
            console.error(error);
        }
        setIsLoading(false);
    }, [generatePromptContext]);

    const handlePresetQuery = (preset) => {
        let prompt;
        switch(preset) {
            case 'forecast':
                prompt = 'Generate a 3-month financial forecast. Project income, expenses, and savings. Present it in a structured way.';
                break;
            case 'risks':
                prompt = 'Analyze my spending habits and identify potential financial risks or areas of overspending. Be specific.';
                break;
            case 'optimize':
                prompt = 'Suggest 3 actionable cost optimization strategies based on my expenses. Provide estimated monthly savings for each.';
                break;
            default:
                return;
        }
        setQuery(prompt);
        handleAIQuery(prompt);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-2">AI Financial Advisor</h1>
            <p className="text-gray-400 mb-8">Your personal AI for financial forecasting, risk analysis, and optimization.</p>

            <div className="bg-gray-950/30 border border-gray-700/50 rounded-lg p-6">
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-4">One-Click Analysis</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Button onClick={() => handlePresetQuery('forecast')} disabled={isLoading} className="bg-blue-600/80 hover:bg-blue-500/80 text-white"><TrendingUp className="w-4 h-4 mr-2"/>Generate Forecast</Button>
                        <Button onClick={() => handlePresetQuery('risks')} disabled={isLoading} className="bg-red-600/80 hover:bg-red-500/80 text-white"><Shield className="w-4 h-4 mr-2"/>Identify Risks</Button>
                        <Button onClick={() => handlePresetQuery('optimize')} disabled={isLoading} className="bg-green-600/80 hover:bg-green-500/80 text-white"><Lightbulb className="w-4 h-4 mr-2"/>Suggest Optimizations</Button>
                    </div>
                </div>

                <div className="mb-6">
                     <h3 className="text-lg font-semibold text-white mb-4">Ask a Question</h3>
                     <div className="relative">
                        <Textarea 
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="e.g., 'Can I afford a $500 monthly car payment?'"
                            className="bg-gray-800 border-gray-600 text-white pr-24"
                            rows={3}
                        />
                         <Button onClick={() => handleAIQuery(query)} disabled={isLoading || !query} className="absolute bottom-3 right-3 bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold">
                            <Send className="w-4 h-4 mr-2"/>
                            Ask AI
                        </Button>
                    </div>
                </div>

                <div className="mt-6 min-h-[200px] bg-gray-900 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-amber-400 mb-4 flex items-center">
                        <Sparkles className="w-5 h-5 mr-2" />
                        AI Response
                    </h3>
                    {isLoading ? (
                         <div className="flex items-center gap-3 text-gray-400">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>The AI is analyzing your data...</span>
                        </div>
                    ) : aiResponse ? (
                        <ReactMarkdown className="prose prose-invert prose-sm max-w-none">
                            {aiResponse}
                        </ReactMarkdown>
                    ) : (
                        <p className="text-gray-500">The AI's analysis will appear here.</p>
                    )}
                </div>
            </div>
        </div>
    );
}