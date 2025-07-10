import React from 'react';
import { Link, Outlet } from 'react-router';

const DashboardLayout = () => {
    return (
        <div>
            <Outlet></Outlet>
            <Link to="/">Home</Link>
        </div>
    );
};

export default DashboardLayout;