import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import SearchBar from '../components/SearchBar';

const MainLayout = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="min-h-screen bg-secondary text-text font-sans">
            <nav className="bg-secondary/90 backdrop-blur-md sticky top-0 z-50 border-b border-white/10">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <Link to="/" className="group flex items-center gap-1">
                        <span className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600 drop-shadow-lg group-hover:from-red-400 group-hover:to-red-500 transition-all duration-300">
                            FilmFlow
                        </span>
                        <div className="h-2 w-2 rounded-full bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.8)] group-hover:scale-125 transition-transform duration-300"></div>
                    </Link>
                    <div className="flex gap-6 items-center">
                        <Link to="/" className="text-sm font-medium hover:text-primary hover:scale-105 active:scale-95 transition-all">Home</Link>

                        {/* Dropdown Menu */}
                        <div className="relative">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className={`text-sm font-medium hover:text-primary hover:scale-105 active:scale-95 transition-all flex items-center gap-1 ${isMenuOpen ? 'text-primary' : ''}`}
                            >
                                Menu
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-4 h-4 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                </svg>
                            </button>

                            {isMenuOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)}></div>
                                    <div className="absolute top-full left-0 mt-3 w-56 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-2xl z-20 py-2 overflow-hidden flex flex-col">
                                        <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">Browse</div>
                                        <a href="/#new-releases" className="px-4 py-2 text-sm text-gray-200 hover:bg-white/10 hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>New Releases</a>
                                        <a href="/#classics" className="px-4 py-2 text-sm text-gray-200 hover:bg-white/10 hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>Classics</a>
                                        <a href="/#trending" className="px-4 py-2 text-sm text-gray-200 hover:bg-white/10 hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>Trending Now</a>
                                    </div>
                                </>
                            )}
                        </div>

                        <Link to="/movies" className="text-sm font-medium hover:text-primary hover:scale-105 active:scale-95 transition-all">Movies</Link>

                        <SearchBar />

                        <div className="flex gap-3 ml-4">
                            {user ? (
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-gray-300">Hi, {user.username}</span>
                                    <button
                                        onClick={handleLogout}
                                        className="px-4 py-2 text-sm font-medium text-white hover:text-primary transition-colors"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <Link to="/login" className="px-4 py-2 text-sm font-medium text-white hover:text-primary hover:scale-105 active:scale-95 transition-all">
                                        Login
                                    </Link>
                                    <Link to="/register" className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-full hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/30 active:shadow-none">
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
            <main>
                <Outlet />
            </main>
            <footer className="bg-black py-8 mt-20 border-t border-white/10">
                <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} FilmFlow. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default MainLayout;
