import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { register } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await register(formData);
            navigate('/login');
        } catch (err) {
            console.error(err);
            const detail = err.response?.data?.detail;
            const errorMessage = Array.isArray(detail)
                ? detail.map(e => e.msg).join(', ')
                : (detail || 'Registration failed. Please try again.');
            setError(errorMessage);
        }
    };

    return (
        <div className="flex min-h-[80vh] items-center justify-center p-4">
            <div className="w-full max-w-md bg-surface p-8 rounded-2xl shadow-2xl border border-white/5">
                <h2 className="text-3xl font-bold mb-6 text-center">Create Account</h2>
                {error && <div className="bg-red-500/10 text-red-500 p-3 rounded mb-4 text-center">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors text-white"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors text-white"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors text-white"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                    >
                        Sign Up
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-400">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary hover:underline">
                        Log in
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
