import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaSearch, FaBars, FaTimes } from 'react-icons/fa';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
    setMenuOpen(false);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  return (
    <header className="bg-slate-200 shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto p-3">
        <div className="flex justify-between items-center flex-wrap gap-3">
          {/* Logo */}
          <Link to="/">
            <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
              <span className="text-slate-500">Estate</span>
              <span className="text-slate-700">Nest</span>
            </h1>
          </Link>

          {/* Search Bar */}
          <form
            onSubmit={handleSubmit}
            className="bg-slate-100 p-2 rounded-lg flex items-center flex-1 sm:flex-initial"
          >
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent focus:outline-none w-full text-sm sm:text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit">
              <FaSearch className="text-slate-600" />
            </button>
          </form>

          {/* Desktop Menu */}
          <ul className="hidden sm:flex gap-4 items-center">
            <Link to="/">
              <li className="text-slate-700 hover:underline">Home</li>
            </Link>
            <Link to="/about">
              <li className="text-slate-700 hover:underline">About</li>
            </Link>
            <Link to="/profile">
              {currentUser ? (
                <img
                  className="rounded-full h-7 w-7 object-cover"
                  src={currentUser.avatar}
                  alt="profile"
                />
              ) : (
                <li className="text-slate-700 hover:underline">Sign In</li>
              )}
            </Link>
          </ul>

          {/* Mobile Menu Icon */}
          <div className="sm:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? (
                <FaTimes className="text-xl text-slate-700" />
              ) : (
                <FaBars className="text-xl text-slate-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="sm:hidden mt-3 bg-white shadow-md rounded-md p-4 flex flex-col gap-3 z-10">
            <Link to="/" onClick={() => setMenuOpen(false)}>
              <span className="text-slate-700">Home</span>
            </Link>
            <Link to="/about" onClick={() => setMenuOpen(false)}>
              <span className="text-slate-700">About</span>
            </Link>
            <Link to="/profile" onClick={() => setMenuOpen(false)}>
              {currentUser ? (
                <img
                  className="rounded-full h-7 w-7 object-cover"
                  src={currentUser.avatar}
                  alt="profile"
                />
              ) : (
                <span className="text-slate-700">Sign In</span>
              )}
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
