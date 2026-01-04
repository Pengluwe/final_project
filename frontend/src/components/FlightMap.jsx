import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Link } from 'react-router-dom';
import { flightsAPI } from '../services/api';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Airport coordinates (simplified - in production, use a proper airport database)
const airportCoordinates = {
    TPE: [25.0797, 121.2342],
    NRT: [35.7647, 140.3864],
    CDG: [49.0097, 2.5479],
    LAX: [33.9416, -118.4085],
    JFK: [40.6413, -73.7781],
    LHR: [51.4700, -0.4543],
    SIN: [1.3644, 103.9915],
    HKG: [22.3080, 113.9185],
    ICN: [37.4602, 126.4407],
    SFO: [37.6213, -122.3790],
};

const FlightMap = () => {
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFlights();
    }, []);

    const fetchFlights = async () => {
        try {
            const response = await flightsAPI.getAll();
            setFlights(response.data);
        } catch (err) {
            console.error('Failed to load flights', err);
        } finally {
            setLoading(false);
        }
    };

    const getFlightPaths = () => {
        return flights
            .filter(flight =>
                airportCoordinates[flight.departure] &&
                airportCoordinates[flight.destination]
            )
            .map(flight => ({
                positions: [
                    airportCoordinates[flight.departure],
                    airportCoordinates[flight.destination],
                ],
                flight,
            }));
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

            <div className="container-fluid p-4">
                <h2 className="mb-4">Flight Map</h2>

                {flights.length === 0 ? (
                    <div className="text-center py-5">
                        <p className="text-muted">No flights to display on map</p>
                        <Link to="/flights/add" className="btn btn-primary">
                            Add Your First Flight
                        </Link>
                    </div>
                ) : (
                    <div style={{ height: '70vh', borderRadius: '8px', overflow: 'hidden' }}>
                        <MapContainer
                            center={[25, 0]}
                            zoom={2}
                            style={{ height: '100%', width: '100%' }}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />

                            {/* Draw flight paths */}
                            {getFlightPaths().map((path, index) => (
                                <Polyline
                                    key={index}
                                    positions={path.positions}
                                    color="blue"
                                    weight={2}
                                    opacity={0.6}
                                />
                            ))}

                            {/* Add markers for airports */}
                            {flights.map((flight, index) => {
                                const depCoords = airportCoordinates[flight.departure];
                                const destCoords = airportCoordinates[flight.destination];

                                return (
                                    <div key={index}>
                                        {depCoords && (
                                            <Marker position={depCoords}>
                                                <Popup>
                                                    <strong>{flight.departure}</strong><br />
                                                    Departure
                                                </Popup>
                                            </Marker>
                                        )}
                                        {destCoords && (
                                            <Marker position={destCoords}>
                                                <Popup>
                                                    <strong>{flight.destination}</strong><br />
                                                    Destination
                                                </Popup>
                                            </Marker>
                                        )}
                                    </div>
                                );
                            })}
                        </MapContainer>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FlightMap;
