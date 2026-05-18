import styles from "./RegisterModal.module.css";

export default function PersonalInfoStep({
    formData,
    errors,
    touched,
    showError,
    onChange,
    onBlur,
}) {
    return (
        <div className={styles.stepContent}>
            <div className={styles.section}>
                <div className={styles.sectionGrid}>
                    <div className={styles.field}>
                        <label className={styles.label}>Nombres</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onBlur={() => onBlur("firstName")}
                            onChange={onChange}
                            className={`${styles.input} ${showError("firstName") ? styles.inputError : ""}`}
                            placeholder="Juan"
                        />
                        {showError("firstName") && (
                            <span className={styles.errorText}>
                                {errors.firstName}
                            </span>
                        )}
                    </div>
                    <div className={styles.field}>
                        <label className={styles.label}>Apellidos</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={onChange}
                            onBlur={() => onBlur("lastName")}
                            className={`${styles.input} ${showError("lastName") ? styles.inputError : ""}`}
                            placeholder="Pérez"
                        />
                        {showError("lastName") && (
                            <span className={styles.errorText}>
                                {errors.lastName}
                            </span>
                        )}
                    </div>
                    <div className={styles.field}>
                        <label className={styles.label}>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={onChange}
                            onBlur={() => onBlur("email")}
                            className={`${styles.input} ${showError("email") ? styles.inputError : ""}`}
                            placeholder="juan@email.com"
                        />
                        {showError("email") && (
                            <span className={styles.errorText}>
                                {errors.email}
                            </span>
                        )}
                    </div>
                    <div className={styles.field}>
                        <label className={styles.label}>Teléfono</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={onChange}
                            onBlur={() => onBlur("phone")}
                            className={`${styles.input} ${showError("phone") ? styles.inputError : ""}`}
                            placeholder="+51 999 999 999"
                        />
                        {showError("phone") && (
                            <span className={styles.errorText}>
                                {errors.phone}
                            </span>
                        )}
                    </div>
                    <div className={styles.field}>
                        <label className={styles.label}>Contraseña</label>
                        <div className={styles.selectWrapper}>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={onChange}
                                onBlur={() => onBlur("password")}
                                className={`${styles.input} ${styles.inputWithToggle} ${showError("password") ? styles.inputError : ""}`}
                                placeholder="••••••••"
                            />
                        </div>
                        {showError("password") && (
                            <span className={styles.errorText}>
                                {errors.password}
                            </span>
                        )}
                    </div>
                    <div className={styles.field}>
                        <label className={styles.label}>
                            Confirmar Contraseña
                        </label>
                        <div className={styles.selectWrapper}>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={onChange}
                                onBlur={() => onBlur("confirmPassword")}
                                className={`${styles.input} ${styles.inputWithToggle} ${showError("confirmPassword") ? styles.inputError : ""}`}
                                placeholder="••••••••"
                            />
                        </div>
                        {showError("confirmPassword") && (
                            <span className={styles.errorText}>
                                {errors.confirmPassword}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
