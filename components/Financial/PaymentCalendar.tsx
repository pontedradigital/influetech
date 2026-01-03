import React, { useState, useEffect } from 'react';
import { FinancialService } from '../../services/FinancialService';

export const PaymentCalendar: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [transactions, setTransactions] = useState<any[]>([]);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const month = currentDate.getMonth() + 1;
                const year = currentDate.getFullYear();
                const data = await FinancialService.getAll(month, year);
                setTransactions(data.filter((t: any) => t.type === 'INCOME'));
            } catch (err) {
                console.error(err);
            }
        };
        fetchTransactions();
    }, [currentDate]);

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const blanks = Array.from({ length: firstDay }, (_, i) => i);

    const getDayTransactions = (day: number) => {
        return transactions.filter(t => {
            const tDate = new Date(t.date);
            // Adjust for timezone to ensure we show the correct calendar day
            // If the date is stored as UTC (e.g. T00:00:00Z), and we are in -3h, it might show previous day.
            // Using getUTCDate() matches the stored date if it was stored as UTC YYYY-MM-DD.
            // However, if we just want to match the visual day:
            const dayOfMonth = tDate.getUTCDate(); // Assuming backend stores as UTC midnight for pure dates
            return dayOfMonth === day;
        });
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-green-500">calendar_today</span>
                Fluxo de Caixa (Recebimentos)
            </h3>

            <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold text-gray-500 uppercase">
                <div>Dom</div><div>Seg</div><div>Ter</div><div>Qua</div><div>Qui</div><div>Sex</div><div>Sab</div>
            </div>

            <div className="grid grid-cols-7 gap-2">
                {blanks.map(b => <div key={`blank-${b}`} className="h-24 bg-transparent"></div>)}
                {days.map(day => {
                    const payments = getDayTransactions(day);
                    const totalDay = payments.reduce((acc, curr) => acc + Number(curr.amount), 0);

                    return (
                        <div key={day} className="h-24 border border-gray-100 dark:border-gray-700 rounded-lg p-2 transition-all hover:shadow-md bg-gray-50 dark:bg-gray-900/50">
                            <div className="text-right text-xs font-bold text-gray-400 mb-1">{day}</div>
                            {payments.length > 0 && (
                                <div className="space-y-1">
                                    {payments.slice(0, 2).map((p, idx) => (
                                        <div key={idx} className="text-[10px] bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-1 py-0.5 rounded truncate" title={p.name}>
                                            {p.name}
                                        </div>
                                    ))}
                                    {payments.length > 2 && (
                                        <div className="text-[10px] text-gray-500 text-center">+{payments.length - 2}</div>
                                    )}
                                    <div className="text-[10px] font-bold text-green-600 text-right pt-1">
                                        R$ {totalDay}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
