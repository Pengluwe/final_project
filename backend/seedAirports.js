require('dotenv').config();
const mongoose = require('mongoose');
const Airport = require('./models/Airport');

// Extensive Airport List
const airports = [
    { code: "TPE", name: "Taiwan Taoyuan International Airport", city: "Taipei", country: "Taiwan", coordinates: { lat: 25.0797, lng: 121.2342 } },
    { code: "TSA", name: "Taipei Songshan Airport", city: "Taipei", country: "Taiwan", coordinates: { lat: 25.0697, lng: 121.5514 } },
    { code: "KHH", name: "Kaohsiung International Airport", city: "Kaohsiung", country: "Taiwan", coordinates: { lat: 22.5768, lng: 120.3508 } },
    { code: "NRT", name: "Narita International Airport", city: "Tokyo", country: "Japan", coordinates: { lat: 35.7647, lng: 140.3864 } },
    { code: "HND", name: "Haneda Airport", city: "Tokyo", country: "Japan", coordinates: { lat: 35.5494, lng: 139.7798 } },
    { code: "KIX", name: "Kansai International Airport", city: "Osaka", country: "Japan", coordinates: { lat: 34.4320, lng: 135.2304 } },
    { code: "ICN", name: "Incheon International Airport", city: "Seoul", country: "South Korea", coordinates: { lat: 37.4602, lng: 126.4407 } },
    { code: "GMP", name: "Gimpo International Airport", city: "Seoul", country: "South Korea", coordinates: { lat: 37.5583, lng: 126.7906 } },
    { code: "HKG", name: "Hong Kong International Airport", city: "Hong Kong", country: "Hong Kong", coordinates: { lat: 22.3080, lng: 113.9185 } },
    { code: "SIN", name: "Singapore Changi Airport", city: "Singapore", country: "Singapore", coordinates: { lat: 1.3644, lng: 103.9915 } },
    { code: "BKK", name: "Suvarnabhumi Airport", city: "Bangkok", country: "Thailand", coordinates: { lat: 13.6900, lng: 100.7501 } },
    { code: "DMK", name: "Don Mueang International Airport", city: "Bangkok", country: "Thailand", coordinates: { lat: 13.9126, lng: 100.6067 } },
    { code: "MNL", name: "Ninoy Aquino International Airport", city: "Manila", country: "Philippines", coordinates: { lat: 14.5086, lng: 121.0194 } },
    { code: "SGN", name: "Tan Son Nhat International Airport", city: "Ho Chi Minh City", country: "Vietnam", coordinates: { lat: 10.8185, lng: 106.6588 } },
    { code: "KUL", name: "Kuala Lumpur International Airport", city: "Kuala Lumpur", country: "Malaysia", coordinates: { lat: 2.7456, lng: 101.7099 } },
    { code: "LHR", name: "Heathrow Airport", city: "London", country: "UK", coordinates: { lat: 51.4700, lng: -0.4543 } },
    { code: "LGW", name: "Gatwick Airport", city: "London", country: "UK", coordinates: { lat: 51.1537, lng: -0.1821 } },
    { code: "CDG", name: "Charles de Gaulle Airport", city: "Paris", country: "France", coordinates: { lat: 49.0097, lng: 2.5479 } },
    { code: "FRA", name: "Frankfurt Airport", city: "Frankfurt", country: "Germany", coordinates: { lat: 50.0379, lng: 8.5622 } },
    { code: "AMS", name: "Amsterdam Airport Schiphol", city: "Amsterdam", country: "Netherlands", coordinates: { lat: 52.3105, lng: 4.7683 } },
    { code: "DXB", name: "Dubai International Airport", city: "Dubai", country: "UAE", coordinates: { lat: 25.2532, lng: 55.3657 } },
    { code: "JFK", name: "John F. Kennedy International Airport", city: "New York", country: "USA", coordinates: { lat: 40.6413, lng: -73.7781 } },
    { code: "EWR", name: "Newark Liberty International Airport", city: "New York", country: "USA", coordinates: { lat: 40.6895, lng: -74.1745 } },
    { code: "LAX", name: "Los Angeles International Airport", city: "Los Angeles", country: "USA", coordinates: { lat: 33.9416, lng: -118.4085 } },
    { code: "SFO", name: "San Francisco International Airport", city: "San Francisco", country: "USA", coordinates: { lat: 37.6213, lng: -122.3790 } },
    { code: "ORD", name: "O'Hare International Airport", city: "Chicago", country: "USA", coordinates: { lat: 41.9742, lng: -87.9073 } },
    { code: "YYZ", name: "Toronto Pearson International Airport", city: "Toronto", country: "Canada", coordinates: { lat: 43.6777, lng: -79.6248 } },
    { code: "YVR", name: "Vancouver International Airport", city: "Vancouver", country: "Canada", coordinates: { lat: 49.1947, lng: -123.1762 } },
    { code: "SYD", name: "Sydney Kingsford Smith Airport", city: "Sydney", country: "Australia", coordinates: { lat: -33.9399, lng: 151.1753 } },
    { code: "MEL", name: "Melbourne Airport", city: "Melbourne", country: "Australia", coordinates: { lat: -37.6690, lng: 144.8410 } }
];

const seedAirports = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skymemories');
        console.log('Connected to MongoDB');

        // Clear existing airports (optional, but good for idempotent runs)
        await Airport.deleteMany({});
        console.log('Cleared existing airports');

        // Insert new airports
        await Airport.insertMany(airports);
        console.log(`Successfully seeded ${airports.length} airports`);

        process.exit(0);
    } catch (error) {
        console.error('Error seeding airports:', error);
        process.exit(1);
    }
};

seedAirports();
