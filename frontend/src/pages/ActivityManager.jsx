import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    getTripStops,
    getActivities,
    createActivity,
    deleteActivity,
} from "../services/api";

function ActivityManager() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [stops, setStops] = useState([]);
    const [selectedStop, setSelectedStop] = useState(null);
    const [activities, setActivities] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        cost: "",
        durationMinutes: "",
        activityDate: "",
    });

    useEffect(() => {
        async function loadStops() {
            try {
                const data = await getTripStops(id);

                const stopList = Array.isArray(data)
                    ? data
                    : [];

                setStops(stopList);

                if (stopList.length > 0) {
                    setSelectedStop(stopList[0]);
                }
            } catch (err) {
                console.error(err);
                setError("Unable to load trip stops.");
            } finally {
                setLoading(false);
            }
        }

        loadStops();
    }, [id]);

    useEffect(() => {
        async function loadActivities() {
            if (!selectedStop) {
                setActivities([]);
                return;
            }

            try {
                const data = await getActivities(
                    id,
                    selectedStop.id
                );

                setActivities(
                    Array.isArray(data) ? data : []
                );
            } catch (err) {
                console.error(err);
                setError("Unable to load activities.");
            }
        }

        loadActivities();
    }, [id, selectedStop]);

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: value,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (
            !formData.name ||
            !formData.cost ||
            !formData.durationMinutes ||
            !formData.activityDate
        ) {
            setError(
                "Please fill in the activity name, cost, duration and date."
            );
            return;
        }

        if (!selectedStop) {
            setError("Please select a city first.");
            return;
        }

        setSaving(true);
        setError("");

        try {
            const activity = await createActivity(
                id,
                selectedStop.id,
                {
                    name: formData.name,
                    description: formData.description,
                    cost: Number(formData.cost),
                    durationMinutes: Number(
                        formData.durationMinutes
                    ),
                    activityDate:
                        formData.activityDate,
                }
            );

            setActivities((current) => [
                ...current,
                activity,
            ]);

            setFormData({
                name: "",
                description: "",
                cost: "",
                durationMinutes: "",
                activityDate: "",
            });
        } catch (err) {
            console.error(err);
            setError(
                err.message ||
                "Unable to create activity."
            );
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(activityId) {
        try {
            await deleteActivity(
                id,
                selectedStop.id,
                activityId
            );

            setActivities((current) =>
                current.filter(
                    (activity) =>
                        activity.id !== activityId
                )
            );
        } catch (err) {
            console.error(err);
            setError("Unable to delete activity.");
        }
    }

    function formatDate(date) {
        if (!date) {
            return "";
        }

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric",
            }
        );
    }

    if (loading) {
        return (
            <div className="dashboard-loading">
                Loading activities...
            </div>
        );
    }

    return (
        <div className="trip-page">

            <nav className="navbar">

                <div
                    className="logo"
                    onClick={() =>
                        navigate("/dashboard")
                    }
                    style={{ cursor: "pointer" }}
                >
                    🌍 Globetrotter
                </div>

                <button
                    type="button"
                    className="logout-button"
                    onClick={() =>
                        navigate(
                            `/trips/${id}/itinerary`
                        )
                    }
                >
                    Back to Itinerary
                </button>

            </nav>

            <main className="trip-page-content">

                <div className="trip-form-header">

                    <p className="eyebrow">
                        MAKE YOUR TRIP MEMORABLE
                    </p>

                    <h1>
                        Activities 🎯
                    </h1>

                    <p>
                        Add experiences and activities
                        to each city in your trip.
                    </p>

                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {/* CITY SELECTOR */}

                <section className="trip-form-card">

                    <h2>
                        Choose a city
                    </h2>

                    {stops.length === 0 ? (

                        <div className="empty-trips">

                            <div className="empty-icon">
                                🗺️
                            </div>

                            <h3>
                                No cities yet
                            </h3>

                            <p>
                                Add a stop to your
                                itinerary first.
                            </p>

                            <button
                                type="button"
                                className="primary-button"
                                onClick={() =>
                                    navigate(
                                        `/trips/${id}/itinerary`
                                    )
                                }
                            >
                                Add City
                            </button>

                        </div>

                    ) : (

                        <div className="destination-grid">

                            {stops.map((stop) => (

                                <button
                                    type="button"
                                    key={stop.id}
                                    className={
                                        selectedStop?.id ===
                                        stop.id
                                            ? "destination-card selected"
                                            : "destination-card"
                                    }
                                    onClick={() =>
                                        setSelectedStop(
                                            stop
                                        )
                                    }
                                >

                                    <div className="destination-emoji">
                                        📍
                                    </div>

                                    <h3>
                                        {stop.city}
                                    </h3>

                                    <p>
                                        {formatDate(
                                            stop.startDate
                                        )}{" "}
                                        →{" "}
                                        {formatDate(
                                            stop.endDate
                                        )}
                                    </p>

                                </button>

                            ))}

                        </div>

                    )}

                </section>

                {/* ADD ACTIVITY */}

                {selectedStop && (
                    <form
                        className="trip-form-card"
                        onSubmit={handleSubmit}
                    >

                        <h2>
                            Add activity in{" "}
                            {selectedStop.city}
                        </h2>

                        <div className="form-group">

                            <label>
                                Activity name
                            </label>

                            <input
                                name="name"
                                type="text"
                                placeholder="e.g. Scuba Diving"
                                value={formData.name}
                                onChange={
                                    handleChange
                                }
                                required
                            />

                        </div>

                        <div className="form-group">

                            <label>
                                Description
                            </label>

                            <textarea
                                name="description"
                                placeholder="Describe the activity..."
                                value={
                                    formData.description
                                }
                                onChange={
                                    handleChange
                                }
                                rows="3"
                            />

                        </div>

                        <div className="form-row">

                            <div className="form-group">

                                <label>
                                    Cost (₹)
                                </label>

                                <input
                                    name="cost"
                                    type="number"
                                    min="0"
                                    placeholder="1500"
                                    value={
                                        formData.cost
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />

                            </div>

                            <div className="form-group">

                                <label>
                                    Duration (minutes)
                                </label>

                                <input
                                    name="durationMinutes"
                                    type="number"
                                    min="1"
                                    placeholder="120"
                                    value={
                                        formData.durationMinutes
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />

                            </div>

                        </div>

                        <div className="form-group">

                            <label>
                                Activity date
                            </label>

                            <input
                                name="activityDate"
                                type="date"
                                value={
                                    formData.activityDate
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            />

                        </div>

                        <button
                            type="submit"
                            className="primary-button"
                            disabled={saving}
                        >
                            {saving
                                ? "Adding..."
                                : "+ Add Activity"}
                        </button>

                    </form>
                )}

                {/* ACTIVITIES */}

                {selectedStop && (
                    <section className="trips-section">

                        <div className="section-header">

                            <h2>
                                Activities in{" "}
                                {selectedStop.city}
                            </h2>

                        </div>

                        {activities.length === 0 ? (

                            <div className="empty-trips">

                                <div className="empty-icon">
                                    🎯
                                </div>

                                <h3>
                                    No activities yet
                                </h3>

                                <p>
                                    Add your first
                                    activity above.
                                </p>

                            </div>

                        ) : (

                            <div className="trips-grid">

                                {activities.map(
                                    (activity) => (

                                        <div
                                            className="trip-card"
                                            key={
                                                activity.id
                                            }
                                        >

                                            <div className="trip-card-header">

                                                <div>

                                                    <p className="eyebrow">
                                                        {formatDate(
                                                            activity.activityDate
                                                        )}
                                                    </p>

                                                    <h3>
                                                        {
                                                            activity.name
                                                        }
                                                    </h3>

                                                </div>

                                                <span className="trip-icon">
                                                    🎯
                                                </span>

                                            </div>

                                            {activity.description && (
                                                <p className="trip-description">
                                                    {
                                                        activity.description
                                                    }
                                                </p>
                                            )}

                                            <div className="trip-meta">

                                                <span>
                                                    💰 ₹
                                                    {activity.cost}
                                                </span>

                                                <span>
                                                    ⏱️{" "}
                                                    {
                                                        activity.durationMinutes
                                                    }{" "}
                                                    min
                                                </span>

                                            </div>

                                            <div className="trip-actions">

                                                <button
                                                    type="button"
                                                    className="delete-button"
                                                    onClick={() =>
                                                        handleDelete(
                                                            activity.id
                                                        )
                                                    }
                                                >
                                                    Remove
                                                </button>

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </section>
                )}

            </main>

        </div>
    );
}

export default ActivityManager;