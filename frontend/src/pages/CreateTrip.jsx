import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateTrip() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        startDate: "",
        endDate: "",
        description: "",
    });

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: value,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        setSaving(true);
        setError("");

        try {
            const response = await fetch(
                "http://localhost:8080/api/trips",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        name: formData.name,
                        startDate: formData.startDate,
                        endDate: formData.endDate,
                        description: formData.description,
                    }),
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

            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/login");
                return;
            }

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    data.error ||
                    `Failed to create trip (${response.status})`
                );
            }

            console.log("Trip created:", data);

            navigate("/dashboard");
        } catch (err) {
            console.error("Create trip error:", err);

            setError(
                err.message ||
                "Unable to create trip. Please try again."
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="trip-page">

            <nav className="navbar">
                <div
                    className="logo"
                    onClick={() => navigate("/dashboard")}
                    style={{ cursor: "pointer" }}
                >
                    🌍 Globetrotter
                </div>

                <button
                    type="button"
                    className="logout-button"
                    onClick={() => navigate("/dashboard")}
                >
                    Back to Dashboard
                </button>
            </nav>

            <main className="trip-page-content">

                <div className="trip-form-header">
                    <p className="eyebrow">
                        PLAN YOUR NEXT ADVENTURE
                    </p>

                    <h1>
                        Create a new trip ✈️
                    </h1>

                    <p>
                        Give your adventure a name, choose your
                        dates, and add a few details.
                    </p>
                </div>

                <form
                    className="trip-form-card"
                    onSubmit={handleSubmit}
                >

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="name">
                            Trip name
                        </label>

                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. Goa Beach Escape"
                            required
                        />
                    </div>

                    <div className="form-row">

                        <div className="form-group">
                            <label htmlFor="startDate">
                                Start date
                            </label>

                            <input
                                id="startDate"
                                name="startDate"
                                type="date"
                                value={formData.startDate}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="endDate">
                                End date
                            </label>

                            <input
                                id="endDate"
                                name="endDate"
                                type="date"
                                value={formData.endDate}
                                onChange={handleChange}
                                required
                            />
                        </div>

                    </div>

                    <div className="form-group">
                        <label htmlFor="description">
                            Description
                        </label>

                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="What are you planning to do?"
                            rows="6"
                        />
                    </div>

                    <div className="form-actions">

                        <button
                            type="button"
                            className="secondary-button"
                            onClick={() => navigate("/dashboard")}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="primary-button"
                            disabled={saving}
                        >
                            {saving
                                ? "Creating..."
                                : "Create Trip"}
                        </button>

                    </div>

                </form>

            </main>

        </div>
    );
}

export default CreateTrip;