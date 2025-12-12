import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMovie } from '../api/services/movies';
import { getMovieReviews } from '../api/services/reviews';

const MovieDetailPage = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [similarMovies, setSimilarMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setSimilarMovies([]); // Reset similar movies on id change
            try {
                const [movieData, reviewsData] = await Promise.all([
                    getMovie(id),
                    getMovieReviews(id)
                ]);
                setMovie(movieData);
                setReviews(reviewsData);

                if (movieData.similar_movies && movieData.similar_movies.length > 0) {
                    // Slice to max 5 similar movies to avoid overcrowding sidebar
                    const limitSim = movieData.similar_movies.slice(0, 5);
                    const promises = limitSim.map(simId => getMovie(simId).catch(err => null));
                    const results = await Promise.all(promises);
                    setSimilarMovies(results.filter(m => m !== null));
                }

            } catch (error) {
                console.error("Failed to fetch movie details", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 animate-pulse">
                <div className="h-[50vh] bg-surface rounded-3xl mb-8"></div>
                <div className="h-8 w-1/3 bg-surface rounded mb-4"></div>
                <div className="h-4 w-2/3 bg-surface rounded mb-2"></div>
            </div>
        );
    }

    if (!movie) {
        return <div className="text-center py-20">Movie not found</div>;
    }

    return (
        <div>
            {/* Backdrop / Hero */}
            <div className="relative h-[60vh] w-full">
                <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/80 to-transparent z-10"></div>
                <img
                    src={movie.poster_url}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 z-20 container mx-auto px-4 pb-12 flex items-end gap-8">
                    <img
                        src={movie.poster_url}
                        alt={movie.title}
                        className="hidden md:block w-48 rounded-lg shadow-2xl border-4 border-white/10"
                    />
                    <div className="mb-4">
                        <h1 className="text-4xl md:text-6xl font-bold mb-2">{movie.title}</h1>
                        <div className="flex items-center gap-4 text-gray-300 text-sm md:text-base">
                            <span>{movie.year}</span>
                            <span>•</span>
                            <span className="text-yellow-500 font-bold">★ {movie.average_rating || movie.rating}</span>
                            <span>•</span>
                            <span>{movie.director}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-4">
                            {movie.genre && movie.genre.map(g => (
                                <span key={g} className="px-3 py-1 bg-white/10 backdrop-blur rounded-full text-xs">{g}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 grid md:grid-cols-3 gap-12">
                {/* Main Content */}
                <div className="md:col-span-2 space-y-12">
                    <section>
                        <h2 className="text-2xl font-bold mb-4">Plot</h2>
                        <p className="text-gray-300 leading-relaxed text-lg">
                            {movie.description || "No description available."}
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">Cast</h2>
                        <div className="flex flex-wrap gap-4">
                            {movie.cast && movie.cast.map(actor => (
                                <div key={actor} className="flex items-center gap-3 bg-surface px-4 py-2 rounded-lg">
                                    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-xs">
                                        {actor.charAt(0)}
                                    </div>
                                    <span>{actor}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-6">Reviews</h2>
                        {reviews.length > 0 ? (
                            <div className="space-y-4">
                                {reviews.map(review => (
                                    <div key={review._id} className="bg-surface p-6 rounded-xl border border-white/5">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="font-bold text-gray-200">User</div>
                                            <div className="flex text-yellow-500 text-sm">
                                                ★ {review.rating}/10
                                            </div>
                                        </div>
                                        <p className="text-gray-300">{review.comment}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-gray-500 italic">No reviews yet. Be the first to review!</div>
                        )}
                        <div className="mt-8 p-6 bg-surface/50 rounded-xl border border-dashed border-white/10 text-center">
                            <p className="mb-4">Have you seen this movie?</p>
                            <Link to="/login" className="text-primary hover:underline">Log in to leave a review</Link>
                        </div>
                    </section>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    <div className="bg-surface p-6 rounded-xl border border-white/5">
                        <h3 className="font-bold mb-4 text-lg">Details</h3>
                        <dl className="space-y-4 text-sm">
                            <div>
                                <dt className="text-gray-500">Director</dt>
                                <dd>{movie.director}</dd>
                            </div>
                            <div>
                                <dt className="text-gray-500">Release Date</dt>
                                <dd>{movie.year}</dd>
                            </div>
                        </dl>
                    </div>

                    {/* Similar Movies Section */}
                    {similarMovies.length > 0 && (
                        <div className="bg-surface p-6 rounded-xl border border-white/5">
                            <h3 className="font-bold mb-4 text-lg">Similar Movies</h3>
                            <div className="space-y-4">
                                {similarMovies.map(simMovie => (
                                    <Link key={simMovie._id} to={`/movies/${simMovie._id}`} className="flex gap-4 group">
                                        <img
                                            src={simMovie.poster_url}
                                            alt={simMovie.title}
                                            className="w-16 h-24 object-cover rounded bg-gray-800"
                                        />
                                        <div>
                                            <h4 className="font-medium group-hover:text-primary transition-colors line-clamp-2">{simMovie.title}</h4>
                                            <span className="text-xs text-gray-500">{simMovie.year}</span>
                                            <div className="flex items-center gap-1 text-xs text-yellow-500 mt-1">
                                                <span>★</span>
                                                <span>{simMovie.average_rating || 0}</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MovieDetailPage;
