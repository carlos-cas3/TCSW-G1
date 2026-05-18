import { Outlet } from "react-router-dom";
import { Zap } from "lucide-react";
import styles from "./AuthLayout.module.css";

const BRAND = {
    name: "MarketPlace Multiseller y MultiChannel",
    tagline: "Ge    tión de Vendedores",
};

export default function AuthLayout() {
    return (
        <div className={styles.page}>
            <div className={styles.background} aria-hidden="true">
                <div className={styles.grid} />
                <div className={styles.gradientOrb} />
            </div>

            <header className={styles.header}>
                <div className={styles.logo}>
                    <div className={styles.logoIcon}>
                        <Zap className="h-5 w-5 text-white" />
                    </div>
                    <div className={styles.logoText}>
                        <span className={styles.brandName}>{BRAND.name}</span>
                        <span className={styles.brandTagline}>{BRAND.tagline}</span>
                    </div>
                </div>
            </header>

            <main className={styles.main}>
                <div className={styles.formContainer}>
                    <Outlet />
                </div>
            </main>

            <footer className={styles.footer}>
                <p>&copy; 2026 TCSW. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
}