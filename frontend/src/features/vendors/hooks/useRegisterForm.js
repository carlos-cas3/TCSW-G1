import { useState } from "react";
import { STEP1_FIELDS, STEP2_FIELDS } from "../constants/register.constants";
import { validateField } from "../validations/register.validation";
import { createVendor } from "../services/vendor.service";

export const useRegisterForm = ({ onSuccess, onError } = {}) => {
    const [currentStep, setCurrentStep] = useState(1);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        personal_phone: "",
        company: "",
        ruc: "",
        address: "",
        categories: [],
    });

    const [selectedCategories, setSelectedCategories] = useState([]);

    const [stepErrors, setStepErrors] = useState({ 1: {}, 2: {} });
    const [stepTouched, setStepTouched] = useState({ 1: {}, 2: {} });
    const [submitError, setSubmitError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const errors = stepErrors[currentStep];
    const touched = stepTouched[currentStep];

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({ ...prev, [name]: value }));

        if (stepTouched[currentStep][name]) {
            const error = validateField(
                name,
                value,
                { ...formData, [name]: value },
                selectedCategories,
            );
            setStepErrors((prev) => ({
                ...prev,
                [currentStep]: { ...prev[currentStep], [name]: error },
            }));
        }
    };

    const handleFieldBlur = (fieldName) => {
        setStepTouched((prev) => ({
            ...prev,
            [currentStep]: { ...prev[currentStep], [fieldName]: true },
        }));

        const value = formData[fieldName] || "";
        const error = validateField(
            fieldName,
            value,
            formData,
            selectedCategories,
        );

        setStepErrors((prev) => ({
            ...prev,
            [currentStep]: { ...prev[currentStep], [fieldName]: error },
        }));
    };

    const handleCategoryToggle = (categoryId) => {
        setSelectedCategories((prev) => {
            const next = prev.includes(categoryId)
                ? prev.filter((id) => id !== categoryId)
                : [...prev, categoryId];

            if (stepTouched[2].categories) {
                const error = validateField("categories", "", formData, next);
                setStepErrors((e) => ({
                    ...e,
                    2: { ...e[2], categories: error },
                }));
            }

            return next;
        });
    };

    const validateStep = () => {
        const fields = currentStep === 1 ? STEP1_FIELDS : STEP2_FIELDS;
        const newErrors = {};

        fields.forEach((field) => {
            const value = formData[field] || "";
            const error = validateField(
                field,
                value,
                formData,
                selectedCategories,
            );
            if (error) newErrors[field] = error;
        });

        if (currentStep === 2 && selectedCategories.length === 0) {
            newErrors.categories = "Selecciona al menos una categoría";
        }

        setStepErrors((prev) => ({ ...prev, [currentStep]: newErrors }));

        const allTouched = {};
        fields.forEach((f) => (allTouched[f] = true));
        if (currentStep === 2) allTouched.categories = true;

        setStepTouched((prev) => ({
            ...prev,
            [currentStep]: { ...prev[currentStep], ...allTouched },
        }));

        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep()) {
            setCurrentStep(2);
        }
    };

    const handlePrev = () => {
        setCurrentStep(1);
    };

    const buildRegisterPayload = () => ({
        first_name: formData.firstName,
        last_name: formData.lastName,
        vendor_email: formData.email,
        vendor_phone: formData.personal_phone,
        vendor_name: formData.company,
        vendor_ruc: formData.ruc,
        vendor_address: formData.address,
        categories: selectedCategories,
    });

    const handleSubmit = async () => {
        if (!validateStep()) return;

        setSubmitError(null);
        setSubmitting(true);

        try {
            const payload = buildRegisterPayload();
            const response = await createVendor(payload);

            onSuccess?.(response); // response.data.temp_password estará aquí
        } catch (error) {
            const message = error.message || "Error al crear vendedor";
            setSubmitError(message);
            onError?.(error);
        } finally {
            setSubmitting(false);
        }
    };

    const resetForm = () => {
        setCurrentStep(1);
        setFormData({
            firstName: "",
            lastName: "",
            email: "",
            personal_phone: "",
            company: "",
            ruc: "",
            address: "",
            categories: [],
        });
        setSelectedCategories([]);
        setStepErrors({ 1: {}, 2: {} });
        setStepTouched({ 1: {}, 2: {} });
        setSubmitError(null);
        setSubmitting(false);
    };

    return {
        currentStep,
        formData,
        selectedCategories,
        errors,
        touched,
        submitError,
        submitting,
        handleInputChange,
        handleFieldBlur,
        handleCategoryToggle,
        handleNext,
        handlePrev,
        handleSubmit,
        resetForm,
    };
};
