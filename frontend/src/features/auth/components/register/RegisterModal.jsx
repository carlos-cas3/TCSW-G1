import { useCallback, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Check, X } from "lucide-react";

import styles from "./RegisterModal.module.css";
import RegisterStepper from "./RegisterStepper";
import PersonalInfoStep from "./PersonalInfoStep";
import BusinessInfoStep from "./BusinessInfoStep";

import { STEPS } from "../../constants/register.constants";
import { useRegisterForm } from "../../hooks/useRegisterForm";

export default function RegisterModal({ onClose }) {
    const modalRef = useRef(null);

    const {
        currentStep,
        formData,
        selectedCategories,
        errors,
        touched,
        handleInputChange,
        handleFieldBlur,
        handleCategoryToggle,
        handleNext,
        handlePrev,
        handleSubmit,
    } = useRegisterForm();

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const showError = (field) => errors[field] && touched[field];

    const handleKeyDown = useCallback(
        (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                const activeTag = document.activeElement?.tagName;
                if (activeTag === "INPUT" || activeTag === "TEXTAREA") {
                    e.preventDefault();
                    if (currentStep < STEPS.length) {
                        handleNext();
                    } else {
                        handleSubmit();
                    }
                }
            }
            if (e.key === "Escape") {
                onClose();
            }
        },
        [currentStep, handleNext, handleSubmit, onClose],
    );

    useEffect(() => {
        const firstInput = modalRef.current?.querySelector("input");
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }, [currentStep]);

    return (
        <div className={styles.registerModal} onKeyDown={handleKeyDown}>
            <div className={styles.overlay} onClick={handleOverlayClick}>
                <div className={styles.modal} ref={modalRef}>
                    <div className={styles.header}>
                        <div className={styles.titleSection}>
                            <h2 className={styles.title}>
                                Crear cuenta de vendedor
                            </h2>
                            <p className={styles.subtitle}>
                                Paso {currentStep} de {STEPS.length}
                            </p>
                        </div>
                        <button
                            className={styles.closeButton}
                            onClick={onClose}
                            aria-label="Cerrar"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <RegisterStepper steps={STEPS} currentStep={currentStep} />

                    <div>
                        <div className={styles.content}>
                            {currentStep === 1 && (
                                <PersonalInfoStep
                                    formData={formData}
                                    errors={errors}
                                    touched={touched}
                                    showError={showError}
                                    onChange={handleInputChange}
                                    onBlur={handleFieldBlur}
                                />
                            )}

                            {currentStep === 2 && (
                                <BusinessInfoStep
                                    formData={formData}
                                    selectedCategories={selectedCategories}
                                    errors={errors}
                                    touched={touched}
                                    showError={showError}
                                    onChange={handleInputChange}
                                    onBlur={handleFieldBlur}
                                    onToggleCategory={handleCategoryToggle}
                                />
                            )}
                        </div>

                        <div className={styles.actions}>
                            {currentStep > 1 && (
                                <button
                                    type="button"
                                    className={styles.backButton}
                                    onClick={handlePrev}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    Anterior
                                </button>
                            )}

                            {currentStep < STEPS.length ? (
                                <button
                                    type="button"
                                    className={styles.nextButton}
                                    onClick={handleNext}
                                >
                                    Siguiente
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className={styles.submitButton}
                                    onClick={handleSubmit}
                                >
                                    <Check className="h-4 w-4" />
                                    Crear Cuenta
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
