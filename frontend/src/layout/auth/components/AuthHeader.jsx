import {
    Shield,
    Users,
    Zap,
} from "lucide-react";

import styles from "./AuthHeader.module.css";

import { BRAND } from "../constants/auth.constants";

export default function AuthHeader() {
    return (
        <header className={styles.header}>
            <div className={styles.headerInner}>
                <div className={styles.logo}>
                    <div className={styles.logoIcon}>
                        <Zap className="h-6 w-6 text-white" />
                    </div>

                    <div>
                        <p className={styles.logoTitle}>
                            {BRAND.name}
                        </p>

                        <p className={styles.logoSubtitle}>
                            {BRAND.tagline}
                        </p>
                    </div>
                </div>

                <div className={styles.badges}>
                    <span className={styles.badge}>
                        <Shield className="h-4 w-4 text-blue-400" />
                        Plataforma segura
                    </span>

                    <span className={styles.badge}>
                        <Users className="h-4 w-4 text-cyan-400" />
                        500+ vendedores
                    </span>
                </div>
            </div>
        </header>
    );
}