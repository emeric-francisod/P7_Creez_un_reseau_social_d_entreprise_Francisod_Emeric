import { Routes, Route, Outlet, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login/Login.jsx';
import UI from './pages/UI/UI.jsx';
import Home from './pages/Home/Home.jsx';
import Network from './pages/Network/Network.jsx';
import User from './pages/User/User.jsx';
import EmptyUser from './pages/Network/EmptyUser.jsx';
import { useBreakpoint } from './hooks/useBreakpoints.js';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from './utils/selectors.js';
import { BP_ID } from './context/BreakpointContext.js';
import Profile from './pages/Profile/Profile.jsx';
import Error404 from './pages/Error/Error404.jsx';
import Error from './pages/Error/Error.jsx';

/**
 * Adds responsive routing.
 * Depending on the size of the viewport, routes may be nested differently
 * Add authentication checking on protected routes
 */
export default function ResponsiveRoutes({ test }) {
    const breakpoint = useBreakpoint();
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const location = useLocation();

    return (
        <Routes>
            <Route
                path="/"
                element={
                    isAuthenticated ?
                        <UI />
                    :   <Navigate to="/login" state={location} />
                }
            >
                <Route index element={<Home />} />
                <Route path="reseau" element={<Network />}>
                    <Route index element={<EmptyUser />} />
                    {breakpoint === BP_ID.xxl && (
                        <Route path=":userId" element={<User />} />
                    )}
                </Route>
                {breakpoint >= BP_ID.medium &&
                    breakpoint <= BP_ID.extraLarge && (
                        <Route path="reseau/:userId" element={<User />} />
                    )}
                <Route path="profil" element={<Profile />} />
            </Route>
            {breakpoint === BP_ID.compact && (
                <Route
                    path="/reseau/:userId"
                    element={
                        isAuthenticated ?
                            <User topLevelPage />
                        :   <Navigate to="/login" state={location} />
                    }
                />
            )}

            <Route path="/login" element={<Login />} />
            <Route path="/error" element={<Error />} />

            {test && <Route path="/test" element={<Outlet />} />}

            <Route path="*" element={<Error404 />} />
        </Routes>
    );
}

ResponsiveRoutes.defaultProps = {
    test: false,
};

ResponsiveRoutes.propTypes = {
    /* Weither to add a /test route or not, default to false */
    test: PropTypes.bool,
};
