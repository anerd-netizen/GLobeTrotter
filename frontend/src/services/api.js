const API_BASE_URL = "http://localhost:8080";

export async function login(email, password) {
    const response = await fetch(
        `${API_BASE_URL}/api/auth/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
        {
            method: "POST",
        }
    );

    const text = await response.text();

    let data = {};

    if (text) {
        try {
            data = JSON.parse(text);
        } catch {
            data = { message: text };
        }
    }

    if (!response.ok) {
        throw new Error(
            data.message || `Login failed (${response.status})`
        );
    }

    return data;
}

export async function signup(name, email, password) {
    const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name,
            email,
            password,
        }),
    });

    const text = await response.text();

    let data = {};

    if (text) {
        try {
            data = JSON.parse(text);
        } catch {
            data = { message: text };
        }
    }

    if (!response.ok) {
        throw new Error(
            data.message || `Signup failed (${response.status})`
        );
    }

    return data;
}

export async function getCurrentUser() {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const text = await response.text();

    let data = {};

    if (text) {
        try {
            data = JSON.parse(text);
        } catch {
            data = { message: text };
        }
    }

    if (!response.ok) {
        throw new Error(
            data.message || `Authentication failed (${response.status})`
        );
    }

    return data;
}
export async function getMyTrips() {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_BASE_URL}/api/trips`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to load trips");
    }

    return response.json();
}

export async function createTrip(trip) {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_BASE_URL}/api/trips`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(trip),
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Failed to create trip");
    }

    return response.json();
}

export async function updateTrip(id, trip) {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_BASE_URL}/api/trips/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(trip),
    });

    if (!response.ok) {
        throw new Error("Failed to update trip");
    }

    return response.json();
}

export async function deleteTrip(id) {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_BASE_URL}/api/trips/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to delete trip");
    }
}