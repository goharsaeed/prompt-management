// src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-96 p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6">Prompt Management System</h1>
        <p className="text-center mb-6">Welcome to the prompt management system. Choose your action to proceed.</p>
        <div className="flex justify-center gap-4">
          <Link
            to="/login"
            className="w-1/2 py-3 bg-blue-600 text-white rounded-lg text-center"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="w-1/2 py-3 bg-green-600 text-white rounded-lg text-center"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
