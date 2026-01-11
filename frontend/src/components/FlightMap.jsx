import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Link } from 'react-router-dom';
import { flightsAPI, airportAPI } from '../services/api';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const FlightMap = () => {
    const [flights, setFlights] = useState([]);
    const [airportCoords, setAirportCoords] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Fetch all flights
                const flightRes = await flightsAPI.getAll();
                const flightData = flightRes.data;
                setFlights(flightData);

                if (flightData.length > 0) {
                    // 2. Extract unique airport codes
                    const codes = new Set();
                    flightData.forEach(f => {
                        codes.add(f.departure);
                        codes.add(f.destination);
                    });

                    // 3. Fetch coordinates for these airports
                    const airportRes = await airportAPI.getBatch(Array.from(codes));

                    // 4. Map airport data to efficient lookup object
                    const coordsMap = {};
                    airportRes.data.forEach(airport => {
                        coordsMap[airport.code] = [airport.coordinates.lat, airport.coordinates.lng];
                    });
                    setAirportCoords(coordsMap);
                }
            } catch (err) {
                console.error('Failed to load map data', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getFlightPaths = () => {
        return flights
            .filter(flight =>
                airportCoords[flight.departure] &&
                airportCoords[flight.destination]
            )
            .map(flight => ({
                positions: [
                    airportCoords[flight.departure],
                    airportCoords[flight.destination],
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
                <h2 className="mb-4 text-white text-shadow">Flight Map</h2>

                {flights.length === 0 ? (
                    <div className="text-center py-5">
                        <p className="text-white text-shadow">No flights to display on map</p>
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
                                const depCoords = airportCoords[flight.departure];
                                const destCoords = airportCoords[flight.destination];

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
