import createStatsCards from "../components/createStatsCards";
import { Store, CircleCheck, Clock, Ban, CircleX, Settings, Package, CircleCheckBig, Users, UserCheck, UserCog } from "lucide-react";

const mockVendorStats = { total: 150, active: 98, pending: 32, suspended: 20 };
const mockBranchStats = { total: 45, active: 30, inactive: 10, maintaining: 5 };
const mockStaffStats = { total: 200, sellers: 140, supervisors: 60 };
const mockCatalogStats = { total: 1200, active: 800, inactive: 400 };
const mockEmptyStats = {};
const mockSingleStats = { total: 42 };

const VendorStatsCards = createStatsCards([
  { label: "Total Vendedores", valueKey: "total", icon: Store, color: "blue" },
  { label: "Activos", valueKey: "active", icon: CircleCheck, color: "green" },
  { label: "Pendientes", valueKey: "pending", icon: Clock, color: "yellow" },
  { label: "Suspendidos", valueKey: "suspended", icon: Ban, color: "red" },
]);

const BranchStatsCards = createStatsCards([
  { label: "Total Sucursales", valueKey: "total", icon: Store, color: "blue" },
  { label: "Activas", valueKey: "active", icon: CircleCheck, color: "green" },
  { label: "Inactivas", valueKey: "inactive", icon: CircleX, color: "red" },
  { label: "En Mantenimiento", valueKey: "maintaining", icon: Settings, color: "yellow" },
]);

const StaffStatsCards = createStatsCards([
  { label: "Total Staff", valueKey: "total", icon: Users, color: "blue" },
  { label: "Sellers", valueKey: "sellers", icon: UserCheck, color: "green" },
  { label: "Supervisores", valueKey: "supervisors", icon: UserCog, color: "purple" },
]);

const CatalogStatsCards = createStatsCards([
  { label: "Total Productos", valueKey: "total", icon: Package, color: "blue" },
  { label: "Activos", valueKey: "active", icon: CircleCheckBig, color: "green" },
  { label: "Inactivos", valueKey: "inactive", icon: CircleX, color: "red" },
]);

const SingleCard = createStatsCards([
  { label: "Unico Dato", valueKey: "total", icon: Package, color: "indigo" },
]);

export default function StatsCardsPlayground() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-10">
      <h1 className="text-2xl font-bold">StatsCards Playground</h1>

      <section>
        <h2 className="text-lg font-semibold mb-2 text-blue-700">Vendors (4 cards)</h2>
        <VendorStatsCards stats={mockVendorStats} />
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2 text-green-700">Branches (4 cards)</h2>
        <BranchStatsCards stats={mockBranchStats} />
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2 text-purple-700">Staff (3 cards)</h2>
        <StaffStatsCards stats={mockStaffStats} />
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2 text-orange-700">Catalog (3 cards)</h2>
        <CatalogStatsCards stats={mockCatalogStats} />
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2 text-yellow-600">Single card</h2>
        <SingleCard stats={mockSingleStats} />
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2 text-red-600">Empty (sin stats)</h2>
        <VendorStatsCards stats={mockEmptyStats} />
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2 text-gray-500">Sin props (undefined)</h2>
        <VendorStatsCards />
      </section>
    </div>
  );
}
