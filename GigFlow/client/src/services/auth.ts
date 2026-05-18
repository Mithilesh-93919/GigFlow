const API_BASE_URL = 'http://localhost:5000/api/v1';

export const registerUser = async (userData: {
    name: string;
    email: string;
    password: string;
    role: string;
}) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    return response.json();
};

export const loginUser = async (userData: {
    email: string;
    password: string;
}) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    return response.json();
};