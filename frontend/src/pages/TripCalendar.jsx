import { useEffect, useMemo, useState } from "react";
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

function getDaysBetween(start, end) {
    if (!start || !end) return [];

    const days = [];

    const current = new Date(`${start}T00:00:00`);
    const last = new Date(`${end}T00:00:00`);

    while (current <= last) {
        // Do NOT use toISOString() here.
        // It can shift the date backward because of timezone conversion.
        const year = current.getFullYear();
        const month = String(
            current.getMonth() + 1
        ).padStart(2, "0");
        const day = String(
            current.getDate()
        ).padStart(2, "0");

        days.push(`${year}-${month}-${day}`);

        current.setDate(
            current.getDate() + 1
        );
    }

    return days;
}

function TripCalendar() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [trip, setTrip] = useState(null);
    const [stops, setStops] = useState([]);
    const [activities, setActivities] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadCalendar() {
            try {
                setLoading(true);
                setError("");

                const trips = await getMyTrips();

                const currentTrip = trips.find(
                    (item) =>
                        String(item.id) === String(id)
                );

                if (!currentTrip) {
                    throw new Error("Trip not found.");
                }

                setTrip(currentTrip);

                const tripStops =
                    await getTripStops(id);

                setStops(tripStops);

                const activityResults =
                    await Promise.all(
                        tripStops.map(
                            async (stop) => {
                                const data =
                                    await getActivities(
                                        id,
                                        stop.id
                                    );

                                return [
                                    stop.id,
                                    data,
                                ];
                            }
                        )
                    );

                setActivities(
                    Object.fromEntries(
                        activityResults
                    )
                );
            } catch (err) {
                setError(
                    err.message ||
                    "Unable to load calendar."
                );
            } finally {
                setLoading(false);
            }
        }

        loadCalendar();
    }, [id]);

    const days = useMemo(
        () =>
            getDaysBetween(
                trip?.startDate,
                trip?.endDate
            ),
        [trip]
    );

    function getStopsForDay(day) {
        return stops.filter(
            (stop) =>
                stop.startDate <= day &&
                stop.endDate >= day
        );
    }

    function getActivitiesForDay(day) {
        return Object.values(activities)
            .flat()
            .filter(
                (activity) =>
                    activity.activityDate === day
            );
    }

    if (loading) {
        return (
            <main className="page-shell">
                <div className="empty-trips">
                    Loading calendar...
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="page-shell">
                <div className="empty-trips">
                    <h3>{error}</h3>

                    <button
                        type="button"
                        className="primary-button"
                        onClick={() =>
                            navigate("/dashboard")
                        }
                    >
                        Back to Dashboard
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="page-shell trip-calendar-page">

            {/* ================================
                PAGE HEADER
            ================================= */}

            <section className="page-header">

                <div>
                    <p className="eyebrow">
                        TRIP CALENDAR
                    </p>

                    <h1>
                        {trip?.name ||
                            "Your Trip"}
                    </h1>

                    <p>
                        {formatDate(
                            trip?.startDate
                        )}
                        {" to "}
                        {formatDate(
                            trip?.endDate
                        )}
                    </p>
                </div>

                <div className="page-header-actions">

                    <button
                        type="button"
                        className="secondary-button"
                        onClick={() =>
                            navigate(
                                `/trips/${id}/itinerary-view`
                            )
                        }
                    >
                        Itinerary
                    </button>

                    <button
                        type="button"
                        className="primary-button"
                        onClick={() =>
                            navigate(
                                `/trips/${id}/itinerary`
                            )
                        }
                    >
                        Edit Trip
                    </button>

                </div>

            </section>

            {/* ================================
                CALENDAR
            ================================= */}

            <section className="trip-calendar-card">

                <div className="section-heading">

                    <div>
                        <p className="eyebrow">
                            TIMELINE
                        </p>

                        <h2>
                            Journey Timeline
                        </h2>
                    </div>

                </div>

                {days.length === 0 ? (

                    <div className="empty-trips">

                        <h3>
                            No travel dates
                            available
                        </h3>

                        <p>
                            Add start and end
                            dates to your trip.
                        </p>

                    </div>

                ) : (

                    <div className="calendar-days">

                        {days.map(
                            (day, index) => {

                                const dayStops =
                                    getStopsForDay(
                                        day
                                    );

                                const dayActivities =
                                    getActivitiesForDay(
                                        day
                                    );

                                return (

                                    <article
                                        className="calendar-day"
                                        key={day}
                                    >

                                        {/* DAY HEADER */}

                                        <div className="calendar-day-header">

                                            <div>

                                                <span className="calendar-day-number">
                                                    DAY{" "}
                                                    {index + 1}
                                                </span>

                                                <h3>
                                                    {formatDate(
                                                        day
                                                    )}
                                                </h3>

                                            </div>

                                            <span className="calendar-day-icon">
                                                {String.fromCodePoint(
                                                    0x1f4c5
                                                )}
                                            </span>

                                        </div>

                                        {/* DAY CONTENT */}

                                        <div className="calendar-day-content">

                                            {dayStops.length ===
                                                0 &&
                                                dayActivities.length ===
                                                    0 && (

                                                    <p className="calendar-free-day">
                                                        Free day — no
                                                        activities
                                                        planned.
                                                    </p>

                                                )}

                                            {/* DESTINATIONS */}

                                            {dayStops.map(
                                                (stop) => (

                                                    <div
                                                        className="calendar-item"
                                                        key={`stop-${stop.id}`}
                                                    >

                                                        <div className="calendar-item-icon">
                                                            {String.fromCodePoint(
                                                                0x1f4cd
                                                            )}
                                                        </div>

                                                        <div className="calendar-item-content">

                                                            <span className="calendar-item-label">
                                                                DESTINATION
                                                            </span>

                                                            <h4>
                                                                {
                                                                    stop.city
                                                                }
                                                            </h4>

                                                            <p>
                                                                {formatDate(
                                                                    stop.startDate
                                                                )}
                                                                {" to "}
                                                                {formatDate(
                                                                    stop.endDate
                                                                )}
                                                            </p>

                                                        </div>

                                                    </div>

                                                )
                                            )}

                                            {/* ACTIVITIES */}

                                            {dayActivities.map(
                                                (
                                                    activity
                                                ) => (

                                                    <div
                                                        className="calendar-item"
                                                        key={`activity-${activity.id}`}
                                                    >

                                                        <div className="calendar-item-icon">
                                                            {String.fromCodePoint(
                                                                0x1f3af
                                                            )}
                                                        </div>

                                                        <div className="calendar-item-content">

                                                            <span className="calendar-item-label">
                                                                ACTIVITY
                                                            </span>

                                                            <h4>
                                                                {
                                                                    activity.name
                                                                }
                                                            </h4>

                                                            {activity.description && (
                                                                <p>
                                                                    {
                                                                        activity.description
                                                                    }
                                                                </p>
                                                            )}

                                                        </div>

                                                        <strong className="calendar-item-cost">
                                                            Rs.{" "}
                                                            {Number(
                                                                activity.cost ||
                                                                    0
                                                            ).toLocaleString(
                                                                "en-IN"
                                                            )}
                                                        </strong>

                                                    </div>

                                                )
                                            )}

                                        </div>

                                    </article>

                                );
                            }
                        )}

                    </div>

                )}

            </section>

        </main>
    );
}

export default TripCalendar;