import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    getTripStops,
    createTripStop,
    deleteTripStop,
} from "../services/api";

function ItineraryBuilder() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [stops, setStops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        city: "",
        startDate: "",
        endDate: "",
    });

    useEffect(() => {
        async function loadStops() {
            try {
                const data = await getTripStops(id);
                setStops(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error(err);
                setError("Unable to load itinerary.");
            } finally {
                setLoading(false);
            }
        }

        loadStops();
    }, [id]);

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: value,
        }));
    }

    async function handleAddStop(event) {
        event.preventDefault();

        if (!formData.city || !formData.startDate || !formData.endDate) {
            setError("Please fill in all stop details.");
            return;
        }

        setSaving(true);
        setError("");

        try {
            const stop = await createTripStop(id, {
                city: formData.city,
                startDate: formData.startDate,
                endDate: formData.endDate,
                stopOrder: stops.length,
            });

            setStops((current) => [...current, stop]);

            setFormData({
                city: "",
                startDate: "",
                endDate: "",
            });
        } catch (err) {
            console.error(err);
            setError(err.message || "Unable to add stop.");
        } finally {
            setSaving(false);
        }
    }

    async function handleDeleteStop(stopId) {
        try {
            await deleteTripStop(id, stopId);

            setStops((current) =>
                current.filter((stop) => stop.id !== stopId)
            );
        } catch (err) {
            console.error(err);
            setError("Unable to delete stop.");
        }
    }

    function formatDate(date) {
        if (!date) return "";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    }

    if (loading) {
        return (
            <div className="dashboard-loading">
                Loading itinerary...
            </div>
        );
    }

    return (
        <div className="trip-page">

            <nav className="navbar">
                <div
                    className="logo"
                    onClick={() => navigate("/dashboard")}
                    style={{ cursor: "pointer" }}
                >
                     Globetrotter
                </div>

                <button
                    className="logout-button"
                    onClick={() => navigate("/dashboard")}
                >
                    Back to Dashboard
                </button>
            </nav>

            <main className="trip-page-content">

                <div className="trip-form-header">
                    <p className="eyebrow">
                        BUILD YOUR JOURNEY
                    </p>

                    <h1>
                        Itinerary Builder
                    </h1>

                    <p>
                        Add cities and organize the stops in your trip.
                    </p>
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form
                    className="trip-form-card"
                    onSubmit={handleAddStop}
                >
                    <h2>Add a stop</h2>

                    <div className="form-group">
                        <label htmlFor="city">
                            City
                        </label>

                        <input
                            id="city"
                            name="city"
                            type="text"
                            placeholder="e.g. Goa"
                            value={formData.city}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-row">

                        <div className="form-group">
                            <label htmlFor="startDate">
                                Arrival
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
                                Departure
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

                    <button
                        type="submit"
                        className="primary-button"
                        disabled={saving}
                    >
                        {saving ? "Adding..." : "+ Add Stop"}
                    </button>
                </form>

                <section className="trips-section">

                    <div className="section-header">
                        <h2>Your Journey</h2>

                        {stops.length > 0 && (
                            <div className="trip-actions">
                                <button
                                    type="button"
                                    className="primary-button"
                                    onClick={() =>
                                        navigate(`/trips/${id}/activities`)
                                    }
                                >
                                     Activities
                                </button>

                                <button
                                    type="button"
                                    className="primary-button"
                                    onClick={() =>
                                        navigate(`/trips/${id}/budget`)
                                    }
                                >
                                     Budget
                                </button>
                            </div>
                        )}
                    </div>

                    {stops.length === 0 ? (
                        <div className="empty-trips">
                            <div className="empty-icon">
                                +
                            </div>

                            <h3>
                                No stops yet
                            </h3>

                            <p>
                                Add your first city to start building
                                your itinerary.
                            </p>
                        </div>
                    ) : (
                        <div className="trips-grid">

                            {stops.map((stop, index) => (
                                <div
                                    className="trip-card"
                                    key={stop.id}
                                >
                                    <div className="trip-card-header">

                                        <div>
                                            <p className="eyebrow">
                                                STOP {index + 1}
                                            </p>

                                            <h3>
                                                {stop.city}
                                            </h3>

                                            <p className="trip-dates">
                                                {formatDate(stop.startDate)} to {formatDate(stop.endDate)}
                                            </p>
                                        </div>

                                        <span className="trip-icon">

                                        </span>

                                    </div>

                                    <div className="trip-actions">
                                        <button
                                            type="button"
                                            className="delete-button"
                                            onClick={() =>
                                                handleDeleteStop(stop.id)
                                            }
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}

                        </div>
                    )}

                </section>

            </main>
        </div>
    );
}

export default ItineraryBuilder;
