import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import CreateTrip from "./pages/CreateTrip";
import EditTrip from "./pages/EditTrip";
import ItineraryBuilder from "./pages/ItineraryBuilder";
import ActivityManager from "./pages/ActivityManager";
import Budget from "./pages/Budget";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                <Route path="/dashboard" element={<Dashboard />} />

                <Route path="/create-trip" element={<CreateTrip />} />
                <Route path="/edit-trip/:id" element={<EditTrip />} />

                <Route
                    path="/trips/:id/itinerary"
                    element={<ItineraryBuilder />}
                />

                <Route
                    path="/trips/:id/activities"
                    element={<ActivityManager />}
                />

                <Route
                    path="/trips/:id/budget"
                    element={<Budget />}
                />

                <Route
                    path="*"
                    element={<Navigate to="/login" replace />}
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;
