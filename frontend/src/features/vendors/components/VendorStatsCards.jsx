import { Store, CircleCheck, Clock, Ban } from 'lucide-react';
import '../styles/stats.css';

const STATS_CONFIG = [
    { label: 'Total Vendedores', key: 'total', icon: Store, iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
    { label: 'Activos', key: 'active', icon: CircleCheck, iconBg: 'bg-green-100', iconColor: 'text-green-600' },
    { label: 'Pendientes', key: 'pending', icon: Clock, iconBg: 'bg-yellow-100', iconColor: 'text-yellow-600' },
    { label: 'Suspendidos', key: 'suspended', icon: Ban, iconBg: 'bg-red-100', iconColor: 'text-red-600' },
];

export default function VendorStatsCards({ stats }) {
    return (
        <div className="vendors-stats-grid">
            {STATS_CONFIG.map(({ label, key, icon: Icon, iconBg, iconColor }) => (
                <div key={key} className="vendors-stats-card">
                    <div className="vendors-stats-card-body">
                        <div>
                            <p className="text-sm font-medium text-gray-500">{label}</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">{stats[key]}</p>
                        </div>
                        <div className={`vendors-stats-card-icon ${iconBg}`}>
                            <Icon className={iconColor} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
