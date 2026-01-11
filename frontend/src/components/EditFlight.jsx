import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { flightsAPI, uploadAPI, airportAPI } from '../services/api';

const EditFlight = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [generalError, setGeneralError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [airports, setAirports] = useState([]);

    // Store existing photo URLs separately from new file uploads
    const [existingPhotos, setExistingPhotos] = useState([]);
    const [newPhotos, setNewPhotos] = useState([]);

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

    useEffect(() => {
        const loadData = async () => {
            try {
                // Fetch airports and flight details in parallel
                const [airportsRes, flightRes] = await Promise.all([
                    airportAPI.getAll(),
                    flightsAPI.getById(id)
                ]);

                setAirports(airportsRes.data);
                const flight = flightRes.data;

                // Format date to YYYY-MM-DD
                const formattedDate = flight.date ? new Date(flight.date).toISOString().split('T')[0] : '';

                setFormData({
                    airline: flight.airline || '',
                    flightNumber: flight.flightNumber || '',
                    departure: flight.departure || '',
                    destination: flight.destination || '',
                    date: formattedDate,
                    seatClass: flight.seatClass || 'Economy',
                    notes: flight.notes || '',
                    aircraftReg: flight.aircraftReg || '',
                });
                setExistingPhotos(flight.photos || []);
                setLoading(false);
            } catch (err) {
                setGeneralError('Failed to load data');
                setLoading(false);
            }
        };
        loadData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        if (fieldErrors[name]) {
            setFieldErrors({
                ...fieldErrors,
                [name]: ''
            });
        }
    };

    const handlePhotoChange = (e) => {
        setNewPhotos(Array.from(e.target.files));
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.airline.trim()) errors.airline = '請輸入航空公司名稱';
        if (!formData.flightNumber.trim()) errors.flightNumber = '請輸入航班號碼';

        if (!formData.departure) {
            errors.departure = '請選擇出發地';
        }

        if (!formData.destination) {
            errors.destination = '請選擇目的地';
        }

        if (formData.departure && formData.destination && formData.departure === formData.destination) {
            errors.destination = '出發地與目的地不能相同';
        }

        if (!formData.date) errors.date = '請選擇飛行日期';
        if (!formData.seatClass) errors.seatClass = '請選擇艙等';
        if (!formData.notes.trim()) errors.notes = '請輸入飛行心得與筆記';

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setSaving(true);
        setGeneralError('');

        try {
            // Upload new photos first
            const newPhotoUrls = [];
            for (const photo of newPhotos) {
                const formDataPhoto = new FormData();
                formDataPhoto.append('file', photo);
                const uploadResponse = await uploadAPI.uploadPhoto(formDataPhoto);
                newPhotoUrls.push(uploadResponse.data.imageUrl);
            }

            // Combine existing photos with new ones
            const flightData = {
                ...formData,
                photos: [...existingPhotos, ...newPhotoUrls],
            };

            await flightsAPI.update(id, flightData);
            navigate('/flights/list');
        } catch (err) {
            setGeneralError(err.response?.data?.message || 'Failed to update flight');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;
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
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="card shadow">
                            <div className="card-body p-4">
                                <h3 className="card-title mb-4">Edit Flight</h3>

                                {generalError && (
                                    <div className="alert alert-danger" role="alert">
                                        {generalError}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} noValidate>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="airline" className="form-label">Airline *</label>
                                            <input
                                                type="text"
                                                className={`form-control ${fieldErrors.airline ? 'is-invalid' : ''}`}
                                                id="airline"
                                                name="airline"
                                                value={formData.airline}
                                                onChange={handleChange}
                                            />
                                            {fieldErrors.airline && <div className="invalid-feedback">{fieldErrors.airline}</div>}
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="flightNumber" className="form-label">Flight Number *</label>
                                            <input
                                                type="text"
                                                className={`form-control ${fieldErrors.flightNumber ? 'is-invalid' : ''}`}
                                                id="flightNumber"
                                                name="flightNumber"
                                                value={formData.flightNumber}
                                                onChange={handleChange}
                                            />
                                            {fieldErrors.flightNumber && <div className="invalid-feedback">{fieldErrors.flightNumber}</div>}
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="departure" className="form-label">Departure (Airport) *</label>
                                            <select
                                                className={`form-select ${fieldErrors.departure ? 'is-invalid' : ''}`}
                                                id="departure"
                                                name="departure"
                                                value={formData.departure}
                                                onChange={handleChange}
                                            >
                                                <option value="">Select Departure Airport</option>
                                                {airports.map(airport => (
                                                    <option key={airport._id} value={airport.code}>
                                                        {airport.code} - {airport.city} ({airport.name})
                                                    </option>
                                                ))}
                                            </select>
                                            {fieldErrors.departure && <div className="invalid-feedback">{fieldErrors.departure}</div>}
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="destination" className="form-label">Destination (Airport) *</label>
                                            <select
                                                className={`form-select ${fieldErrors.destination ? 'is-invalid' : ''}`}
                                                id="destination"
                                                name="destination"
                                                value={formData.destination}
                                                onChange={handleChange}
                                            >
                                                <option value="">Select Destination Airport</option>
                                                {airports.map(airport => (
                                                    <option key={airport._id} value={airport.code}>
                                                        {airport.code} - {airport.city} ({airport.name})
                                                    </option>
                                                ))}
                                            </select>
                                            {fieldErrors.destination && <div className="invalid-feedback">{fieldErrors.destination}</div>}
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="date" className="form-label">Flight Date *</label>
                                            <input
                                                type="date"
                                                className={`form-control ${fieldErrors.date ? 'is-invalid' : ''}`}
                                                id="date"
                                                name="date"
                                                value={formData.date}
                                                onChange={handleChange}
                                            />
                                            {fieldErrors.date && <div className="invalid-feedback">{fieldErrors.date}</div>}
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="seatClass" className="form-label">Seat Class *</label>
                                            <select
                                                className={`form-select ${fieldErrors.seatClass ? 'is-invalid' : ''}`}
                                                id="seatClass"
                                                name="seatClass"
                                                value={formData.seatClass}
                                                onChange={handleChange}
                                            >
                                                <option value="Economy">Economy</option>
                                                <option value="Premium Economy">Premium Economy</option>
                                                <option value="Business">Business</option>
                                                <option value="First">First</option>
                                            </select>
                                            {fieldErrors.seatClass && <div className="invalid-feedback">{fieldErrors.seatClass}</div>}
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
                                        <label htmlFor="notes" className="form-label">Notes *</label>
                                        <textarea
                                            className={`form-control ${fieldErrors.notes ? 'is-invalid' : ''}`}
                                            id="notes"
                                            name="notes"
                                            rows="3"
                                            value={formData.notes}
                                            onChange={handleChange}
                                        ></textarea>
                                        {fieldErrors.notes && <div className="invalid-feedback">{fieldErrors.notes}</div>}
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label">Current Photos</label>
                                        <div className="d-flex flex-wrap gap-2 mb-2">
                                            {existingPhotos.map((url, index) => (
                                                <img key={index} src={url} alt={`Flight ${index}`} style={{ width: '100px', height: '100px', objectFit: 'cover' }} className="img-thumbnail" />
                                            ))}
                                            {existingPhotos.length === 0 && <p className="text-muted">No photos uploaded</p>}
                                        </div>

                                        <label htmlFor="photos" className="form-label">Add New Photos</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            id="photos"
                                            accept="image/*"
                                            multiple
                                            onChange={handlePhotoChange}
                                        />
                                    </div>

                                    <div className="d-flex gap-2">
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={saving}
                                        >
                                            {saving ? 'Saving...' : 'Update Flight'}
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

export default EditFlight;
