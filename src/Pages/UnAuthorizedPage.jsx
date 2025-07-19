// src/pages/UnAuthorizedPage.jsx
import React from 'react';
import { Link } from 'react-router';

const UnAuthorizedPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800 p-4">
      <h1 className="text-6xl font-bold text-red-600 mb-4">⛔️ Access Denied</h1>
      <p className="text-xl text-center mb-8">
        You do not have permission to view this page.
      </p>
      <Link
        to="/" 
        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default UnAuthorizedPage;