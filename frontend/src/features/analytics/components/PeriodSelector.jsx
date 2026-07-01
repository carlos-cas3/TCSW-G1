import { Calendar } from "lucide-react";

const periods = [
    { value: "hoy", label: "Hoy" },
    { value: "q1", label: "Q1" },
    { value: "q2", label: "Q2" },
    { value: "q3", label: "Q3" },
    { value: "q4", label: "Q4" },
    { value: "custom", label: "Personalizado" },
];

export default function PeriodSelector({ value, onChange }) {
    const isCustom = value === "custom";

    const handlePeriodChange = (newPeriod) => {
        if (newPeriod === "custom") {
            onChange({ period: "custom", startDate: "", endDate: "" });
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
    };

    const handleCustomStart = (e) => {
        onChange({ period: "custom", startDate: e.target.value, endDate: "" });
    };

    const handleCustomEnd = (e) => {
        onChange({ period: "custom", startDate: "", endDate: e.target.value });
    };

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
                        onChange={handleCustomStart}
                        className="px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-500">a</span>
                    <input
                        type="date"
                        onChange={handleCustomEnd}
                        className="px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            )}
        </div>
    );
}
