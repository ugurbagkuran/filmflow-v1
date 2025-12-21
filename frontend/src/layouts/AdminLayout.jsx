import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-secondary text-text flex">
            {/* Sidebar */}
            <aside className="w-64 bg-surface flex flex-col border-r border-gray-200 dark:border-gray-800">
                <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-primary">Admin Panel</h1>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link to="/admin" className="block px-4 py-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition text-text">
                        Dashboard
                    </Link>
                    <Link to="/admin/movies" className="block px-4 py-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition text-text">
                        Filmler
                    </Link>
                    {/* Gelecekte Kullanıcılar vs. eklenebilir */}
                </nav>

                <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                    <div className="mb-4 px-4 text-sm text-gray-500 dark:text-gray-400">
                        Admin: <span className="text-text">{user?.username}</span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition"
                    >
                        Çıkış Yap
                    </button>
                    <Link
                        to="/"
                        className="block mt-2 w-full text-center px-4 py-2 text-sm text-gray-500 hover:text-text transition"
                    >
                        Siteye Dön
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
