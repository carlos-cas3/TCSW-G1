import { useState, useCallback } from "react";
import { Calendar } from "lucide-react";

const periods = [
    { value: "hoy", label: "Hoy" },
    { value: "q1", label: "Q1" },
    { value: "q2", label: "Q2" },
    { value: "q3", label: "Q3" },
    { value: "q4", label: "Q4" },
    { value: "custom", label: "Personalizado" },
];

function getMonthRange() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    return {
        start: firstDay.toISOString().split("T")[0],
        end: lastDay.toISOString().split("T")[0],
    };
}

function initCustomDates(value) {
    if (value === "custom") {
        return getMonthRange();
    }
    return { start: "", end: "" };
}

export default function PeriodSelector({ value, onChange }) {
    const isCustom = value === "custom";
    const [customStart, setCustomStart] = useState(() => initCustomDates(value).start);
    const [customEnd, setCustomEnd] = useState(() => initCustomDates(value).end);

    const handlePeriodChange = useCallback((newPeriod) => {
        if (newPeriod === "custom") {
            const range = getMonthRange();
            setCustomStart(range.start);
            setCustomEnd(range.end);
            onChange({ period: "custom", startDate: range.start, endDate: range.end });
            return;
        }
        const now = new Date();
        const year = now.getFullYear();
        let startDate, endDate;

        switch (newPeriod) {
            case "hoy": {
                const today = now.toISOString().split("T")[0];
                startDate = today;
                endDate = today;
                break;
            }
            case "q1":
                startDate = `${year}-01-01`;
                endDate = `${year}-03-31`;
                break;
            case "q2":
                startDate = `${year}-04-01`;
                endDate = `${year}-06-30`;
                break;
            case "q3":
                startDate = `${year}-07-01`;
                endDate = `${year}-09-30`;
                break;
            case "q4":
                startDate = `${year}-10-01`;
                endDate = `${year}-12-31`;
                break;
            default:
                return;
        }

        onChange({ period: newPeriod, startDate, endDate });
    }, [onChange]);

    const handleCustomStart = useCallback((e) => {
        const val = e.target.value;
        setCustomStart(val);
        onChange({ period: "custom", startDate: val, endDate: customEnd });
    }, [customEnd, onChange]);

    const handleCustomEnd = useCallback((e) => {
        const val = e.target.value;
        setCustomEnd(val);
        onChange({ period: "custom", startDate: customStart, endDate: val });
    }, [customStart, onChange]);

    return (
        <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                {periods.map((p) => (
                    <button
                        key={p.value}
                        onClick={() => handlePeriodChange(p.value)}
                        className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                            value === p.value
                                ? "bg-blue-600 text-white"
                                : "bg-white text-gray-600 hover:bg-gray-50"
                        } ${p.value !== periods[periods.length - 1].value ? "border-r border-gray-300" : ""}`}
                    >
                        {p.value === "custom" ? <Calendar size={16} className="inline" /> : p.label}
                    </button>
                ))}
            </div>

            {isCustom && (
                <div className="flex items-center gap-2">
                    <input
                        type="date"
                        value={customStart}
                        onChange={handleCustomStart}
                        className="px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-500">a</span>
                    <input
                        type="date"
                        value={customEnd}
                        onChange={handleCustomEnd}
                        className="px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            )}
        </div>
    );
}
