import styles from "./AuthBackground.module.css";

export default function AuthBackground() {
    return (
        <div
            className={styles.background}
            aria-hidden="true"
        >
            <div className={styles.grid} />

            <div className={styles.orbBlue} />

            <div className={styles.orbCyan} />

            <div className={styles.orbCenter} />
        </div>
    );
}