import { useState, useCallback } from "react";
import { Calendar } from "lucide-react";

const periods = [
    { value: "mtd", label: "Mes" },
    { value: "q1", label: "Q1" },
    { value: "q2", label: "Q2" },
    { value: "q3", label: "Q3" },
    { value: "q4", label: "Q4" },
    { value: "custom", label: "Personalizado" },
];

function format(date) {
    return date.toISOString().split("T")[0];
}

function getPreviousCustomRange(start, end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const duration = (endDate - startDate) / (1000 * 60 * 60 * 24);
    const prevEnd = new Date(startDate);
    prevEnd.setDate(prevEnd.getDate() - 1);
    const prevStart = new Date(prevEnd);
    prevStart.setDate(prevStart.getDate() - duration);
    return {
        startDate: format(prevStart),
        endDate: format(prevEnd),
    };
}

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
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();

        if (newPeriod === "mtd") {
            const startDate = new Date(year, month, 1);
            const endDate = now;
            const prevStart = new Date(year, month - 1, 1);
            const prevEnd = new Date(year, month - 1, endDate.getDate());
            onChange({
                period: "mtd",
                current: { startDate: format(startDate), endDate: format(endDate) },
                previous: { startDate: format(prevStart), endDate: format(prevEnd) },
            });
            return;
        }

        if (newPeriod === "custom") {
            const range = getMonthRange();
            setCustomStart(range.start);
            setCustomEnd(range.end);
            const previous = getPreviousCustomRange(range.start, range.end);
            onChange({
                period: "custom",
                current: { startDate: range.start, endDate: range.end },
                previous,
            });
            return;
        }

        const quarters = {
            q1: { start: `${year}-01-01`, end: `${year}-03-31` },
            q2: { start: `${year}-04-01`, end: `${year}-06-30` },
            q3: { start: `${year}-07-01`, end: `${year}-09-30` },
            q4: { start: `${year}-10-01`, end: `${year}-12-31` },
        };

        const current = quarters[newPeriod];
        if (!current) return;

        onChange({
            period: newPeriod,
            current,
            previous: {
                startDate: `${year - 1}-${current.start.slice(5)}`,
                endDate: `${year - 1}-${current.end.slice(5)}`,
            },
        });
    }, [onChange]);

    const handleCustomStart = useCallback((e) => {
        const val = e.target.value;
        setCustomStart(val);
        const previous = getPreviousCustomRange(val, customEnd);
        onChange({
            period: "custom",
            current: { startDate: val, endDate: customEnd },
            previous,
        });
    }, [customEnd, onChange]);

    const handleCustomEnd = useCallback((e) => {
        const val = e.target.value;
        setCustomEnd(val);
        const previous = getPreviousCustomRange(customStart, val);
        onChange({
            period: "custom",
            current: { startDate: customStart, endDate: val },
            previous,
        });
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
