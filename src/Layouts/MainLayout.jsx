import React from 'react';
import { Outlet, useLocation } from 'react-router';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { useEffect } from 'react';

const MainLayout = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [pathname]);

    return (
        <div>
            <Navbar />
            <Outlet />
            <Footer />
        </div>
    );
};

export default MainLayout;
