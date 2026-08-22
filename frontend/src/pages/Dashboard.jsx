import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
    // LOAD USER + TRIPS
    // ---------------------------------------

    useEffect(() => {
        async function loadDashboard() {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            try {
                // Load logged-in user
                const userResponse = await fetch(
                    "http://localhost:8080/api/auth/me",
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!userResponse.ok) {
                    if (
                        userResponse.status === 401 ||
                        userResponse.status === 403
                    ) {
                        throw new Error("Session expired");
                    }

                    throw new Error("Failed to load user");
                }

                const userData = await userResponse.json();

                setUser(userData);

                localStorage.setItem(
                    "user",
                    JSON.stringify(userData)
                );

                // Load user's trips
                const tripsResponse = await fetch(
                    "http://localhost:8080/api/trips",
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!tripsResponse.ok) {
                    if (
                        tripsResponse.status === 401 ||
                        tripsResponse.status === 403
                    ) {
                        throw new Error("Session expired");
                    }

                    throw new Error("Failed to load trips");
                }

                const tripsData = await tripsResponse.json();

                setTrips(
                    Array.isArray(tripsData)
                        ? tripsData
                        : []
                );

            } catch (err) {
                console.error("Dashboard error:", err);

                if (err.message === "Session expired") {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");

                    navigate("/login");
                } else {
                    setError(
                        "Unable to load your trips. Please try again."
                    );
                }
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
    // DELETE TRIP
    // ---------------------------------------

    async function handleDeleteTrip(id) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this trip?"
        );

        if (!confirmed) {
            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:8080/api/trips/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (
                response.status === 401 ||
                response.status === 403
            ) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");

                navigate("/login");
                return;
            }

            if (!response.ok) {
                throw new Error("Failed to delete trip");
            }

            setTrips((currentTrips) =>
                currentTrips.filter(
                    (trip) => trip.id !== id
                )
            );

        } catch (err) {
            console.error("Delete trip error:", err);

            setError(
                "Unable to delete the trip. Please try again."
            );
        }
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
    // DASHBOARD
    // ---------------------------------------

    return (
        <div className="dashboard">

            {/* NAVBAR */}

            <nav className="navbar">

                <div className="logo">
                    🌍 Globetrotter
                </div>

                <div className="nav-right">

                    <span>
                        {user?.name}
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

            {/* MAIN */}

            <main className="dashboard-content">

                {/* HERO */}

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

                {/* SEARCH */}

                <section className="search-section">

                    <h2>
                        Where do you want to go?
                    </h2>

                    <input
                        type="text"
                        placeholder="🔍 Search destinations..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                </section>

                {/* DESTINATIONS */}

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

                {/* MY TRIPS */}

                <section className="trips-section">

                    <div className="section-header">

                        <h2>
                            My Trips
                        </h2>

                        {/* CREATE TRIP */}

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

                    {/* TRIPS LOADING */}

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

                        /* EMPTY TRIPS */

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

                        /* TRIPS GRID */

                        <div className="trips-grid">

                            {trips.map((trip) => (

                                <div
                                    className="trip-card"
                                    key={trip.id}
                                >

                                    {/* CARD HEADER */}

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

                                    {/* DESCRIPTION */}

                                    {trip.description && (
                                        <p className="trip-description">
                                            {trip.description}
                                        </p>
                                    )}

                                    {/* ACTIONS */}

                                    <div className="trip-actions">

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

                            ))}

                        </div>

                    )}

                </section>

            </main>

        </div>
    );
}

export default Dashboard;