export const normalizeError = (error) => {
    const rawMessage = error?.message || error?.toString?.() || "";

    console.error("[normalizeError] Raw error:", error);

    if (
        rawMessage.includes("Unexpected token '<'") ||
        rawMessage === "HTML_RESPONSE"
    ) {
        return {
            title: "Error de conexión",
            description:
                "No se pudo obtener información del servidor. Verifica que el servicio esté disponible.",
            type: "network",
        };
    }

    if (rawMessage.includes("Failed to fetch") || rawMessage.includes("NetworkError")) {
        return {
            title: "Sin conexión",
            description:
                "No se pudo conectar con el servidor. Revisa tu conexión o intenta más tarde.",
            type: "network",
        };
    }

    if (rawMessage.includes("401")) {
        return {
            title: "Sesión expirada",
            description:
                "Tu sesión ha expirado. Por favor vuelve a iniciar sesión.",
            type: "auth",
        };
    }

    if (rawMessage.includes("403")) {
        return {
            title: "Acceso denegado",
            description:
                "No tienes permiso para ver esta información.",
            type: "auth",
        };
    }

    if (rawMessage.includes("404")) {
        return {
            title: "No encontrado",
            description:
                "El recurso solicitado no está disponible.",
            type: "server",
        };
    }

    if (rawMessage.includes("500")) {
        return {
            title: "Error del servidor",
            description:
                "Ocurrió un error interno. Intenta nuevamente más tarde.",
            type: "server",
        };
    }

    return {
        title: "Error inesperado",
        description: rawMessage || "Algo salió mal. Intenta nuevamente.",
        type: "unknown",
    };
};
