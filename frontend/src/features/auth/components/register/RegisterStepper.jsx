import { Check } from "lucide-react";
import styles from "./RegisterModal.module.css";

export default function RegisterStepper({ steps, currentStep }) {
    return (
        <div className={styles.stepper}>
            {steps.map((step, index) => {
                const isCompleted = currentStep > step.id;
                const isActive = currentStep === step.id;

                return (
                    <div
                        key={step.id}
                        style={{ display: "flex", alignItems: "center" }}
                    >
                        <div
                            className={
                                isCompleted
                                    ? styles.stepCompleted
                                    : isActive
                                    ? styles.stepActive
                                    : styles.step
                            }
                        >
                            <div className={styles.stepIndicator}>
                                {isCompleted ? <Check size={14} /> : step.id}
                            </div>
                            <span className={styles.stepTitle}>
                                {step.title}
                            </span>
                        </div>

                        {index < steps.length - 1 && (
                            <div
                                className={`${styles.stepLine} ${isCompleted ? styles.stepLineCompleted : ""}`}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
