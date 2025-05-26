import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Notification from "./Notifications"; 

export default function Navbar() {
  const [username, setUsername] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const access = localStorage.getItem("access");
    const storedUsername = localStorage.getItem("username");
    if (access && storedUsername) {
      setUsername(storedUsername);
    } else {
      setUsername(null);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("username");
    setUsername(null);
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-700 to-purple-700 shadow-lg" aria-label="Primary Navigation">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex space-x-8 items-center">
            <Link 
              to="/" 
              className="text-2xl font-bold text-white hover:text-indigo-200 transition-colors duration-300"
              aria-label="Go to homepage"
            >
              BlogSphere
            </Link>
            
            {username && (
              <div className="hidden md:flex space-x-6" role="menubar">
                <Link 
                  to="/blogs" 
                  className="text-white hover:text-indigo-200 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 hover:bg-white/10"
                  role="menuitem"
                >
                  Blogs
                </Link>
                <Link 
                  to="/blogs/create" 
                  className="text-white hover:text-indigo-200 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 hover:bg-white/10"
                  role="menuitem"
                >
                  Create Blog
                </Link>
              </div>
            )}
          </div>
  
          <div className="flex items-center space-x-4">
            {username && <Notification />}
  
            {username ? (
              <>
                <div className="hidden md:flex items-center space-x-2">
                  <span className="text-indigo-100 text-sm">Welcome,</span>
                  <Link
                    to={`/profile/${username}`}
                    className="text-white font-medium hover:text-indigo-200 transition-colors duration-300"
                    aria-label={`Go to profile of ${username}`}
                  >
                    {username}
                  </Link>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  aria-label="Logout"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  aria-label="Login"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  aria-label="Register"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}