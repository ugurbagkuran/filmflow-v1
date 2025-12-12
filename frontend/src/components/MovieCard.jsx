import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => {
    return (
        <Link to={`/movies/${movie._id}`} className="group relative block bg-surface rounded-xl overflow-hidden hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
            <div className="aspect-[2/3] overflow-hidden">
                <img
                    src={movie.poster_url || 'https://via.placeholder.com/300x450?text=No+Poster'}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <span className="inline-block px-2 py-1 bg-primary text-white text-xs font-bold rounded mb-2 w-fit">
                        View Details
                    </span>
                </div>
            </div>
            <div className="p-4">
                <h3 className="text-lg font-bold text-white mb-1 truncate group-hover:text-primary transition-colors">
                    {movie.title}
                </h3>
                <div className="flex justify-between items-center text-sm text-gray-400">
                    <span>{movie.year}</span>
                    <div className="flex items-center text-yellow-500">
                        <span className="mr-1">★</span>
                        <span>{movie.average_rating !== undefined ? movie.average_rating : (movie.rating !== undefined ? movie.rating : 'N/A')}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default MovieCard;
