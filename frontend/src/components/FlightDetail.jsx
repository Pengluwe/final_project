import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { flightsAPI } from '../services/api';

const FlightDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [flight, setFlight] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchFlight();
    }, [id]);

    const fetchFlight = async () => {
        try {
            const response = await flightsAPI.getById(id);
            setFlight(response.data);
        } catch (err) {
            setError('Failed to load flight details');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this flight?')) {
            try {
                await flightsAPI.delete(id);
                navigate('/flights/list');
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

    if (error || !flight) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger">{error || 'Flight not found'}</div>
                <Link to="/flights/list" className="btn btn-primary">Back to List</Link>
            </div>
        );
    }

    return (
        <div className="min-vh-100 bg-light">
            <nav className="navbar navbar-dark bg-primary shadow-sm">
                <div className="container">
                    <Link className="navbar-brand" to="/flights/list">
                        <i className="bi bi-arrow-left me-2"></i>
                        Back to List
                    </Link>
                </div>
            </nav>

            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="card shadow">
                            <div className="card-header bg-primary text-white">
                                <h3 className="mb-0">
                                    {flight.departure} → {flight.destination}
                                </h3>
                            </div>
                            <div className="card-body p-4">
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <h6 className="text-muted">Airline</h6>
                                        <p className="fs-5">{flight.airline}</p>
                                    </div>
                                    <div className="col-md-6">
                                        <h6 className="text-muted">Flight Number</h6>
                                        <p className="fs-5">{flight.flightNumber}</p>
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <h6 className="text-muted">Date</h6>
                                        <p className="fs-5">{new Date(flight.date).toLocaleDateString()}</p>
                                    </div>
                                    <div className="col-md-6">
                                        <h6 className="text-muted">Seat Class</h6>
                                        <p className="fs-5">{flight.seatClass}</p>
                                    </div>
                                </div>

                                {flight.aircraftReg && (
                                    <div className="mb-3">
                                        <h6 className="text-muted">Aircraft Registration</h6>
                                        <p className="fs-5">{flight.aircraftReg}</p>
                                    </div>
                                )}

                                {flight.notes && (
                                    <div className="mb-3">
                                        <h6 className="text-muted">Notes</h6>
                                        <p>{flight.notes}</p>
                                    </div>
                                )}

                                {flight.photos && flight.photos.length > 0 && (
                                    <div className="mb-3">
                                        <h6 className="text-muted">Photos</h6>
                                        <div className="row g-3">
                                            {flight.photos.map((photo, index) => (
                                                <div key={index} className="col-md-4">
                                                    <img
                                                        src={`http://localhost:5001${photo}`}
                                                        alt={`Flight photo ${index + 1}`}
                                                        className="img-fluid rounded shadow-sm"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="d-flex gap-2 mt-4">
                                    <button onClick={handleDelete} className="btn btn-danger">
                                        <i className="bi bi-trash me-2"></i>
                                        Delete Flight
                                    </button>
                                    <Link to="/flights/list" className="btn btn-secondary">
                                        Back to List
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlightDetail;
