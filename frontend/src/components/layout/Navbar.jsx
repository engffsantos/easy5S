import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ClipboardCheck, Menu, X, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/environments', label: 'Ambientes' },
    { path: '/evaluations', label: 'Avaliações' },
    { path: '/calendar', label: 'Calendário' },
    { path: '/employees', label: 'Funcionários' },
    { path: '/corrective-actions', label: 'Ações Corretivas' }
  ];

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center text-primary-500">
            <ClipboardCheck className="h-8 w-8" />
            <span className="ml-2 text-xl font-bold">5S SENAI</span>
          </Link>

          {isAuthenticated && (
            <>
              <div className="hidden md:flex space-x-4 ml-10">
                {navItems.map(({ path, label }) => (
                  <Link
                    key={path}
                    to={path}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(path) ? 'bg-primary-500 text-white' : 'text-gray-700 hover:bg-primary-50'
                    }`}
                  >
                    {label}
                  </Link>
                ))}
              </div>

              <div className="hidden md:flex items-center ml-4">
                <div className="relative group">
                  <button className="flex items-center max-w-xs rounded-full text-sm focus:outline-none">
                    <span className="mr-2 text-gray-700">{user?.name}</span>
                    <img
                      className="h-8 w-8 rounded-full"
                      src={user?.avatarUrl || 'https://via.placeholder.com/40'}
                      alt="User avatar"
                    />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                      <User className="mr-2 h-4 w-4" /> Perfil
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <LogOut className="mr-2 h-4 w-4" /> Sair
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-500 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && isAuthenticated && (
        <div className="md:hidden bg-white px-2 pt-2 pb-3 space-y-1">
          {navItems.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive(path) ? 'bg-primary-500 text-white' : 'text-gray-700 hover:bg-primary-50'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
          <Link
            to="/profile"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-primary-50"
            onClick={() => setIsMenuOpen(false)}
          >
            Perfil
          </Link>
          <button
            onClick={() => {
              handleLogout();
              setIsMenuOpen(false);
            }}
            className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-primary-50"
          >
            Sair
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
