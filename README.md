
# Speed Service

A comprehensive home service booking application where users can connect with service providers to get assistance with various tasks. This full-featured application includes a robust backend, real-time chat, payment integration, geolocation, and a seamless user interface for a rich booking experience.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Demo](#demo)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **User Registration & Authentication**: Secure signup and login for users and service providers.
- **Real-Time Chat**: In-app messaging between users and employees using Socket.io.
- **Booking Management**: Users can book services, and employees can view and manage their bookings.
- **Geolocation**: Integrates Mapbox for address selection and service area validation.
- **Payment Integration**: Secure payment via PayPal.
- **Admin Dashboard**: Admins can manage users, bookings, and monitor application metrics.

## Tech Stack

### Frontend

- **React** - UI library for building the interface.
- **Redux Toolkit** - For state management.
- **Tailwind CSS** - For styling components.
- **Vite** - Build tool for faster development and optimized builds.
- **Socket.io** - For real-time communication between users and employees.

### Backend

- **Node.js** - JavaScript runtime.
- **Express** - Web application framework for handling routes and API requests.
- **MongoDB** - NoSQL database for storing user, booking, and chat data.
- **AWS EC2 & NGINX** - Hosting and server setup for backend deployment.

### Third-Party Integrations

- **Mapbox** - For geolocation and map features.
- **PayPal API** - For secure payment processing.

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/muhammedfaiz/speed_service.git
   cd speed_service
   ```

2. **Install dependencies**

   - **Frontend**:
     ```bash
     cd client
     npm install
     ```

   - **Backend**:
     ```bash
     cd ../server
     npm install
     ```

3. **Set up environment variables** (See [Environment Variables](#environment-variables) for required variables).

4. **Start the application**

   - **Backend**:
     ```bash
     cd backend
     npm run dev
     ```

   - **Frontend**:
     ```bash
     cd frontend
     npm run dev
     ```

5. Visit `http://localhost:5173` for the frontend and `http://localhost:5000` for the backend.

## Environment Variables

Create a `.env` file in both the `frontend` and `backend` directories with the following variables:

### Backend

- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JSON Web Tokens
- `PAYPAL_CLIENT_ID`: Client ID for PayPal integration
- `SOCKET_PORT`: Port for Socket.io (optional if using default port)

### Frontend

- `REACT_APP_MAPBOX_TOKEN`: Mapbox access token for geolocation features
- `REACT_APP_PAYPAL_CLIENT_ID`: PayPal Client ID for payments

## Usage

- **User**: Register and log in to book services. Use the geolocation feature to pinpoint your address and complete bookings with online payments.
- **Service Provider**: Log in to manage bookings and communicate with users in real time.
- **Admin**: Access a dashboard for overseeing users, bookings, and application metrics.

## Project Structure

```plaintext
speed_service/
│
├── frontend/           # Frontend application with React
│   ├── src/
|   |   ├── utils/      # Utility handlers
|   |   ├── services/   # Api connection handlers
|   |   ├── context/    # Context components
│   │   ├── components/ # Reusable components
│   │   ├── pages/      # Pages for routing
│   │   ├── redux/      # State management
│   │   └── assets/     # Static files
│   └── ...
│
├── backend/            # Backend API with Node.js and Express
|   ├── utils/          # Utility functions
|   ├── socket/         # socket hanlders
|   ├── middlewares/    # Middleware handlers
|   ├── services/       # Logical handlers
│   ├── controllers/    # Request handlers
│   ├── models/         # Mongoose models
│   ├── routes/         # API endpoints
│   └── ...
│
└── README.md
```

## API Endpoints

### User

- **POST** `/api/users/register` - Register a new user
- **POST** `/api/users/login` - Authenticate and login
- **GET** `/api/users/profile` - Get user profile details

### Booking

- **POST** `/api/bookings` - Create a new booking
- **GET** `/api/bookings/:id` - Get booking details
- **PUT** `/api/bookings/:id/status` - Update booking status

### Chat

- **GET** `/api/chat/:bookingId` - Get chat history for a booking
- **POST** `/api/chat` - Send a new message

*For a complete list of routes, please refer to the codebase.*

## Demo

[![Watch the video](https://res.cloudinary.com/dzsu6hf5v/image/upload/v1730175933/Screenshot_2024-09-25_093708_aoybed.png)](https://res.cloudinary.com/dzsu6hf5v/video/upload/v1729523050/project1_f9y4kp.mp4)

## Contributing

1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a pull request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

