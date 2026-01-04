import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { flightsAPI } from '../services/api';

const FlightList = () => {
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchFlights();
    }, []);

    const fetchFlights = async () => {
        try {
            const response = await flightsAPI.getAll();
            setFlights(response.data);
        } catch (err) {
            setError('Failed to load flights');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this flight?')) {
            try {
                await flightsAPI.delete(id);
                setFlights(flights.filter(f => f._id !== id));
            } catch (err) {
                alert('Failed to delete flight');
            }
        }
    };

    if (loading) {
        return (
            <div className="container py-5">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-vh-100 bg-light">
            <nav className="navbar navbar-dark bg-primary shadow-sm">
                <div className="container">
                    <Link className="navbar-brand" to="/dashboard">
                        <i className="bi bi-arrow-left me-2"></i>
                        Back to Dashboard
                    </Link>
                </div>
            </nav>

            <div className="container py-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>My Flights</h2>
                    <Link to="/flights/add" className="btn btn-primary">
                        <i className="bi bi-plus-circle me-2"></i>
                        Add Flight
                    </Link>
                </div>

                {error && <div className="alert alert-danger">{error}</div>}

                {flights.length === 0 ? (
                    <div className="text-center py-5">
                        <i className="bi bi-inbox display-1 text-muted"></i>
                        <p className="text-muted mt-3">No flights recorded yet</p>
                        <Link to="/flights/add" className="btn btn-primary">
                            Add Your First Flight
                        </Link>
                    </div>
                ) : (
                    <div className="row g-4">
                        {flights.map((flight) => (
                            <div key={flight._id} className="col-md-6 col-lg-4">
                                <div className="card h-100 shadow-sm">
                                    <div className="card-body">
                                        <h5 className="card-title">
                                            {flight.departure} → {flight.destination}
                                        </h5>
                                        <p className="text-muted mb-2">
                                            <i className="bi bi-building me-2"></i>
                                            {flight.airline} {flight.flightNumber}
                                        </p>
                                        <p className="text-muted mb-2">
                                            <i className="bi bi-calendar me-2"></i>
                                            {new Date(flight.date).toLocaleDateString()}
                                        </p>
                                        <p className="text-muted mb-2">
                                            <i className="bi bi-person-badge me-2"></i>
                                            {flight.seatClass}
                                        </p>
                                        {flight.aircraftReg && (
                                            <p className="text-muted mb-2">
                                                <i className="bi bi-airplane me-2"></i>
                                                {flight.aircraftReg}
                                            </p>
                                        )}
                                        {flight.notes && (
                                            <p className="card-text mt-3">
                                                <small>{flight.notes}</small>
                                            </p>
                                        )}
                                    </div>
                                    <div className="card-footer bg-white border-top-0">
                                        <div className="d-flex gap-2">
                                            <Link
                                                to={`/flights/${flight._id}`}
                                                className="btn btn-sm btn-outline-primary flex-grow-1"
                                            >
                                                View
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(flight._id)}
                                                className="btn btn-sm btn-outline-danger"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FlightList;
