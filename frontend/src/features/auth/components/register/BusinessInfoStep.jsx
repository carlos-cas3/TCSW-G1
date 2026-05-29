import styles from "./RegisterModal.module.css";
import { SPORTS_CATEGORIES } from "../../constants/register.constants";

const formatRuc = (value) => {
    const d = value.replace(/\D/g, "");
    if (d.length <= 2) return d;
    return `${d.slice(0, 2)} ${d.slice(2, 11)}`;
};

const FIELDS = [
    { name: "company", label: "Nombre de la Empresa", placeholder: "Deportes Perú S.A.C.", type: "text" },
    { name: "ruc", label: "RUC", placeholder: "20 123456789", type: "text", ruc: true },
    { name: "address", label: "Dirección", placeholder: "Av. Principal 123, Lima", type: "text", fullWidth: true },
];

export default function BusinessInfoStep({
    formData,
    selectedCategories,
    errors,
    showError,
    onChange,
    onBlur,
    onToggleCategory,
}) {
    const handleRucChange = (e) => {
        const raw = e.target.value.replace(/\D/g, "").slice(0, 11);
        if (raw.length >= 2 && raw.slice(0, 2) !== "10" && raw.slice(0, 2) !== "20") return;
        onChange({ target: { name: "ruc", value: raw } });
    };

    const renderField = (field, index) => {
        const isError = showError(field.name);
        const staggerDelay = `${index * 75}ms`;

        if (field.name === "ruc") {
            return (
                <div
                    className={`${styles.field} ${field.fullWidth ? styles.fullWidth : ""}`}
                    key={field.name}
                    style={{ animationDelay: staggerDelay }}
                >
                    <label className={styles.label}>{field.label}</label>
                    <div className={styles.inputWrapper}>
                        <input
                            type="text"
                            name="ruc"
                            value={formatRuc(formData.ruc)}
                            onBlur={() => onBlur("ruc")}
                            onChange={handleRucChange}
                            className={`${styles.input} ${isError ? styles.inputError : ""}`}
                            placeholder={field.placeholder}
                            autoComplete="off"
                            inputMode="numeric"
                        />
                    </div>
                    <span className={styles.inputHint}>Debe empezar con 10 o 20</span>
                    {isError && <span className={styles.errorText}>{errors.ruc}</span>}
                </div>
            );
        }

        return (
            <div
                className={`${styles.field} ${field.fullWidth ? styles.fullWidth : ""}`}
                key={field.name}
                style={{ animationDelay: staggerDelay }}
            >
                <label className={styles.label}>{field.label}</label>
                <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onBlur={() => onBlur(field.name)}
                    onChange={onChange}
                    className={`${styles.input} ${isError ? styles.inputError : ""}`}
                    placeholder={field.placeholder}
                    autoComplete="organization"
                />
                {isError && <span className={styles.errorText}>{errors[field.name]}</span>}
            </div>
        );
    };

    return (
        <div className={styles.stepContent}>
            <div className={styles.section}>
                <div className={styles.sectionGrid}>
                    {FIELDS.map((field, i) => renderField(field, i))}

                    <div className={`${styles.field} ${styles.fullWidth}`} style={{ animationDelay: "225ms" }}>
                        <label className={styles.label}>Categoría(s) deportiva(s)</label>
                        <div className={styles.checkboxGroup}>
                            {SPORTS_CATEGORIES.map((category) => {
                                const isSelected = selectedCategories.includes(category.id);
                                return (
                                    <label
                                        key={category.id}
                                        className={`${styles.checkboxCard} ${isSelected ? styles.selected : ""}`}
                                    >
                                        <input
                                            type="checkbox"
                                            className={styles.checkboxInput}
                                            checked={isSelected}
                                            onChange={() => onToggleCategory(category.id)}
                                        />
                                        <span className={styles.checkboxIcon}>{category.icon}</span>
                                        <span className={styles.checkboxText}>{category.label}</span>
                                    </label>
                                );
                            })}
                        </div>
                        {showError("categories") && (
                            <span className={styles.errorText}>{errors.categories}</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
