import styles from "./RegisterModal.module.css";
import { SPORTS_CATEGORIES } from "../../constants/register.constants";

export default function BusinessInfoStep({
    formData,
    selectedCategories,
    errors,
    touched,
    showError,
    onChange,
    onBlur,
    onToggleCategory,
}) {
    return (
        <div className={styles.stepContent}>
            <div className={styles.section}>
                <div className={styles.sectionGrid}>
                    <div className={styles.field}>
                        <label className={styles.label}>Nombre de la Empresa</label>
                        <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={onChange}
                            onBlur={() => onBlur("company")}
                            className={`${styles.input} ${showError("company") ? styles.inputError : ""}`}
                            placeholder="Deportes Perú S.A.C."
                        />
                        {showError("company") && <span className={styles.errorText}>{errors.company}</span>}
                    </div>
                    <div className={styles.field}>
                        <label className={styles.label}>RUC</label>
                        <input
                            type="text"
                            name="ruc"
                            value={formData.ruc}
                            onChange={onChange}
                            onBlur={() => onBlur("ruc")}
                            className={`${styles.input} ${showError("ruc") ? styles.inputError : ""}`}
                            placeholder="20123456789"
                            maxLength={11}
                        />
                        {showError("ruc") && <span className={styles.errorText}>{errors.ruc}</span>}
                    </div>
                    <div className={`${styles.field} ${styles.fullWidth}`}>
                        <label className={styles.label}>Dirección de la Empresa</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={onChange}
                            onBlur={() => onBlur("address")}
                            className={`${styles.input} ${showError("address") ? styles.inputError : ""}`}
                            placeholder="Av. Principal 123, Lima"
                        />
                        {showError("address") && <span className={styles.errorText}>{errors.address}</span>}
                    </div>
                    <div className={`${styles.field} ${styles.fullWidth}`}>
                        <label className={styles.label}>Categoría(s) deportiva(s)</label>
                        <div className={styles.checkboxGroup}>
                            {SPORTS_CATEGORIES.map((category) => (
                                <label
                                    key={category.id}
                                    className={`${styles.checkboxLabel} ${selectedCategories.includes(category.id) ? styles.selected : ""}`}
                                >
                                    <input
                                        type="checkbox"
                                        className={styles.checkbox}
                                        checked={selectedCategories.includes(category.id)}
                                        onChange={() => onToggleCategory(category.id)}
                                    />
                                    <span className={styles.checkboxText}>{category.label}</span>
                                </label>
                            ))}
                        </div>
                        {showError("categories") && <span className={styles.errorText}>{errors.categories}</span>}
                    </div>
                </div>
            </div>
        </div>
    );
}