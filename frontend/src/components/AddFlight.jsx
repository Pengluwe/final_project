import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { flightsAPI, uploadAPI } from '../services/api';

const AddFlight = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        airline: '',
        flightNumber: '',
        departure: '',
        destination: '',
        date: '',
        seatClass: 'Economy',
        notes: '',
        aircraftReg: '',
    });
    const [photos, setPhotos] = useState([]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handlePhotoChange = (e) => {
        setPhotos(Array.from(e.target.files));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Upload photos first
            const photoUrls = [];
            for (const photo of photos) {
                const formDataPhoto = new FormData();
                formDataPhoto.append('file', photo);
                const uploadResponse = await uploadAPI.uploadPhoto(formDataPhoto);
                photoUrls.push(uploadResponse.data.imageUrl);
            }

            // Create flight record
            const flightData = {
                ...formData,
                photos: photoUrls,
            };

            await flightsAPI.create(flightData);
            navigate('/flights/list');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add flight');
        } finally {
            setLoading(false);
        }
    };

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
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="card shadow">
                            <div className="card-body p-4">
                                <h3 className="card-title mb-4">Add New Flight</h3>

                                {error && (
                                    <div className="alert alert-danger" role="alert">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="airline" className="form-label">Airline *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="airline"
                                                name="airline"
                                                value={formData.airline}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="flightNumber" className="form-label">Flight Number *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="flightNumber"
                                                name="flightNumber"
                                                value={formData.flightNumber}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="departure" className="form-label">Departure (IATA Code) *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="departure"
                                                name="departure"
                                                placeholder="e.g., TPE"
                                                value={formData.departure}
                                                onChange={handleChange}
                                                maxLength="3"
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="destination" className="form-label">Destination (IATA Code) *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="destination"
                                                name="destination"
                                                placeholder="e.g., NRT"
                                                value={formData.destination}
                                                onChange={handleChange}
                                                maxLength="3"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="date" className="form-label">Flight Date *</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                id="date"
                                                name="date"
                                                value={formData.date}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="seatClass" className="form-label">Seat Class *</label>
                                            <select
                                                className="form-select"
                                                id="seatClass"
                                                name="seatClass"
                                                value={formData.seatClass}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="Economy">Economy</option>
                                                <option value="Premium Economy">Premium Economy</option>
                                                <option value="Business">Business</option>
                                                <option value="First">First</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="aircraftReg" className="form-label">Aircraft Registration</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="aircraftReg"
                                            name="aircraftReg"
                                            placeholder="e.g., B-16722"
                                            value={formData.aircraftReg}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="notes" className="form-label">Notes</label>
                                        <textarea
                                            className="form-control"
                                            id="notes"
                                            name="notes"
                                            rows="3"
                                            value={formData.notes}
                                            onChange={handleChange}
                                            placeholder="Share your flight experience..."
                                        ></textarea>
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="photos" className="form-label">Photos</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            id="photos"
                                            accept="image/*"
                                            multiple
                                            onChange={handlePhotoChange}
                                        />
                                        <small className="text-muted">You can select multiple photos</small>
                                    </div>

                                    <div className="d-flex gap-2">
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={loading}
                                        >
                                            {loading ? 'Saving...' : 'Add Flight'}
                                        </button>
                                        <Link to="/flights/list" className="btn btn-secondary">
                                            Cancel
                                        </Link>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddFlight;
