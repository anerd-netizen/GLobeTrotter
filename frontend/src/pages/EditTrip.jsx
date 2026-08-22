import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditTrip() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [formData, setFormData] = useState({
        name: "",
        startDate: "",
        endDate: "",
        description: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadTrip() {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const response = await fetch(
                    "http://localhost:8080/api/trips",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to load trips");
                }

                const trips = await response.json();

                const trip = trips.find(
                    (item) => String(item.id) === String(id)
                );

                if (!trip) {
                    throw new Error("Trip not found");
                }

                setFormData({
                    name: trip.name || "",
                    startDate: trip.startDate || "",
                    endDate: trip.endDate || "",
                    description: trip.description || "",
                });
            } catch (err) {
                console.error("Load trip error:", err);
                setError(err.message || "Unable to load trip");
            } finally {
                setLoading(false);
            }
        }

        loadTrip();
    }, [id, navigate]);

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
                `http://localhost:8080/api/trips/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(formData),
                }
            );

            if (!response.ok) {
                const text = await response.text();

                throw new Error(
                    text || `Failed to update trip (${response.status})`
                );
            }

            navigate("/dashboard");
        } catch (err) {
            console.error("Update trip error:", err);

            setError(
                err.message || "Unable to update trip"
            );
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="dashboard-loading">
                Loading trip...
            </div>
        );
    }

    return (
        <div className="dashboard">

            {/* NAVBAR */}
            <nav className="navbar">
                <div className="logo">
                    Globetrotter
                </div>

                <button
                    className="logout-button"
                    onClick={() => navigate("/dashboard")}
                >
                    Back to Dashboard
                </button>
            </nav>

            {/* PAGE CONTENT */}
            <main className="trip-page-content">

                {/* HEADER */}
                <section className="trip-form-header">
                    <div>
                        <p className="eyebrow">
                            YOUR TRAVEL COMPANION
                        </p>

                        <h1>
                            Edit your trip
                        </h1>

                        <p className="hero-text">
                            Update your trip details below.
                        </p>
                    </div>
                </section>

                {/* FORM */}
                <section className="trips-section">

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="trip-form-card"
                    >

                        {/* TRIP NAME */}
                        <div className="form-group">
                            <label htmlFor="name">
                                Trip Name
                            </label>

                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. Goa Vacation"
                                required
                            />
                        </div>

                        {/* START DATE */}
                        <div className="form-group">
                            <label htmlFor="startDate">
                                Start Date
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

                        {/* END DATE */}
                        <div className="form-group">
                            <label htmlFor="endDate">
                                End Date
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

                        {/* DESCRIPTION */}
                        <div className="form-group">
                            <label htmlFor="description">
                                Description
                            </label>

                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Tell us about your trip..."
                                rows="5"
                            />
                        </div>

                        {/* ACTIONS */}
                        <div className="trip-actions">

                            <button
                                type="button"
                                className="secondary-button"
                                onClick={() =>
                                    navigate("/dashboard")
                                }
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="primary-button"
                                disabled={saving}
                            >
                                {saving
                                    ? "Saving..."
                                    : "Save Changes"}
                            </button>

                        </div>

                    </form>

                </section>

            </main>

        </div>
    );
}

export default EditTrip;