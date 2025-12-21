import { useEffect, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getMovies, deleteMovie } from '../../api/services/movies';
// İkonlar muhtemelen yüklü değildir, SVG veya düz text kullanalım.

const AdminMoviesPage = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState("newest"); // Default: Newest first
    const isFirstRender = useRef(true);

    const fetchMovies = useCallback(async (title = "", sort = sortOption) => {
        try {
            setLoading(true);
            // limit: 100 genel liste, title varsa arama yapar
            const params = { limit: 100 };

            if (title) params.title = title;

            // Sorting logic
            switch (sort) {
                case "newest":
                    params.sort_by = "_id";
                    params.order = "desc";
                    break;
                case "oldest":
                    params.sort_by = "_id";
                    params.order = "asc";
                    break;
                case "title_asc":
                    params.sort_by = "title";
                    params.order = "asc";
                    break;
                case "title_desc":
                    params.sort_by = "title";
                    params.order = "desc";
                    break;
                case "year_newest":
                    params.sort_by = "year";
                    params.order = "desc";
                    break;
                case "year_oldest":
                    params.sort_by = "year";
                    params.order = "asc";
                    break;
                default:
                    params.sort_by = "_id";
                    params.order = "desc";
            }

            const data = await getMovies(params);
            setMovies(data);
        } catch (error) {
            console.error("Filmler çekilemedi", error);
        } finally {
            setLoading(false);
        }
    }, [sortOption]);

    useEffect(() => {
        // Initial fetch only uses defaults
        fetchMovies(searchTerm, sortOption);
    }, [fetchMovies, sortOption]); // Re-fetch when sortOption changes

    // Arama kutusu tamamen silindiğinde 3 saniye bekle ve yenile
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        if (searchTerm === "") {
            const timer = setTimeout(() => {
                fetchMovies("", sortOption);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [searchTerm, fetchMovies, sortOption]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchMovies(searchTerm, sortOption);
    };

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
        // useEffect will trigger fetch
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bu filmi silmek istediğinize emin misiniz?")) {
            try {
                await deleteMovie(id);
                // Listeden çıkar
                setMovies(movies.filter(m => m._id !== id));
            } catch (error) {
                console.error("Silme hatası", error);
                alert("Film silinirken hata oluştu.");
            }
        }
    };

    if (loading && !searchTerm) return <div className="p-4 text-text">Yükleniyor...</div>;

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-3xl font-bold text-text">Film Yönetimi</h2>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <select
                        value={sortOption}
                        onChange={handleSortChange}
                        className="bg-surface text-text px-4 py-2 rounded focus:outline-none focus:border-primary border border-gray-300 dark:border-gray-700 cursor-pointer"
                    >
                        <option value="newest">Eklenme Tarihi (Yeni)</option>
                        <option value="oldest">Eklenme Tarihi (Eski)</option>
                        <option value="title_asc">Alfabetik (A-Z)</option>
                        <option value="title_desc">Alfabetik (Z-A)</option>
                        <option value="year_newest">Yıl (Yeni)</option>
                        <option value="year_oldest">Yıl (Eski)</option>
                    </select>

                    <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-64">
                        <input
                            type="text"
                            placeholder="Film ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-surface text-text px-4 py-2 rounded focus:outline-none focus:border-primary border border-gray-300 dark:border-gray-700 w-full"
                        />
                        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition">
                            Ara
                        </button>
                    </form>

                    <Link
                        to="/admin/movies/new"
                        className="bg-primary hover:bg-red-700 text-white px-4 py-2 rounded font-medium transition flex items-center gap-2 whitespace-nowrap"
                    >
                        <span>+</span> Yeni Film
                    </Link>
                </div>
            </div>

            <div className="bg-surface rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 shadow-lg">
                <table className="w-full text-left text-text">
                    <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 uppercase text-sm border-b border-gray-200 dark:border-gray-800">
                        <tr>
                            <th className="py-3 px-4">Poster</th>
                            <th className="py-3 px-4">Başlık</th>
                            <th className="py-3 px-4">Yıl</th>
                            <th className="py-3 px-4">Yönetmen</th>
                            <th className="py-3 px-4 text-right">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                        {movies.map((movie) => (
                            <tr key={movie._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                                <td className="py-3 px-4">
                                    <img
                                        src={movie.poster_url || "https://via.placeholder.com/50x75"}
                                        alt={movie.title}
                                        className="w-12 h-16 object-cover rounded bg-gray-200 dark:bg-gray-700"
                                    />
                                </td>
                                <td className="py-3 px-4 font-medium text-text">{movie.title}</td>
                                <td className="py-3 px-4">{movie.year}</td>
                                <td className="py-3 px-4">{movie.director}</td>
                                <td className="py-3 px-4 text-right space-x-2">
                                    <Link
                                        to={`/admin/movies/edit/${movie._id}`}
                                        className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition px-2 py-1 rounded border border-blue-500 hover:border-blue-600 dark:border-blue-400 dark:hover:border-blue-300 text-xs inline-block"
                                    >
                                        Düzenle
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(movie._id)}
                                        className="text-primary hover:text-red-700 dark:hover:text-red-400 transition px-2 py-1 rounded border border-primary hover:border-red-700 dark:hover:border-red-400 text-xs inline-block"
                                    >
                                        Sil
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {movies.length === 0 && (
                            <tr>
                                <td colSpan="5" className="py-8 text-center text-gray-500">
                                    Hiç film bulunamadı.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminMoviesPage;
