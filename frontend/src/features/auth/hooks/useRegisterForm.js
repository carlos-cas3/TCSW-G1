import { useState } from "react";
import { STEP1_FIELDS, STEP2_FIELDS } from "../constants/register.constants";
import { validateField } from "../validations/register.validation";
import { registerUser } from "../services/auth.service";

export const useRegisterForm = () => {
    const [currentStep, setCurrentStep] = useState(1);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        personal_phone: "",
        password: "",
        confirmPassword: "",
        company: "",
        ruc: "",
        address: "",
        categories: [],
    });

    const [selectedCategories, setSelectedCategories] = useState([]);

    const [stepErrors, setStepErrors] = useState({ 1: {}, 2: {} });
    const [stepTouched, setStepTouched] = useState({ 1: {}, 2: {} });

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
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        personal_phone: formData.personal_phone,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        company: {
            name: formData.company,
            ruc: formData.ruc,
            address: formData.address,
            categories: selectedCategories,
        },
    });

    const handleSubmit = async () => {
        if (!validateStep()) return;

        try {
            const payload = buildRegisterPayload();
            const response = await registerUser(payload);
            console.log(response);
        } catch (error) {
            console.error(error.message);
        }
    };

    return {
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
    };
};
