import React from 'react';
import Navbar from '../Components/Navbar';
import { Outlet } from 'react-router';

const AuthLayout = () => {
    return (
        <div>
            <Navbar></Navbar>
          
            <Outlet></Outlet>
        
        </div>
    );
};

export default AuthLayout;