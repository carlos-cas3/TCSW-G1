import { useState } from "react";
import { Eye, EyeOff, AtSign } from "lucide-react";
import styles from "./RegisterModal.module.css";

const getPasswordStrength = (password) => {
    if (!password) return { score: 0, label: "", color: "", width: "0%" };
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    const labels = ["", "Débil", "Débil", "Media", "Fuerte", "Muy fuerte"];
    const colors = ["", "#ef4444", "#ef4444", "#d97706", "#65a30d", "#16a34a"];
    const widths = ["0%", "20%", "40%", "60%", "80%", "100%"];
    return { score, label: labels[score], color: colors[score], width: widths[score] };
};

const formatPhone = (value) => {
    const d = value.replace(/\D/g, "");
    if (d.length <= 3) return d;
    if (d.length <= 6) return `${d.slice(0, 3)} ${d.slice(3)}`;
    return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6, 9)}`;
};

const FIELDS = [
    { name: "firstName", label: "Nombres", placeholder: "Juan", type: "text" },
    { name: "lastName", label: "Apellidos", placeholder: "Pérez", type: "text" },
    { name: "email", label: "Email", placeholder: "juan@email.com", type: "email", icon: true },
    { name: "personal_phone", label: "Teléfono", placeholder: "999 888 777", type: "tel", phone: true },
    { name: "password", label: "Contraseña", placeholder: "••••••••", type: "password", toggle: true },
    { name: "confirmPassword", label: "Confirmar Contraseña", placeholder: "••••••••", type: "password", toggle: true },
];

export default function PersonalInfoStep({
    formData,
    errors,
    showError,
    onChange,
    onBlur,
}) {
    const [showPasswords, setShowPasswords] = useState({ password: false, confirmPassword: false });

    const strength = getPasswordStrength(formData.password);

    const handlePhoneChange = (e) => {
        const raw = e.target.value.replace(/\D/g, "").slice(0, 9);
        onChange({ target: { name: "personal_phone", value: raw } });
    };

    const renderField = (field, index) => {
        const isError = showError(field.name);
        const staggerDelay = `${index * 65}ms`;

        if (field.name === "personal_phone") {
            return (
                <div className={styles.field} key={field.name} style={{ animationDelay: staggerDelay }}>
                    <label className={styles.label}>{field.label}</label>
                    <div className={styles.inputWrapper}>
                        <span className={styles.inputBadge}>+51</span>
                        <input
                            type="tel"
                            name="personal_phone"
                            value={formatPhone(formData.personal_phone)}
                            onBlur={() => onBlur("personal_phone")}
                            onChange={handlePhoneChange}
                            className={`${styles.input} ${styles.inputWithBadge} ${isError ? styles.inputError : ""}`}
                            placeholder={field.placeholder}
                            autoComplete="tel"
                            inputMode="numeric"
                        />
                    </div>
                    {isError && <span className={styles.errorText}>{errors.personal_phone}</span>}
                </div>
            );
        }

        if (field.name === "email") {
            return (
                <div className={styles.field} key={field.name} style={{ animationDelay: staggerDelay }}>
                    <label className={styles.label}>{field.label}</label>
                    <div className={styles.inputWrapper}>
                        <AtSign className={styles.inputIcon} size={18} />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onBlur={() => onBlur("email")}
                            onChange={onChange}
                            className={`${styles.input} ${styles.inputWithIcon} ${isError ? styles.inputError : ""}`}
                            placeholder={field.placeholder}
                            autoComplete="email"
                        />
                    </div>
                    {isError && <span className={styles.errorText}>{errors.email}</span>}
                </div>
            );
        }

        if (field.name === "password" || field.name === "confirmPassword") {
            const isPass = field.name === "password";
            const show = showPasswords[field.name];
            const toggle = () => setShowPasswords((p) => ({ ...p, [field.name]: !p[field.name] }));

            return (
                <div className={styles.field} key={field.name} style={{ animationDelay: staggerDelay }}>
                    <label className={styles.label}>{field.label}</label>
                    <div className={styles.inputWrapper}>
                        <input
                            type={show ? "text" : "password"}
                            name={field.name}
                            value={formData[field.name]}
                            onBlur={() => onBlur(field.name)}
                            onChange={onChange}
                            className={`${styles.input} ${styles.inputWithToggle} ${isError ? styles.inputError : ""}`}
                            placeholder={field.placeholder}
                            autoComplete={isPass ? "new-password" : "off"}
                        />
                        <button type="button" className={styles.toggleButton} onClick={toggle} tabIndex={-1}>
                            {show ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    {isPass && formData.password && (
                        <>
                            <div className={styles.strengthMeter}>
                                <div
                                    className={styles.strengthBar}
                                    style={{
                                        width: strength.width,
                                        background: strength.color,
                                        boxShadow: `0 0 6px ${strength.color}`,
                                    }}
                                />
                            </div>
                            <span className={styles.strengthLabel} style={{ color: strength.color }}>
                                {strength.label}
                            </span>
                        </>
                    )}
                    {isError && <span className={styles.errorText}>{errors[field.name]}</span>}
                </div>
            );
        }

        return (
            <div className={styles.field} key={field.name} style={{ animationDelay: staggerDelay }}>
                <label className={styles.label}>{field.label}</label>
                <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onBlur={() => onBlur(field.name)}
                    onChange={onChange}
                    className={`${styles.input} ${isError ? styles.inputError : ""}`}
                    placeholder={field.placeholder}
                    autoComplete="given-name"
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
                </div>
            </div>
        </div>
    );
}
