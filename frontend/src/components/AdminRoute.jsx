import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Yükleniyor...</div>;
    }

    // Kullanıcı giriş yapmış mı ve rolü admin mi?
    if (user && user.role === 'admin') {
        return <Outlet />;
    }

    // Değilse ana sayfaya (veya login'e) yönlendir
    return <Navigate to="/" replace />;
};

export default AdminRoute;
