import {BrowserRouter, Routes, Route, Outlet} from "react-router-dom";
import HomePage from '../pages/HomePage';
import {TeamPage} from "../pages/TeamPage.tsx";
import {LandingPage} from "../pages/LandingPage.tsx";
import ProtectedRoute from "./ProtectedRoute.tsx";
import {ProfilePage} from "../pages/ProfilePage.tsx";
import Layout from "../components/layout/Layout.tsx";
import YourTeam from "../pages/YourTeam/YourTeam.tsx";

const LayoutRoute = () => {
    return (
        <Layout>
            <Outlet /> {/* Outlet sẽ render nested routes */}
        </Layout>
    );
};


const MainRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route element={<LayoutRoute />}>
                    <Route path="/dashboard" element={<div> Page</div>} />
                    <Route path="/teams" element={
                        <ProtectedRoute>
                            <YourTeam />
                        </ProtectedRoute>
                    } />


                </Route>
                <Route path="/team/:teamId" element={<TeamPage />} />



                <Route path="/main" element={
                    <ProtectedRoute>
                        <LandingPage />
                    </ProtectedRoute>
                } />
                <Route path="/team/:teamId" element={
                    <ProtectedRoute>
                        <TeamPage />
                    </ProtectedRoute>
                } />
                <Route path="/profile" element={
                    <ProtectedRoute>
                        <ProfilePage />
                    </ProtectedRoute>
                } />
                <Route path="/official-list" element={
                    <ProtectedRoute>
                        <div>Settings Page</div>
                    </ProtectedRoute>
                } />

                <Route path="*" element={<div>404 Page</div>} />
            </Routes>
        </BrowserRouter>
    );
};

export default MainRouter;