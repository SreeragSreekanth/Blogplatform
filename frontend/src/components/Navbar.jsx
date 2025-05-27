import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Notification from "./Notifications";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [username, setUsername] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
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
    // Close mobile menu on route change
    setMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("username");
    setUsername(null);
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-700 to-purple-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Left Section: Logo & Nav Links */}
          <div className="flex items-center space-x-6">
            <Link
              to="/"
              className="text-2xl font-bold text-white hover:text-indigo-200 transition"
            >
              BlogSphere
            </Link>

            <div className="hidden md:flex space-x-4">
              {username && (
                <>
                  <Link
                    to="/blogs"
                    className="text-white hover:text-indigo-200 text-sm font-medium transition"
                  >
                    Blogs
                  </Link>
                  <Link
                    to="/blogs/create"
                    className="text-white hover:text-indigo-200 text-sm font-medium transition"
                  >
                    Create Blog
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Right Section: Auth Buttons & Notifications */}
          <div className="hidden md:flex items-center space-x-4">
            {username && <Notification />}
            {username ? (
              <>
                <span className="text-indigo-100 text-sm">Welcome,</span>
                <Link
                  to={`/profile/${username}`}
                  className="text-white font-medium hover:text-indigo-200 transition"
                >
                  {username}
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-md text-sm font-medium transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-md text-sm font-medium transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium transition shadow"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-white">
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {menuOpen && (
          <div className="md:hidden mt-4 space-y-2">
            {username && (
              <>
                <Link to="/blogs" className="block text-white hover:text-indigo-200">
                  Blogs
                </Link>
                <Link to="/blogs/create" className="block text-white hover:text-indigo-200">
                  Create Blog
                </Link>
                <Link to={`/profile/${username}`} className="block text-white hover:text-indigo-200">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left text-white hover:text-indigo-200"
                >
                  Logout
                </button>
              </>
            )}
            {!username && (
              <>
                <Link to="/login" className="block text-white hover:text-indigo-200">
                  Login
                </Link>
                <Link to="/register" className="block text-white hover:text-indigo-200">
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
