import React from 'react';
import Navbar from './Navbar';
import { useAuth } from '../../context/AuthContext';

const Layout = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {isAuthenticated && <Navbar />}
      <main className="flex-1">{children}</main>
      <footer className="bg-white py-4 shadow-inner">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Sistema de Avaliação 5S - SENAI Birigui
        </div>
      </footer>
    </div>
  );
};

export default Layout;
