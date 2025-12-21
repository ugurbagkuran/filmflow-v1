import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios'; // Doğrudan axios kullanarak basit bir fetch yapalım veya servisten çekelim

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        movieCount: 0,
        // userCount: 0 
    });

    useEffect(() => {
        // İstatistikleri çekmek için API çağrısı yapılabilir
        // Şimdilik sadece film sayısını öğrenmek için basit bir yol izleyelim
        // Backend'de özel bir stats endpoint'i yoksa, full film listesi çekmek performanssız olabilir ama şimdilik demo amaçlı count alalım.
        const fetchStats = async () => {
            try {
                // Burada backend'de list endpoint'i limit destekliyor, sadece count almak için ideal bir yol yoksa
                // şimdilik manuel bir endpoint olmadığı için bunu atlayabiliriz veya 
                // listeyi çekip length alabiliriz (bu kötü bir pratik ama demo için ok)
                // Daha iyisi sadece statik bir karşılama ekranı yapmak.

                // Demo verisi:
                setStats({ movieCount: '-' });
            } catch (error) {
                console.error("Stats error", error);
            }
        };

        fetchStats();
    }, []);

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 text-text">Yönetim Paneli</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-surface p-6 rounded-lg shadow-lg border border-gray-800">
                    <h3 className="text-xl font-semibold mb-2 text-gray-400">Toplam Film</h3>
                    <p className="text-4xl font-bold text-primary">{stats.movieCount}</p>
                    <Link to="/admin/movies" className="text-sm text-blue-400 hover:underline mt-4 inline-block">
                        Yönet &rarr;
                    </Link>
                </div>

                {/* Diğer kartlar eklenebilir */}
                <div className="bg-surface p-6 rounded-lg shadow-lg border border-gray-800 opacity-50 cursor-not-allowed">
                    <h3 className="text-xl font-semibold mb-2 text-gray-400">Kullanıcılar</h3>
                    <p className="text-4xl font-bold text-gray-500">-</p>
                    <span className="text-sm text-gray-500 mt-4 inline-block">
                        Yakında...
                    </span>
                </div>
            </div>

            <div className="mt-10 bg-surface p-6 rounded-lg border border-gray-800">
                <h3 className="text-xl font-semibold mb-4 text-text">Hızlı İşlemler</h3>
                <div className="flex gap-4">
                    <Link
                        to="/admin/movies/new"
                        className="bg-primary hover:bg-red-700 text-white px-6 py-2 rounded font-medium transition"
                    >
                        Yeni Film Ekle
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
