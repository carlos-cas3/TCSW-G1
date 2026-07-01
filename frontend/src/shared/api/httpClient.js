export const getHeaders = () => {
    const token =
        localStorage.getItem("tcsw_token") ||
        sessionStorage.getItem("tcsw_token");
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
        try {
            const error = JSON.parse(text);
            throw new Error(error.message || `HTTP ${response.status}`);
        } catch (parseErr) {
            if (parseErr.message === "HTML_RESPONSE") throw parseErr;
            throw new Error(`HTTP ${response.status}`, { cause: parseErr });
        }
    }

    const text = await response.text().catch(() => "");
    if (
        text.trim().toLowerCase().startsWith("<!doctype") ||
        text.trim().toLowerCase().startsWith("<html")
    ) {
        throw new Error("HTML_RESPONSE");
    }
    try {
        return JSON.parse(text);
    } catch {
        throw new Error("HTML_RESPONSE");
    }
};
