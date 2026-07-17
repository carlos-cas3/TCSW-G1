export const getHeaders = () => {
    const token =
        sessionStorage.getItem("tcsw_token") ||
        localStorage.getItem("tcsw_token");
    if (!token) {
        console.warn("[httpClient] No token found in localStorage/sessionStorage");
    }
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchWithAuth = async (url, options = {}) => {
    const isFormData = options.body instanceof FormData;

    const headers = {
        // No pongas Content-Type si es FormData — el browser lo hace solo
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...getHeaders(),
        ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
        const text = await response.text().catch(() => "");
        if (
            text.trim().toLowerCase().startsWith("<!doctype") ||
            text.trim().toLowerCase().startsWith("<html")
        ) {
            throw new Error("HTML_RESPONSE");
        }
        let message;
        try {
            const error = JSON.parse(text);
            message = error.message || `HTTP ${response.status}`;
        } catch {
            message = `HTTP ${response.status}`;
        }
        throw new Error(message);
    }

    const text = await response.text();

    if (!text.trim()) {
        return null;
    }

    if (
        text.trim().toLowerCase().startsWith("<!doctype") ||
        text.trim().toLowerCase().startsWith("<html")
    ) {
        throw new Error("HTML_RESPONSE");
    }

    try {
        return JSON.parse(text);
    } catch {
        throw new Error("INVALID_JSON_RESPONSE");
    }
};
