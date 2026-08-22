import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getCurrentUser,
    getMyTrips,
    getTripStops,
    deleteTrip,
} from "../services/api";

const destinations = [
    {
        name: "Goa",
        country: "India",
        emoji: "🏝️",
    },
    {
        name: "Paris",
        country: "France",
        emoji: "🗼",
    },
    {
        name: "Tokyo",
        country: "Japan",
        emoji: "🗻",
    },
    {
        name: "Dubai",
        country: "UAE",
        emoji: "🏙️",
    },
];

function Dashboard() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tripsLoading, setTripsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");

    // ---------------------------------------
    // LOAD USER + TRIPS + STOPS
    // ---------------------------------------

    useEffect(() => {
        async function loadDashboard() {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            try {
                setError("");

                // ---------------------------------------
                // LOAD CURRENT USER
                // ---------------------------------------

                const userData = await getCurrentUser();

                setUser(userData);

                localStorage.setItem(
                    "user",
                    JSON.stringify(userData)
                );

                // ---------------------------------------
                // LOAD TRIPS
                // ---------------------------------------

                setTripsLoading(true);

                const tripsData = await getMyTrips();

                const tripsList = Array.isArray(tripsData)
                    ? tripsData
                    : [];

                // ---------------------------------------
                // LOAD STOPS FOR EACH TRIP
                // ---------------------------------------

                const tripsWithStops = await Promise.all(
                    tripsList.map(async (trip) => {
                        try {
                            const stops = await getTripStops(
                                trip.id
                            );

                            return {
                                ...trip,
                                stops: Array.isArray(stops)
                                    ? stops
                                    : [],
                            };
                        } catch (stopError) {
                            console.error(
                                `Failed to load stops for trip ${trip.id}:`,
                                stopError
                            );

                            return {
                                ...trip,
                                stops: [],
                            };
                        }
                    })
                );

                setTrips(tripsWithStops);
            } catch (err) {
                console.error(
                    "Dashboard error:",
                    err
                );

                const message =
                    err?.message || "";

                if (
                    message.includes("401") ||
                    message.includes("403") ||
                    message.includes("Authentication failed") ||
                    message.includes("Session expired")
                ) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");

                    navigate("/login");
                    return;
                }

                setError(
                    message ||
                    "Unable to load your dashboard. Please try again."
                );
            } finally {
                setLoading(false);
                setTripsLoading(false);
            }
        }

        loadDashboard();
    }, [navigate]);

    // ---------------------------------------
    // LOGOUT
    // ---------------------------------------

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    }

    // ---------------------------------------
    // CREATE TRIP
    // ---------------------------------------

    function handleCreateTrip() {
        navigate("/create-trip");
    }

    // ---------------------------------------
    // EDIT TRIP
    // ---------------------------------------

    function handleEditTrip(id) {
        navigate(`/edit-trip/${id}`);
    }

    // ---------------------------------------
    // OPEN ITINERARY
    // ---------------------------------------

    function handleOpenItinerary(id) {
        navigate(`/trips/${id}/itinerary`);
    }

    // ---------------------------------------
    // DELETE TRIP
    // ---------------------------------------

    async function handleDeleteTrip(id) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this trip?"
        );

        if (!confirmed) {
            return;
        }

        setError("");

        try {
            await deleteTrip(id);

            setTrips((currentTrips) =>
                currentTrips.filter(
                    (trip) => trip.id !== id
                )
            );
        } catch (err) {
            console.error(
                "Delete trip error:",
                err
            );

            const message =
                err?.message || "";

            if (
                message.includes("401") ||
                message.includes("403") ||
                message.includes("Authentication failed") ||
                message.includes("Session expired")
            ) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");

                navigate("/login");
                return;
            }

            setError(
                message ||
                "Unable to delete the trip. Please try again."
            );
        }
    }

    // ---------------------------------------
    // DATE FORMAT
    // ---------------------------------------

    function formatDate(date) {
        if (!date) {
            return "";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return date;
        }

        return parsedDate.toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric",
            }
        );
    }

    // ---------------------------------------
    // LOADING
    // ---------------------------------------

    if (loading) {
        return (
            <div className="dashboard-loading">
                Loading Globetrotter...
            </div>
        );
    }

    // ---------------------------------------
    // DESTINATION SEARCH
    // ---------------------------------------

    const filteredDestinations =
        destinations.filter((destination) =>
            `${destination.name} ${destination.country}`
                .toLowerCase()
                .includes(search.toLowerCase())
        );

    // ---------------------------------------
    // DASHBOARD
    // ---------------------------------------

    return (
        <div className="dashboard">

            {/* =====================================
                NAVBAR
            ====================================== */}

            <nav className="navbar">

                <div className="logo">
                    🌍 Globetrotter
                </div>

                <div className="nav-right">

                    <span>
                        {user?.name || "Traveler"}
                    </span>

                    <button
                        type="button"
                        className="logout-button"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </nav>

            {/* =====================================
                MAIN CONTENT
            ====================================== */}

            <main className="dashboard-content">

                {/* =================================
                    HERO
                ================================== */}

                <section className="hero-section">

                    <div>

                        <p className="eyebrow">
                            YOUR TRAVEL COMPANION
                        </p>

                        <h1>
                            Welcome back,{" "}
                            {user?.name?.split(" ")[0] ||
                                "Traveler"}{" "}
                            👋
                        </h1>

                        <p className="hero-text">
                            Discover new places, plan
                            unforgettable journeys, and keep
                            all your trips in one place.
                        </p>

                    </div>

                </section>

                {/* =================================
                    SEARCH
                ================================== */}

                <section className="search-section">

                    <h2>
                        Where do you want to go?
                    </h2>

                    <input
                        type="text"
                        placeholder="🔍 Search destinations..."
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                    />

                </section>

                {/* =================================
                    POPULAR DESTINATIONS
                ================================== */}

                <section>

                    <div className="section-header">

                        <h2>
                            Popular destinations
                        </h2>

                    </div>

                    <div className="destination-grid">

                        {filteredDestinations.map(
                            (destination) => (

                                <div
                                    className="destination-card"
                                    key={destination.name}
                                >

                                    <div className="destination-emoji">
                                        {destination.emoji}
                                    </div>

                                    <h3>
                                        {destination.name}
                                    </h3>

                                    <p>
                                        {destination.country}
                                    </p>

                                </div>

                            )
                        )}

                    </div>

                    {filteredDestinations.length === 0 && (
                        <p className="no-results">
                            No destinations found.
                        </p>
                    )}

                </section>

                {/* =================================
                    MY TRIPS
                ================================== */}

                <section className="trips-section">

                    <div className="section-header">

                        <h2>
                            My Trips
                        </h2>

                        <button
                            type="button"
                            className="primary-button"
                            onClick={handleCreateTrip}
                        >
                            + Create Trip
                        </button>

                    </div>

                    {/* ERROR */}

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    {/* =================================
                        TRIPS LOADING
                    ================================== */}

                    {tripsLoading ? (

                        <div className="empty-trips">

                            <div className="empty-icon">
                                ⏳
                            </div>

                            <h3>
                                Loading your trips...
                            </h3>

                        </div>

                    ) : trips.length === 0 ? (

                        /* =================================
                           NO TRIPS
                        ================================== */

                        <div className="empty-trips">

                            <div className="empty-icon">
                                ✈️
                            </div>

                            <h3>
                                No trips yet
                            </h3>

                            <p>
                                Start planning your next
                                adventure.
                            </p>

                            <button
                                type="button"
                                className="primary-button"
                                onClick={handleCreateTrip}
                            >
                                Plan a Trip
                            </button>

                        </div>

                    ) : (

                        /* =================================
                           TRIPS GRID
                        ================================== */

                        <div className="trips-grid">

                            {trips.map((trip) => {

                                const stops =
                                    Array.isArray(trip.stops)
                                        ? trip.stops
                                        : [];

                                return (
                                    <div
                                        className="trip-card"
                                        key={trip.id}
                                    >

                                        {/* =========================
                                            TRIP HEADER
                                        ========================== */}

                                        <div className="trip-card-header">

                                            <div>

                                                <h3>
                                                    {trip.name}
                                                </h3>

                                                <p className="trip-dates">
                                                    📅{" "}
                                                    {formatDate(
                                                        trip.startDate
                                                    )}{" "}
                                                    →{" "}
                                                    {formatDate(
                                                        trip.endDate
                                                    )}
                                                </p>

                                            </div>

                                            <span className="trip-icon">
                                                ✈️
                                            </span>

                                        </div>

                                        {/* =========================
                                            CITY COUNT
                                        ========================== */}

                                        <div className="trip-meta">

                                            <span>
                                                📍{" "}
                                                {stops.length}{" "}
                                                {stops.length === 1
                                                    ? "city"
                                                    : "cities"}
                                            </span>

                                        </div>

                                        {/* =========================
                                            DESCRIPTION
                                        ========================== */}

                                        {trip.description && (
                                            <p className="trip-description">
                                                {trip.description}
                                            </p>
                                        )}

                                        {/* =========================
                                            STOPS PREVIEW
                                        ========================== */}

                                        {stops.length > 0 && (

                                            <div className="trip-stops-preview">

                                                {stops
                                                    .slice(0, 3)
                                                    .map((stop) => (

                                                        <span
                                                            key={stop.id}
                                                            className="stop-chip"
                                                        >
                                                            📍{" "}
                                                            {stop.city}
                                                        </span>

                                                    ))}

                                                {stops.length > 3 && (

                                                    <span className="stop-chip">
                                                        +{" "}
                                                        {stops.length - 3}{" "}
                                                        more
                                                    </span>

                                                )}

                                            </div>

                                        )}

                                        {/* =========================
                                            ACTION BUTTONS
                                        ========================== */}

                                        <div className="trip-actions">

                                            {/* ITINERARY */}

                                            <button
                                                type="button"
                                                className="primary-button"
                                                onClick={() =>
                                                    handleOpenItinerary(
                                                        trip.id
                                                    )
                                                }
                                            >
                                                Itinerary
                                            </button>

                                            {/* EDIT */}

                                            <button
                                                type="button"
                                                className="secondary-button"
                                                onClick={() =>
                                                    handleEditTrip(
                                                        trip.id
                                                    )
                                                }
                                            >
                                                Edit
                                            </button>

                                            {/* DELETE */}

                                            <button
                                                type="button"
                                                className="delete-button"
                                                onClick={() =>
                                                    handleDeleteTrip(
                                                        trip.id
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>

                                        </div>

                                    </div>
                                );
                            })}

                        </div>

                    )}

                </section>

            </main>

        </div>
    );
}

export default Dashboard;