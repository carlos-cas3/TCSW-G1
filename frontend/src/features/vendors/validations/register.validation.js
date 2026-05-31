export const validateField = (name, value, allFormData, categories) => {
    switch (name) {
        case "firstName":
            return !value.trim() ? "El nombre es requerido" : "";

        case "lastName":
            return !value.trim() ? "Los apellidos son requeridos" : "";

        case "email":
            if (!value.trim()) return "El email es requerido";
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                return "Formato de email inválido";
            }
            return "";

        case "personal_phone":
            return !value.trim() ? "El teléfono es requerido" : "";

        case "password":
            if (!value) return "La contraseña es requerida";
            if (value.length < 6) return "Mínimo 6 caracteres";
            return "";

        case "confirmPassword":
            if (!value) return "Confirma tu contraseña";
            if (value !== allFormData.password) {
                return "Las contraseñas no coinciden";
            }
            return "";

        case "company":
            return !value.trim()
                ? "El nombre de la empresa es requerido"
                : "";

        case "ruc":
            if (!value.trim()) return "El RUC es requerido";
            if (!/^\d{11}$/.test(value)) {
                return "El RUC debe tener 11 dígitos";
            }
            if (value.slice(0, 2) !== "10" && value.slice(0, 2) !== "20") {
                return "El RUC debe empezar con 10 o 20";
            }
            return "";

        case "address":
            return !value.trim() ? "La dirección es requerida" : "";

        case "categories":
            return categories.length === 0
                ? "Selecciona al menos una categoría"
                : "";

        default:
            return "";
    }
};
