import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export default function CategoryMultiSelect({ categories, selectedIds, onChange }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleToggle = (id) => {
        const next = selectedIds.includes(id)
            ? selectedIds.filter(i => i !== id)
            : [...selectedIds, id];
        onChange(next);
    };

    const selectedNames = categories
        .filter(c => selectedIds.includes(c.category_id))
        .map(c => c.category_name);

    const label = selectedNames.length === 0
        ? "Todas las categorías"
        : selectedNames.length === 1
            ? selectedNames[0]
            : `${selectedNames.length} categorías`;

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="flex items-center justify-between w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <span className={selectedNames.length === 0 ? "text-gray-400" : "text-gray-900"}>
                    {label}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
            </button>
            {open && (
                <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {categories.map(cat => (
                        <label
                            key={cat.category_id}
                            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                        >
                            <input
                                type="checkbox"
                                checked={selectedIds.includes(cat.category_id)}
                                onChange={() => handleToggle(cat.category_id)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            {cat.category_name}
                        </label>
                    ))}
                    {categories.length === 0 && (
                        <p className="px-3 py-2 text-sm text-gray-400">Sin categorías</p>
                    )}
                </div>
            )}
        </div>
    );
}
