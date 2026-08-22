import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import CreateTrip from "./pages/CreateTrip";
import EditTrip from "./pages/EditTrip";
import ItineraryBuilder from "./pages/ItineraryBuilder";
import ActivityManager from "./pages/ActivityManager";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Authentication */}

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/signup"
                    element={<Signup />}
                />

                {/* Dashboard */}

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

                {/* Trip Management */}

                <Route
                    path="/create-trip"
                    element={<CreateTrip />}
                />

                <Route
                    path="/edit-trip/:id"
                    element={<EditTrip />}
                />

                {/* Itinerary */}

                <Route
                    path="/trips/:id/itinerary"
                    element={<ItineraryBuilder />}
                />

                {/* Activities */}

                <Route
                    path="/trips/:id/activities"
                    element={<ActivityManager />}
                />

                {/* Fallback */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;