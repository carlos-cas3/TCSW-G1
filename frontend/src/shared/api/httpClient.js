export const getHeaders = () => {
    const token =
        localStorage.getItem("tcsw_token") ||
        sessionStorage.getItem("tcsw_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchWithAuth = async (url, options = {}) => {
    const headers = {
        "Content-Type": "application/json",
        ...getHeaders(),
    };

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
};
