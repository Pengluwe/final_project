# SkyMemories API Specification

## Base URL
`http://localhost:5001`

## Authentication

### Register User
Register a new user account.

- **Endpoint**: `POST /api/auth/register`
- **Body**:
  ```json
  {
    "username": "traveler1",
    "email": "user@example.com",
    "password": "securepassword"
  }
  ```
- **Response**: `201 Created`
  ```json
  {
    "token": "jwt_token_string",
    "user": {
      "id": "user_id",
      "username": "traveler1",
      "email": "user@example.com"
    }
  }
  ```

### Login User
Authenticate a user and return a token.

- **Endpoint**: `POST /api/auth/login`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword"
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "token": "jwt_token_string",
    "user": {
      "id": "user_id",
      "username": "traveler1",
      "email": "user@example.com"
    }
  }
  ```

## Flights

### Get All Flights
Retrieve all flight records for the authenticated user.

- **Endpoint**: `GET /api/flights`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `200 OK`
  ```json
  [
    {
      "_id": "flight_id",
      "airline": "EVA Air",
      "flightNumber": "BR87",
      "departure": "TPE",
      "destination": "CDG",
      "date": "2023-10-15",
      "seatClass": "Economy",
      "notes": "Great service!",
      "photos": ["url1.jpg", "url2.jpg"],
      "aircraftReg": "B-16722"
    }
  ]
  ```

### Add New Flight
Create a new flight record.

- **Endpoint**: `POST /api/flights`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "airline": "EVA Air",
    "flightNumber": "BR87",
    "departure": "TPE",
    "destination": "CDG",
    "date": "2023-10-15",
    "seatClass": "Economy",
    "notes": "Great service!",
    "photos": [],
    "aircraftReg": "B-16722"
  }
  ```
- **Response**: `201 Created`

### Get Flight Details
Retrieve a specific flight record.

- **Endpoint**: `GET /api/flights/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `200 OK`

### Update Flight
Update an existing flight record.

- **Endpoint**: `PUT /api/flights/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: (Fields to update)
- **Response**: `200 OK`

### Delete Flight
Delete a flight record.

- **Endpoint**: `DELETE /api/flights/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `200 OK`

## Uploads

### Upload Photo
Upload an image file.

- **Endpoint**: `POST /api/upload`
- **Headers**: `Authorization: Bearer <token>`, `Content-Type: multipart/form-data`
- **Body**: `file` (form-data)
- **Response**: `201 Created`
  ```json
  {
    "imageUrl": "/uploads/filename.jpg"
  }
  ```
