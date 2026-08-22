const API_BASE_URL = "http://localhost:8080";

// ---------------------------------------
// COMMON HELPERS
// ---------------------------------------

function getToken() {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Session expired");
    }

    return token;
}

async function parseResponse(response) {
    const text = await response.text();

    let data = {};

    if (text) {
        try {
            data = JSON.parse(text);
        } catch {
            data = {
                message: text,
            };
        }
    }

    if (!response.ok) {
        if (
            response.status === 401 ||
            response.status === 403
        ) {
            throw new Error("Session expired");
        }

        throw new Error(
            data.message ||
            `Request failed (${response.status})`
        );
    }

    return data;
}

function authHeaders(extraHeaders = {}) {
    const token = getToken();

    return {
        ...extraHeaders,
        Authorization: `Bearer ${token}`,
    };
}

// ---------------------------------------
// AUTH
// ---------------------------------------

export async function login(email, password) {
    const response = await fetch(
        `${API_BASE_URL}/api/auth/login?email=${encodeURIComponent(
            email
        )}&password=${encodeURIComponent(password)}`,
        {
            method: "POST",
        }
    );

    return parseResponse(response);
}

export async function signup(name, email, password) {
    const response = await fetch(
        `${API_BASE_URL}/api/auth/signup`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                email,
                password,
            }),
        }
    );

    return parseResponse(response);
}

export async function getCurrentUser() {
    const response = await fetch(
        `${API_BASE_URL}/api/auth/me`,
        {
            method: "GET",
            headers: authHeaders(),
        }
    );

    return parseResponse(response);
}

// ---------------------------------------
// TRIPS
// ---------------------------------------

export async function getMyTrips() {
    const response = await fetch(
        `${API_BASE_URL}/api/trips`,
        {
            method: "GET",
            headers: authHeaders(),
        }
    );

    return parseResponse(response);
}

export async function createTrip(trip) {
    const response = await fetch(
        `${API_BASE_URL}/api/trips`,
        {
            method: "POST",
            headers: authHeaders({
                "Content-Type": "application/json",
            }),
            body: JSON.stringify(trip),
        }
    );

    return parseResponse(response);
}

export async function updateTrip(id, trip) {
    const response = await fetch(
        `${API_BASE_URL}/api/trips/${id}`,
        {
            method: "PUT",
            headers: authHeaders({
                "Content-Type": "application/json",
            }),
            body: JSON.stringify(trip),
        }
    );

    return parseResponse(response);
}

export async function deleteTrip(id) {
    const response = await fetch(
        `${API_BASE_URL}/api/trips/${id}`,
        {
            method: "DELETE",
            headers: authHeaders(),
        }
    );

    await parseResponse(response);
}

// ---------------------------------------
// TRIP STOPS
// ---------------------------------------

export async function getTripStops(tripId) {
    const response = await fetch(
        `${API_BASE_URL}/api/trips/${tripId}/stops`,
        {
            method: "GET",
            headers: authHeaders(),
        }
    );

    return parseResponse(response);
}

export async function createTripStop(tripId, stop) {
    const response = await fetch(
        `${API_BASE_URL}/api/trips/${tripId}/stops`,
        {
            method: "POST",
            headers: authHeaders({
                "Content-Type": "application/json",
            }),
            body: JSON.stringify(stop),
        }
    );

    return parseResponse(response);
}

export async function updateTripStop(
    tripId,
    stopId,
    stop
) {
    const response = await fetch(
        `${API_BASE_URL}/api/trips/${tripId}/stops/${stopId}`,
        {
            method: "PUT",
            headers: authHeaders({
                "Content-Type": "application/json",
            }),
            body: JSON.stringify(stop),
        }
    );

    return parseResponse(response);
}

export async function deleteTripStop(
    tripId,
    stopId
) {
    const response = await fetch(
        `${API_BASE_URL}/api/trips/${tripId}/stops/${stopId}`,
        {
            method: "DELETE",
            headers: authHeaders(),
        }
    );

    await parseResponse(response);
}

// ---------------------------------------
// ACTIVITIES
// ---------------------------------------

export async function getActivities(
    tripId,
    stopId
) {
    const response = await fetch(
        `${API_BASE_URL}/api/trips/${tripId}/stops/${stopId}/activities`,
        {
            method: "GET",
            headers: authHeaders(),
        }
    );

    return parseResponse(response);
}

export async function createActivity(
    tripId,
    stopId,
    activity
) {
    const response = await fetch(
        `${API_BASE_URL}/api/trips/${tripId}/stops/${stopId}/activities`,
        {
            method: "POST",
            headers: authHeaders({
                "Content-Type": "application/json",
            }),
            body: JSON.stringify(activity),
        }
    );

    return parseResponse(response);
}

export async function deleteActivity(
    tripId,
    stopId,
    activityId
) {
    const response = await fetch(
        `${API_BASE_URL}/api/trips/${tripId}/stops/${stopId}/activities/${activityId}`,
        {
            method: "DELETE",
            headers: authHeaders(),
        }
    );

    await parseResponse(response);
}
// ---------------------------------------
// BUDGET
// ---------------------------------------

export async function getBudgetExpenses(tripId) {
    const response = await fetch(
        `${API_BASE_URL}/api/trips/${tripId}/budget`,
        {
            method: "GET",
            headers: authHeaders(),
        }
    );

    return parseResponse(response);
}

export async function getBudgetSummary(tripId) {
    const response = await fetch(
        `${API_BASE_URL}/api/trips/${tripId}/budget/summary`,
        {
            method: "GET",
            headers: authHeaders(),
        }
    );

    return parseResponse(response);
}

export async function createBudgetExpense(tripId, expense) {
    const response = await fetch(
        `${API_BASE_URL}/api/trips/${tripId}/budget`,
        {
            method: "POST",
            headers: authHeaders({
                "Content-Type": "application/json",
            }),
            body: JSON.stringify(expense),
        }
    );

    return parseResponse(response);
}

export async function updateBudgetExpense(
    tripId,
    expenseId,
    expense
) {
    const response = await fetch(
        `${API_BASE_URL}/api/trips/${tripId}/budget/${expenseId}`,
        {
            method: "PUT",
            headers: authHeaders({
                "Content-Type": "application/json",
            }),
            body: JSON.stringify(expense),
        }
    );

    return parseResponse(response);
}

export async function deleteBudgetExpense(
    tripId,
    expenseId
) {
    const response = await fetch(
        `${API_BASE_URL}/api/trips/${tripId}/budget/${expenseId}`,
        {
            method: "DELETE",
            headers: authHeaders(),
        }
    );

    await parseResponse(response);
}
