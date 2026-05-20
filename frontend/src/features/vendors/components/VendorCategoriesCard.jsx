import { useState, useMemo } from "react";
import { Check } from "lucide-react";
import "../styles/business.css";
import "../styles/cards.css";

export default function VendorCategoriesCard({
    categories,
    selectedCategoryIds,
    onChange,
}) {
    const [localSelected, setLocalSelected] = useState(selectedCategoryIds);
    const [errorMessage, setErrorMessage] = useState(null);

    const hasChanges = useMemo(
        () =>
            JSON.stringify(localSelected.sort()) !==
            JSON.stringify(selectedCategoryIds.sort()),
        [localSelected, selectedCategoryIds]
    );

    const handleToggle = (categoryId) => {
        setErrorMessage(null);
        const newSelected = localSelected.includes(categoryId)
            ? localSelected.filter((id) => id !== categoryId)
            : [...localSelected, categoryId];

        setLocalSelected(newSelected);

        onChange((prevSeller) => ({
            ...prevSeller,
            categories: {
                selectedIds: newSelected,
            },
        }));
    };

    if (!categories || categories.length === 0) {
        return null;
    }

    return (
        <div className="seller-card">
            <div className="seller-card-header">
                <h2 className="seller-card-title">Categorías Deportivas</h2>
            </div>
            <div className="seller-card-body">
                <p className="business-section-label mb-3">
                    Selecciona las categorías que representa tu tienda
                </p>
                <div className="business-payments">
                    {categories.map((category) => {
                        const isSelected = localSelected.includes(
                            category.category_id
                        );
                        return (
                            <div
                                key={category.category_id}
                                className={`business-payment-toggle ${isSelected ? "selected" : ""}`}
                                onClick={() =>
                                    handleToggle(category.category_id)
                                }
                            >
                                <div className="business-payment-check">
                                    <Check
                                        className="w-3 h-3"
                                        strokeWidth={3}
                                    />
                                </div>
                                <span>{category.category_name}</span>
                            </div>
                        );
                    })}
                </div>
                {errorMessage && (
                    <p className="text-xs text-red-500 mt-2">
                        * {errorMessage}
                    </p>
                )}
                {!errorMessage && (
                    <p className="text-xs text-gray-500 mt-2">
                        * Al menos una categoría requerida
                    </p>
                )}
            </div>
        </div>
    );
}