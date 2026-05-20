import { Pencil, Trash2 } from "lucide-react";

export default function BranchActions({ branch, onEdit, onDelete, disabled }) {
    return (
        <div className="flex gap-2">
            <button
                onClick={() => onEdit(branch)}
                className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                title="Editar sucursal"
                disabled={disabled}
            >
                <Pencil className="w-4 h-4" />
            </button>
            <button
                onClick={() => onDelete(branch)}
                className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                title="Eliminar sucursal"
                disabled={disabled}
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
    );
}