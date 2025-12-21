import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createMovie, getMovie, updateMovie } from '../../api/services/movies';

const AdminMovieEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = !!id;

    const [formData, setFormData] = useState({
        title: '',
        director: '',
        year: new Date().getFullYear(),
        genre: '',
        cast: '',
        description: '',
        poster_url: '',
        // rating: 0, // Rating genelde kullanıcı oylarıyla oluşur ama elle girilecekse eklenebilir. Şemada varsa.
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isEditing) {
            const fetchMovie = async () => {
                try {
                    setLoading(true);
                    const movie = await getMovie(id);
                    // Formu doldur
                    setFormData({
                        title: movie.title || '',
                        director: movie.director || '',
                        year: movie.year || '',
                        genre: Array.isArray(movie.genre) ? movie.genre.join(', ') : (movie.genre || ''),
                        cast: Array.isArray(movie.cast) ? movie.cast.join(', ') : (movie.cast || ''),
                        description: movie.description || '',
                        poster_url: movie.poster_url || '',
                    });
                } catch (err) {
                    console.error("Film detayları yüklenemedi", err);
                    setError("Film bulunamadı veya yüklenirken hata oluştu.");
                } finally {
                    setLoading(false);
                }
            };
            fetchMovie();
        }
    }, [id, isEditing]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Yıl sayı olmalı, genre ve cast array olmalı
            const payload = {
                ...formData,
                year: parseInt(formData.year),
                genre: formData.genre.split(',').map(g => g.trim()).filter(g => g !== ''),
                cast: formData.cast.split(',').map(c => c.trim()).filter(c => c !== '')
            };

            if (isEditing) {
                await updateMovie(id, payload);
            } else {
                await createMovie(payload);
            }
            navigate('/admin/movies');
        } catch (err) {
            console.error("Kaydetme hatası", err);
            setError("Kaydetme sırasında bir hata oluştu. Lütfen bilgileri kontrol edin.");
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEditing && !formData.title) return <div className="p-8 text-text">Yükleniyor...</div>;

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-text">
                {isEditing ? 'Filmi Düzenle' : 'Yeni Film Ekle'}
            </h2>

            {error && (
                <div className="bg-red-500 text-white p-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-surface p-6 rounded-lg shadow-lg border border-gray-800 space-y-4">
                <div>
                    <label className="block text-gray-400 mb-1">Film Başlığı</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="w-full bg-secondary text-text border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-primary"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-400 mb-1">Yönetmen</label>
                        <input
                            type="text"
                            name="director"
                            value={formData.director}
                            onChange={handleChange}
                            required
                            className="w-full bg-secondary text-text border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-primary"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-1">Yıl</label>
                        <input
                            type="number"
                            name="year"
                            value={formData.year}
                            onChange={handleChange}
                            required
                            className="w-full bg-secondary text-text border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-primary"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-gray-400 mb-1">Tür (Virgülle ayırın)</label>
                    <input
                        type="text"
                        name="genre"
                        value={formData.genre}
                        onChange={handleChange}
                        className="w-full bg-secondary text-text border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-primary"
                    />
                </div>

                <div>
                    <label className="block text-gray-400 mb-1">Oyuncular (Virgülle ayırın)</label>
                    <input
                        type="text"
                        name="cast"
                        value={formData.cast}
                        onChange={handleChange}
                        className="w-full bg-secondary text-text border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-primary"
                    />
                </div>

                <div>
                    <label className="block text-gray-400 mb-1">Açıklama</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        className="w-full bg-secondary text-text border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-primary"
                    ></textarea>
                </div>

                <div>
                    <label className="block text-gray-400 mb-1">Poster URL</label>
                    <input
                        type="url"
                        name="poster_url"
                        value={formData.poster_url}
                        onChange={handleChange}
                        placeholder="https://..."
                        className="w-full bg-secondary text-text border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-primary"
                    />
                    {formData.poster_url && (
                        <div className="mt-2">
                            <p className="text-xs text-gray-500 mb-1">Önizleme:</p>
                            <img src={formData.poster_url} alt="Poster Önizleme" className="h-40 rounded object-cover border border-gray-700" />
                        </div>
                    )}
                </div>

                <div className="pt-4 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/movies')}
                        className="px-4 py-2 rounded text-gray-300 hover:text-white transition"
                    >
                        İptal
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-primary hover:bg-red-700 text-white font-bold px-6 py-2 rounded transition disabled:opacity-50"
                    >
                        {loading ? 'Kaydediliyor...' : 'Kaydet'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminMovieEditor;
