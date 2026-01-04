# System Flowchart - SkyMemories

This document outlines the user interaction flows within the SkyMemories application.

## User Journey

```mermaid
flowchart TD
    Start((Start)) --> LandingPage[Landing Page]
    LandingPage -->|Has Account?| Login[Login Page]
    LandingPage -->|No Account?| Register[Register Page]
    
    Register -->|Success| Dashboard[User Dashboard]
    Login -->|Success| Dashboard
    
    Dashboard --> ViewMap[View Flight Map]
    Dashboard --> ViewList[View Flight List]
    Dashboard --> AddFlight[Add New Flight]
    
    AddFlight -->|Input Details & Photos| SaveFlight{Validate & Save}
    SaveFlight -->|Success| Dashboard
    SaveFlight -->|Error| AddFlight
    
    ViewList -->|Select Flight| FlightDetail[Flight Detail View]
    FlightDetail --> EditFlight[Edit Flight]
    FlightDetail --> DeleteFlight[Delete Flight]
    
    EditFlight -->|Update| SaveFlight
    DeleteFlight -->|Confirm| Dashboard
    
    Dashboard --> Logout[Logout]
    Logout --> LandingPage
```

## Data Flow (Add Flight)

1. **User** fills out the flight form (Airline, Date, Route, etc.) and selects photos.
2. **Frontend** sends a `POST /api/upload` request for each photo to get server paths.
3. **Frontend** collects form data + photo paths and sends `POST /api/flights`.
4. **Backend** validates the token and data.
5. **Backend** saves the record to **MongoDB**.
6. **Backend** returns the created object to **Frontend**.
7. **Frontend** updates the state/UI to show the new flight.
