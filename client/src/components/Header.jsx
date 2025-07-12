import React, { useEffect, useState } from "react";
import { FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

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
    <header className='bg-slate-200 shadow-md sticky top-0 z-50'>
      <div className='flex items-center justify-between max-w-6xl mx-auto py-4 px-4 sm:px-8 gap-3'>

        {/* Logo */}
        <Link to='/' className='shrink-0 w-[90px]'>
          <h1 className='font-bold text-lg sm:text-2xl flex flex-wrap'>
            <span className='text-slate-500'>Fasiha</span>
            <span className='text-slate-700'>Estate</span>
          </h1>
        </Link>

        {/* Search */}
        <form
          onSubmit={handleSubmit}
          className="bg-slate-100 p-1.5 sm:p-2 rounded-lg flex items-center flex-1 mx-2"
        >
          <input
            type="text"
            placeholder='Search...'
            className='bg-transparent focus:outline-none w-full text-sm sm:text-base px-1'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">
            <FaSearch className='text-slate-600' />
          </button>
        </form>

        {/* Mobile menu button */}
        <div className='sm:hidden shrink-0 w-[32px] text-right'>
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>

        {/* Desktop nav */}
        <ul className='hidden sm:flex gap-4 items-center'>
          <Link to='/'><li className='text-slate-700 hover:underline'>Home</li></Link>
          <Link to='/about'><li className='text-slate-700 hover:underline'>About</li></Link>
          <Link to='/profile'>
            {currentUser ? (
              <img
                className='rounded-full h-7 w-7 object-cover'
                src={currentUser.avatar}
                alt='profile'
              />
            ) : (
              <li className='text-slate-700 hover:underline'>Sign in</li>
            )}
          </Link>
        </ul>
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="sm:hidden bg-slate-100 p-4 mt-2 space-y-3 text-slate-700 font-medium text-sm">
          <Link to="/" onClick={() => setMenuOpen(false)}>
            <div className="hover:underline">Home</div>
          </Link>
          <Link to="/about" onClick={() => setMenuOpen(false)}>
            <div className="hover:underline">About</div>
          </Link>
          <Link to="/profile" onClick={() => setMenuOpen(false)}>
            {currentUser ? (
              <div className="flex items-center gap-2">
                <img
                  className="h-6 w-6 rounded-full object-cover"
                  src={currentUser.avatar}
                  alt="profile"
                />
                <span>Profile</span>
              </div>
            ) : (
              <div className="hover:underline">Sign in</div>
            )}
          </Link>
        </div>
      )}
    </header>
  );
}
