import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMovies } from '../api/services/movies';

const SearchBar = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const navigate = useNavigate();

    // Debounce search
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (query.trim().length > 1) { // Only search if 2+ chars
                setIsSearching(true);
                try {
                    const results = await getMovies({ title: query, limit: 5 });
                    setSuggestions(results);
                } catch (error) {
                    console.error("Search failed", error);
                    setSuggestions([]);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setSuggestions([]);
            }
        }, 300); // 300ms delay

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSuggestions([]); // Clear suggestions on submit
        if (query.trim()) {
            navigate(`/movies?title=${encodeURIComponent(query)}`);
            // Optional: collapse after search?
            // setIsExpanded(false); 
        }
    };

    const handleSuggestionClick = (movieId) => {
        navigate(`/movies/${movieId}`);
        setQuery('');
        setSuggestions([]);
        setIsExpanded(false);
    };

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => !query && setIsExpanded(false)}
        >
            <form
                onSubmit={handleSubmit}
                className={`flex items-center transition-all duration-500 ease-in-out ${isExpanded ? 'w-64' : 'w-10'}`}
            >
                <button
                    type="button"
                    className="absolute left-0 z-10 p-2 text-gray-400 hover:text-white transition-colors"
                    onClick={() => {
                        if (!isExpanded) setIsExpanded(true);
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                </button>
                <input
                    type="text"
                    placeholder="Titles, people, genres..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className={`
                        w-full bg-black/50 border border-white/20 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary
                        transition-all duration-500 ease-in-out
                        ${isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'}
                    `}
                    onBlur={() => setTimeout(() => {
                        if (!query) setIsExpanded(false);
                        // Delay clearing suggestions to allow click to register
                        setSuggestions([]);
                    }, 200)}
                />
            </form>

            {/* Live Search Results Dropdown */}
            {isExpanded && suggestions.length > 0 && (
                <div className="absolute top-12 left-0 right-0 bg-surface border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
                    {suggestions.map((movie) => (
                        <div
                            key={movie._id}
                            onClick={() => handleSuggestionClick(movie._id)}
                            className="flex items-center gap-3 p-3 hover:bg-white/10 cursor-pointer transition-colors border-b border-white/5 last:border-0"
                        >
                            <img src={movie.poster_url} alt={movie.title} className="w-10 h-14 object-cover rounded bg-gray-800" />
                            <div>
                                <h4 className="text-sm font-medium text-white line-clamp-1">{movie.title}</h4>
                                <span className="text-xs text-gray-400">{movie.year}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchBar;
