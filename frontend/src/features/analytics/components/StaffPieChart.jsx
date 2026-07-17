import { useState, useEffect, useMemo, useCallback } from "react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { Users } from "lucide-react";
import { getStaff } from "../../staff/services/staff.service";
import ErrorState from "../../../shared/components/Feedback/ErrorState";

const ROLE_COLORS = {
    3: "#22c55e",
    4: "#a855f7",
};

const ROLE_LABELS = {
    3: "Vendedores",
    4: "Supervisores",
};

function ChartSkeleton() {
    return (
        <div className="animate-pulse bg-white rounded-lg border border-gray-200 p-5">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
            <div className="h-64 bg-gray-100 rounded" />
        </div>
    );
}

function ChartEmpty() {
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-5">
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <Users size={40} className="mb-3" />
                <p className="text-sm font-medium">Sin miembros de staff</p>
                <p className="text-xs mt-1">No hay personal registrado</p>
            </div>
        </div>
    );
}

function CustomTooltip({ active, payload }) {
    if (!active || !payload?.length) return null;
    const entry = payload[0];
    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
            <p className="text-sm font-semibold text-gray-900">
                {entry.name}: {entry.value}
            </p>
            <p className="text-xs text-gray-500">
                {((entry.payload.percent || 0) * 100).toFixed(1)}% del total
            </p>
        </div>
    );
}

function renderLegend({ payload }) {
    return (
        <div className="flex justify-center gap-4 mt-3">
            {payload.map((entry) => (
                <div key={entry.value} className="flex items-center gap-1.5 text-xs text-gray-600">
                    <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: entry.color }}
                    />
                    {entry.value}
                </div>
            ))}
        </div>
    );
}

export default function StaffPieChart() {
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadStaff = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await getStaff();
            setStaff(Array.isArray(res) ? res : (res.data ?? []));
        } catch (err) {
            setError(err.message || "Error al cargar staff");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadStaff();
    }, [loadStaff]);

    const chartData = useMemo(() => {
        const sellers = staff.filter((m) => m.role_id === 3).length;
        const supervisors = staff.filter((m) => m.role_id === 4).length;
        const total = sellers + supervisors;
        return [
            {
                name: ROLE_LABELS[3],
                value: sellers,
                color: ROLE_COLORS[3],
                percent: total ? sellers / total : 0,
            },
            {
                name: ROLE_LABELS[4],
                value: supervisors,
                color: ROLE_COLORS[4],
                percent: total ? supervisors / total : 0,
            },
        ].filter((item) => item.value > 0);
    }, [staff]);

    if (loading) return <ChartSkeleton />;
    if (error) return <ErrorState error={error} onRetry={loadStaff} />;
    if (!chartData.length) return <ChartEmpty />;

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Distribución del Staff</h3>
            <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={3}
                        dataKey="value"
                    >
                        {chartData.map((entry) => (
                            <Cell key={entry.name} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend content={renderLegend} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
