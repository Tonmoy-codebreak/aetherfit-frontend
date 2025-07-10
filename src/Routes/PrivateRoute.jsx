import React from 'react';

import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../AuthProvider/useAuth';

const PrivateRoute = ({children}) => {
    const { user, loading } = useAuth()
    const location = useLocation()

    if (loading) {
        return (
            <div className='flex justify-center'>
                <span className="loading loading-spinner loading-xl"></span>
            </div>
        );
    }
 
    if (user && user.email) {
        return children;
    } else {
        return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }
};

export default PrivateRoute;