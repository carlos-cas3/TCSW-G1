import styles from "./AuthBranding.module.css";

import {
    BRAND,
    FEATURES,
    STATS,
} from "../constants/auth.constants";

import FeatureCard from "./cards/FeatureCard";
import StatCard from "./cards/StatCard";

export default function AuthBranding() {
    return (
        <section className={styles.branding}>
            <div>
                <h1 className={styles.headline}>
                    {BRAND.headline}
                </h1>

                <p className={styles.subline}>
                    {BRAND.subline}
                </p>
            </div>

            <div className={styles.features}>
                {FEATURES.map((feature) => (
                    <FeatureCard
                        key={feature.id}
                        feature={feature}
                    />
                ))}
            </div>

            <div className={styles.stats}>
                {STATS.map((stat) => (
                    <StatCard
                        key={stat.id}
                        stat={stat}
                    />
                ))}
            </div>
        </section>
    );
}