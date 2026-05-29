import { useState, useRef, useEffect, useMemo } from "react";
import { Search, MapPin } from "lucide-react";

export default function CityCombobox({ cities, value, onChange, disabled, error }) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const inputRef = useRef(null);
    const containerRef = useRef(null);
    const ignoreFocus = useRef(false);

    const selectedCity = cities.find((c) => c.city_id.toString() === value);

    const filtered = useMemo(() => {
        if (!search) return cities;
        const q = search.toLowerCase();
        return cities.filter((c) => c.city_name.toLowerCase().includes(q));
    }, [cities, search]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
                setSearch("");
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const openDropdown = () => {
        setIsOpen(true);
        setHighlightedIndex(-1);
    };

    const handleSelect = (cityId) => {
        onChange({ target: { name: "city_id", value: cityId.toString() } });
        setIsOpen(false);
        setSearch("");
        ignoreFocus.current = true;
        inputRef.current?.focus();
    };

    const handleKeyDown = (e) => {
        if (!isOpen) {
            if (e.key === "ArrowDown" || e.key === "Enter") {
                e.preventDefault();
                openDropdown();
            }
            return;
        }

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setHighlightedIndex((i) => Math.min(i + 1, filtered.length - 1));
                break;
            case "ArrowUp":
                e.preventDefault();
                setHighlightedIndex((i) => Math.max(i - 1, 0));
                break;
            case "Enter":
                e.preventDefault();
                if (highlightedIndex >= 0 && filtered[highlightedIndex]) {
                    handleSelect(filtered[highlightedIndex].city_id);
                } else if (filtered.length === 1) {
                    handleSelect(filtered[0].city_id);
                }
                break;
            case "Escape":
                e.preventDefault();
                setIsOpen(false);
                setSearch("");
                break;
        }
    };

    const displayValue = isOpen ? search : selectedCity?.city_name || "";

    const inputClasses = [
        "w-full pl-9 pr-3 py-2.5 text-sm bg-white border rounded-lg transition-all duration-150",
        "focus:outline-none focus:ring-2",
        disabled ? "bg-stone-50 cursor-not-allowed" : "",
        error
            ? "border-red-300 focus:ring-red-500/30 focus:border-red-500"
            : "border-stone-200 hover:border-stone-300 focus:ring-blue-500/30 focus:border-blue-500",
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <div className="relative" ref={containerRef}>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                <input
                    ref={inputRef}
                    type="text"
                    role="combobox"
                    aria-expanded={isOpen}
                    aria-haspopup="listbox"
                    aria-autocomplete="list"
                    aria-controls={isOpen ? "city-listbox" : undefined}
                    aria-activedescendant={
                        isOpen && highlightedIndex >= 0 && filtered[highlightedIndex]
                            ? `city-${filtered[highlightedIndex].city_id}`
                            : undefined
                    }
                    value={displayValue}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        if (!isOpen) openDropdown();
                    }}
                    onFocus={() => {
                        if (ignoreFocus.current) {
                            ignoreFocus.current = false;
                            return;
                        }
                        openDropdown();
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder={disabled ? "Cargando ciudades..." : "Buscar ciudad..."}
                    disabled={disabled}
                    className={inputClasses}
                />
            </div>

            {isOpen && (
                <ul
                    id="city-listbox"
                    role="listbox"
                    className="absolute z-50 mt-1 w-full bg-white border border-stone-200 rounded-lg shadow-lg max-h-48 overflow-y-auto animate-combobox-open"
                >
                    {filtered.length > 0 ? (
                        filtered.map((city, idx) => {
                            const isSelected = city.city_id.toString() === value;
                            const isHighlighted = idx === highlightedIndex;
                            return (
                                <li
                                    key={city.city_id}
                                    id={`city-${city.city_id}`}
                                    role="option"
                                    aria-selected={isSelected}
                                    onClick={() => handleSelect(city.city_id)}
                                    onMouseEnter={() => setHighlightedIndex(idx)}
                                    className={[
                                        "px-3 py-2.5 text-sm flex items-center gap-2 cursor-pointer transition-colors duration-75",
                                        isSelected
                                            ? "bg-blue-50 text-blue-700 font-medium"
                                            : isHighlighted
                                            ? "bg-stone-100 text-stone-900"
                                            : "text-stone-700 hover:bg-stone-50",
                                    ].join(" ")}
                                >
                                    <MapPin className="w-3.5 h-3.5 shrink-0 text-stone-400" />
                                    <span className="truncate">{city.city_name}</span>
                                </li>
                            );
                        })
                    ) : (
                        <li className="px-3 py-3 text-sm text-stone-400 italic text-center">
                            No se encontraron ciudades
                        </li>
                    )}
                </ul>
            )}
        </div>
    );
}
