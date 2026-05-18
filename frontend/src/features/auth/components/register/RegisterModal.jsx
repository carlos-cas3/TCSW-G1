import {
    ChevronLeft,
    ChevronRight,
    Check,
    X,
} from "lucide-react";

import styles from "./RegisterModal.module.css";
import RegisterStepper from "./RegisterStepper";
import PersonalInfoStep from "./PersonalInfoStep";
import BusinessInfoStep from "./BusinessInfoStep";

import { STEPS } from "../../constants/register.constants";

import { useRegisterForm } from "../../hooks/useRegisterForm";

export default function RegisterModal({ onClose }) {
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

    return (
        <div className={styles.registerModal}>

        
        <div className={styles.overlay} onClick={handleOverlayClick}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <div className={styles.titleSection}>
                        <h2 className={styles.title}>Create Seller Account</h2>
                        <p className={styles.subtitle}>
                            Paso {currentStep} de {STEPS.length}
                        </p>
                    </div>
                    <button className={styles.closeButton} onClick={onClose}>
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <RegisterStepper
                    steps={STEPS}
                    currentStep={currentStep}
                />

                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                    <div className={styles.content}>
                        {currentStep === 1 && (
                            <PersonalInfoStep
                                formData={formData}
                                errors={errors}
                                touched={touched}
                                showError={showError}
                                onChange={handleInputChange}
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

                        {currentStep < 2 ? (
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
                                type="submit"
                                className={styles.submitButton}
                            >
                                <Check className="h-4 w-4" />
                                Crear Cuenta
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>

        </div>
    );
}