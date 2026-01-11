import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { adminAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
    const { user, isAdmin } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({ totalUsers: 0, totalFlights: 0 });
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isAdmin) {
            navigate('/dashboard');
            return;
        }
        fetchData();
    }, [isAdmin, navigate]);

    const fetchData = async () => {
        try {
            const [statsRes, usersRes] = await Promise.all([
                adminAPI.getStats(),
                adminAPI.getAllUsers()
            ]);
            setStats(statsRes.data);
            setUsers(usersRes.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError('Failed to load admin data');
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user? This will also delete ALL their flights permanently.')) {
            try {
                await adminAPI.deleteUser(userId);
                // Refresh list
                const usersRes = await adminAPI.getAllUsers();
                const statsRes = await adminAPI.getStats();
                setUsers(usersRes.data);
                setStats(statsRes.data);
            } catch (err) {
                alert('Failed to delete user: ' + (err.response?.data?.message || err.message));
            }
        }
    };

    if (loading) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-vh-100 bg-light">
            <nav className="navbar navbar-dark bg-danger shadow-sm">
                <div className="container">
                    <span className="navbar-brand mb-0 h1">
                        <i className="bi bi-shield-lock me-2"></i>
                        Admin Panel
                    </span>
                    <div className="d-flex">
                        <Link to="/dashboard" className="btn btn-outline-light btn-sm">
                            Back to App
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="container py-4">
                {error && <div className="alert alert-danger">{error}</div>}

                {/* Stats Cards */}
                <div className="row mb-4">
                    <div className="col-md-6 mb-3">
                        <div className="card text-white bg-primary h-100">
                            <div className="card-body">
                                <h5 className="card-title">Total Users</h5>
                                <p className="card-text display-4">{stats.totalUsers}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 mb-3">
                        <div className="card text-white bg-success h-100">
                            <div className="card-body">
                                <h5 className="card-title">Total Flights Recorded</h5>
                                <p className="card-text display-4">{stats.totalFlights}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* User List */}
                <div className="card shadow-sm">
                    <div className="card-header bg-white">
                        <h4 className="mb-0">User Management</h4>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-hover mb-0 align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Joined</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u._id} className={u._id === user._id ? "table-active" : ""}>
                                        <td>
                                            {u.username}
                                            {u._id === user._id && <span className="badge bg-info ms-2">You</span>}
                                        </td>
                                        <td>{u.email}</td>
                                        <td>
                                            <span className={`badge ${u.role === 'admin' ? 'bg-danger' : 'bg-secondary'}`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            {u._id !== user._id && (
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => handleDeleteUser(u._id)}
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
