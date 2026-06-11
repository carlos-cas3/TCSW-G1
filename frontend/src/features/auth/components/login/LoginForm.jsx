import { useState } from "react";
import { Mail, Lock, LogIn, Eye, EyeOff, Zap } from "lucide-react";
import styles from "./LoginForm.module.css";
import { loginUser, getMe } from "../../services/auth.service";

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        remember: false,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const res = await loginUser({
                email: formData.email,
                password: formData.password,
            });

            if (!res.success) {
                setError(res.message || "Credenciales inválidas");
                return;
            }

            const { token } = res.data;

            // Obtener user completo con rol resuelto
            const meRes = await getMe(token);
            const user = meRes.data;

            const TOKEN_KEY = "tcsw_token";
            const USER_KEY = "tcsw_user";

            const storage = formData.remember ? localStorage : sessionStorage;
            storage.setItem(TOKEN_KEY, token);
            storage.setItem(USER_KEY, JSON.stringify(user));

            // Usar roleName en lugar de roleId hardcodeado
            if (user.role?.roleName === "SUPER_ADMIN") {
                window.location.href = "/admin";
            } else {
                window.location.href = "/user";
            }
        } catch {
            setError("Error de conexión con el servidor");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.decoration}>
                        <Zap className="h-6 w-6 text-white" />
                    </div>
                    <h1 className={styles.title}>Bienvenido de nuevo</h1>
                    <p className={styles.subtitle}>
                        Ingresa tus credenciales para acceder
                    </p>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.field}>
                        <label htmlFor="email" className={styles.label}>
                            Correo electrónico
                        </label>
                        <div className={styles.inputWrapper}>
                            <Mail className={styles.inputIcon} />
                            <input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        email: e.target.value,
                                    })
                                }
                                className={styles.input}
                                placeholder="tu@email.com"
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="password" className={styles.label}>
                            Contraseña
                        </label>
                        <div className={styles.inputWrapper}>
                            <Lock className={styles.inputIcon} />
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        password: e.target.value,
                                    })
                                }
                                className={`${styles.input} ${styles.inputWithToggle}`}
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                className={styles.toggleButton}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className={styles.actions}>
                        <label className={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                className={styles.checkbox}
                                checked={formData.remember}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        remember: e.target.checked,
                                    })
                                }
                            />
                            <span className={styles.checkboxText}>
                                Recordarme
                            </span>
                        </label>
                        <button type="button" className={styles.forgotButton}>
                            ¿Olvidaste tu contraseña?
                        </button>
                    </div>

                    {error && <div className={styles.errorBanner}>{error}</div>}

                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={isLoading}
                    >
                        <LogIn className="h-5 w-5" />
                        {isLoading ? "Ingresando..." : "Iniciar sesión"}
                    </button>
                </form>

            </div>
        </>
    );
}
