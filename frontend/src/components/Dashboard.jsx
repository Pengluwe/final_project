import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-vh-100 bg-light">
            {/* Navigation Bar */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
                <div className="container">
                    <Link className="navbar-brand" to="/dashboard">
                        <i className="bi bi-airplane-fill me-2"></i>
                        SkyMemories
                    </Link>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <span className="navbar-text text-white me-3">
                                    Welcome, {user?.username}!
                                </span>
                            </li>
                            <li className="nav-item">
                                <button className="btn btn-outline-light" onClick={handleLogout}>
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="container py-5">
                <div className="row mb-4">
                    <div className="col">
                        <h2 className="mb-3">My Flight Dashboard</h2>
                        <p className="text-muted">Track and visualize your flight journey</p>
                    </div>
                </div>

                {/* Action Cards */}
                <div className="row g-4">
                    <div className="col-md-4">
                        <Link to="/flights/map" className="text-decoration-none">
                            <div className="card h-100 shadow-sm hover-shadow">
                                <div className="card-body text-center p-5">
                                    <i className="bi bi-globe display-1 text-primary mb-3"></i>
                                    <h4 className="card-title">Flight Map</h4>
                                    <p className="card-text text-muted">
                                        Visualize your flights on a world map
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </div>

                    <div className="col-md-4">
                        <Link to="/flights/list" className="text-decoration-none">
                            <div className="card h-100 shadow-sm hover-shadow">
                                <div className="card-body text-center p-5">
                                    <i className="bi bi-list-ul display-1 text-success mb-3"></i>
                                    <h4 className="card-title">Flight List</h4>
                                    <p className="card-text text-muted">
                                        View all your flight records
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </div>

                    <div className="col-md-4">
                        <Link to="/flights/add" className="text-decoration-none">
                            <div className="card h-100 shadow-sm hover-shadow">
                                <div className="card-body text-center p-5">
                                    <i className="bi bi-plus-circle display-1 text-warning mb-3"></i>
                                    <h4 className="card-title">Add Flight</h4>
                                    <p className="card-text text-muted">
                                        Record a new flight journey
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
