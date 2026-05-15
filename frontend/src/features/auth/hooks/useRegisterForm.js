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
        phone: "",
        password: "",
        confirmPassword: "",
        company: "",
        ruc: "",
        address: "",
        categories: [],
    });

    const [selectedCategories, setSelectedCategories] = useState([]);

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (touched[name]) {
            const error = validateField(
                name,
                value,
                {
                    ...formData,
                    [name]: value,
                },
                selectedCategories,
            );

            setErrors((prev) => ({
                ...prev,
                [name]: error,
            }));
        }
    };

    const handleFieldBlur = (fieldName) => {
        setTouched((prev) => ({
            ...prev,
            [fieldName]: true,
        }));

        const value = formData[fieldName] || "";
        const error = validateField(
            fieldName,
            value,
            formData,
            selectedCategories,
        );

        setErrors((prev) => ({
            ...prev,
            [fieldName]: error,
        }));
    };

    const handleCategoryToggle = (categoryId) => {
        setSelectedCategories((prev) => {
            if (prev.includes(categoryId)) {
                return prev.filter((id) => id !== categoryId);
            }
            return [...prev, categoryId];
        });

        if (touched.categories) {
            const error = validateField(
                "categories",
                "",
                formData,
                selectedCategories,
            );
            setErrors((prev) => ({
                ...prev,
                categories: error,
            }));
        }
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

            if (error) {
                newErrors[field] = error;
            }
        });

        if (currentStep === 2 && selectedCategories.length === 0) {
            newErrors.categories = "Selecciona al menos una categoría";
        }

        setErrors(newErrors);

        const allTouched = {};
        fields.forEach((field) => {
            allTouched[field] = true;
        });
        if (currentStep === 2) {
            allTouched.categories = true;
        }
        setTouched((prev) => ({ ...prev, ...allTouched }));

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

    const buildRegisterPayload = () => {
        console.log("selectedCategories:", selectedCategories);
        console.log("types:", selectedCategories.map(c => typeof c));
        return {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            confirmPassword: formData.confirmPassword,
            company: {
                name: formData.company,
                ruc: formData.ruc,
                address: formData.address,
                categories: selectedCategories,
            },
        };
    };

    const handleSubmit = async () => {
        const step1Valid = validateStep();

        if (currentStep === 1 && step1Valid) {
            setCurrentStep(2);
            return;
        }

        if (step1Valid) {
            try {
                const payload = buildRegisterPayload();

                const response = await registerUser(payload);

                console.log( response);
            } catch (error) {
                console.error(error.message);
            }
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
