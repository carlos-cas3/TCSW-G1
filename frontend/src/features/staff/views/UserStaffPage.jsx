import { useState } from "react";
import { Plus, RefreshCw } from "lucide-react";
import { useStaff } from "../hooks/useStaff";
import { useStaffFilters } from "../hooks/useStaffFilters";
import createStatsCards from "../../../shared/components/createStatsCards";
import { STATS_CONFIG } from "../constants/staffConstants";

const StaffStatsCards = createStatsCards(STATS_CONFIG);
import StaffTable from "../components/StaffTable";
import StaffFormModal from "../components/StaffFormModal";
import FilterBar from "../../../shared/components/FilterBar";
import { ROLE_FILTER_OPTIONS } from "../constants/staffConstants";

export default function UserStaffPage() {
  const { staff, loading, error, reload, addStaff, editStaff, removeStaff } = useStaff();
  const { filters, filteredStaff, stats, updateFilter, resetFilters } = useStaffFilters(staff);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  const filterConfig = [
    {
      key: "search",
      type: "search",
      placeholder: "Buscar por nombre, apellido, email...",
      value: filters.search,
      onChange: (v) => updateFilter("search", v),
    },
    {
      key: "role",
      type: "select",
      label: "Rol",
      value: filters.role,
      onChange: (v) => updateFilter("role", v),
      options: ROLE_FILTER_OPTIONS,
      allLabel: "Todos los roles",
    },
  ];

  const hasFilters = filters.search || filters.role !== "all";

  const handleEdit = (member) => {
    setEditingStaff(member);
  };

  const handleUpdate = async (staffId, data) => {
    await editStaff(staffId, data);
  };

  const handleDelete = async (staffId) => {
    await removeStaff(staffId);
  };

  const handleCloseFormModal = () => {
    setIsModalOpen(false);
    setEditingStaff(null);
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff</h1>
          <p className="text-gray-500 mt-1">
            {filteredStaff.length} miembro{filteredStaff.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={reload}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Actualizar
          </button>
          <button
            onClick={() => { setIsModalOpen(true); setEditingStaff(null); }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <Plus size={18} />
            Agregar Miembro
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center justify-between">
            <p className="text-red-700">{error}</p>
            <button
              onClick={reload}
              className="px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200"
            >
              Reintentar
            </button>
          </div>
        </div>
      )}

      <StaffStatsCards stats={stats} />

      <FilterBar filters={filterConfig} onReset={resetFilters} hasFilters={hasFilters} />

      <StaffTable
        staff={filteredStaff}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <StaffFormModal
        isOpen={isModalOpen || !!editingStaff}
        onClose={handleCloseFormModal}
        onSubmit={addStaff}
        onUpdate={handleUpdate}
        staff={editingStaff}
      />
    </div>
  );
}
