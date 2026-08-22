import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    getMyTrips,
    getTripStops,
    getActivities,
} from "../services/api";

function formatDate(date) {
    if (!date) return "";

    return new Date(`${date}T00:00:00`).toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric",
        }
    );
}

function formatTime(minutes) {
    if (minutes === null || minutes === undefined) {
        return "";
    }

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours === 0) return `${mins} min`;
    if (mins === 0) return `${hours} hr`;

    return `${hours} hr ${mins} min`;
}

function ItineraryView() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [trip, setTrip] = useState(null);
    const [stops, setStops] = useState([]);
    const [activities, setActivities] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadItinerary() {
            try {
                setLoading(true);
                setError("");

                const trips = await getMyTrips();

                const currentTrip = trips.find(
                    (item) => String(item.id) === String(id)
                );

                if (!currentTrip) {
                    throw new Error("Trip not found.");
                }

                setTrip(currentTrip);

                const tripStops = await getTripStops(id);
                setStops(tripStops);

                const activityResults = await Promise.all(
                    tripStops.map(async (stop) => {
                        const data = await getActivities(
                            id,
                            stop.id
                        );

                        return [stop.id, data];
                    })
                );

                setActivities(
                    Object.fromEntries(activityResults)
                );
            } catch (err) {
                setError(
                    err.message ||
                    "Unable to load itinerary."
                );
            } finally {
                setLoading(false);
            }
        }

        loadItinerary();
    }, [id]);

    if (loading) {
        return (
            <main className="page-shell itinerary-view-page">
                <div className="empty-trips">
                    Loading itinerary...
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="page-shell itinerary-view-page">
                <div className="empty-trips">
                    <h3>{error}</h3>

                    <button
                        type="button"
                        className="primary-button"
                        onClick={() => navigate("/dashboard")}
                    >
                        Back to Dashboard
                    </button>
                </div>
            </main>
        );
    }

    const allActivities = Object.values(activities).flat();

    const totalActivityCost = allActivities.reduce(
        (total, activity) =>
            total + Number(activity.cost || 0),
        0
    );

    return (
        <main className="page-shell itinerary-view-page">

            <section className="page-header">
                <div>
                    <p className="eyebrow">
                        ITINERARY VIEW
                    </p>

                    <h1>
                        {trip?.name || "Your Trip"}
                    </h1>

                    <p>
                        {formatDate(trip?.startDate)}
                        {" to "}
                        {formatDate(trip?.endDate)}
                    </p>
                </div>

                <div className="page-header-actions">
                    <button
                        type="button"
                        className="secondary-button"
                        onClick={() =>
                            navigate(`/trips/${id}/calendar`)
                        }
                    >
                        Calendar
                    </button>

    <button
        type="button"
        className="secondary-button"
        onClick={() =>
            navigate(`/trips/${id}/itinerary`)
        }
                    >
                        Edit Itinerary
                    </button>

                    <button
                        type="button"
                        className="primary-button"
                        onClick={() =>
                            navigate(`/trips/${id}/activities`)
                        }
                    >
                        Activities
                    </button>
                </div>
            </section>

            <section className="trips-grid">

                <div className="trip-card">
                    <p className="eyebrow">
                        DESTINATIONS
                    </p>

                    <h2>{stops.length}</h2>

                    <p>
                        {stops.length === 1
                            ? "city"
                            : "cities"}
                    </p>
                </div>

                <div className="trip-card">
                    <p className="eyebrow">
                        ACTIVITIES
                    </p>

                    <h2>{allActivities.length}</h2>

                    <p>
                        planned experiences
                    </p>
                </div>

                <div className="trip-card">
                    <p className="eyebrow">
                        ACTIVITY COST
                    </p>

                    <h2>
                        Rs.{" "}
                        {totalActivityCost.toLocaleString(
                            "en-IN"
                        )}
                    </h2>

                    <p>
                        estimated
                    </p>
                </div>

            </section>

            <section className="trip-form-card">

                <div className="section-heading">
                    <div>
                        <p className="eyebrow">
                            JOURNEY
                        </p>

                        <h2>
                            Your itinerary
                        </h2>
                    </div>
                </div>

                {stops.length === 0 ? (
                    <div className="empty-trips">
                        <h3>
                            No stops added yet
                        </h3>

                        <p>
                            Add cities to your itinerary
                            first.
                        </p>

                        <button
                            type="button"
                            className="primary-button"
                            onClick={() =>
                                navigate(`/trips/${id}/itinerary`)
                            }
                        >
                            Add Stop
                        </button>
                    </div>
                ) : (
                    <div className="itinerary-timeline">

                        {stops.map((stop, index) => {
                            const stopActivities =
                                activities[stop.id] || [];

                            return (
                                <article
                                    className="trip-card"
                                    key={stop.id}
                                >
                                    <div className="trip-card-header">

                                        <div>
                                            <p className="eyebrow">
                                                STOP {index + 1}
                                            </p>

                                            <h2>
                                                {stop.city}
                                            </h2>

                                            <p className="trip-dates">
                                                {formatDate(
                                                    stop.startDate
                                                )}
                                                {" to "}
                                                {formatDate(
                                                    stop.endDate
                                                )}
                                            </p>
                                        </div>

                                        <span className="trip-icon">
                                            📍
                                        </span>

                                    </div>

                                    <div className="activity-list">

                                        {stopActivities.length === 0 ? (
                                            <div className="empty-trips">
                                                <p>
                                                    No activities
                                                    planned for
                                                    this stop.
                                                </p>
                                            </div>
                                        ) : (
                                            stopActivities.map(
                                                (activity) => (
                                                    <div
                                                        className="activity-card"
                                                        key={activity.id}
                                                    >
                                                        <div>
                                                            <p className="eyebrow">
                                                                {formatDate(
                                                                    activity.activityDate
                                                                )}
                                                            </p>

                                                            <h3>
                                                                {activity.name}
                                                            </h3>

                                                            {activity.description && (
                                                                <p>
                                                                    {
                                                                        activity.description
                                                                    }
                                                                </p>
                                                            )}

                                                            {activity.durationMinutes !==
                                                                null &&
                                                                activity.durationMinutes !==
                                                                    undefined && (
                                                                    <p>
                                                                        Duration:{" "}
                                                                        {formatTime(
                                                                            activity.durationMinutes
                                                                        )}
                                                                    </p>
                                                                )}
                                                        </div>

                                                        <strong>
                                                            Rs.{" "}
                                                            {Number(
                                                                activity.cost || 0
                                                            ).toLocaleString(
                                                                "en-IN"
                                                            )}
                                                        </strong>
                                                    </div>
                                                )
                                            )
                                        )}

                                    </div>
                                </article>
                            );
                        })}

                    </div>
                )}

            </section>

        </main>
    );
}

export default ItineraryView;

