const API_URL = "http://localhost:3006/api/auth";

export const registerUser = async (data) => {
    const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return res.json();
};

export const loginUser = async (data) => {
    const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return res.json();
};

export const getMe = async (token) => {
    const res = await fetch(`${API_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
};