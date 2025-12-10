# SmartRide - Ride-Hailing Application

SmartRide is a modern ride-hailing application built with React, Node.js, and Socket.IO, providing real-time ride tracking and seamless communication between users and captains.

## Features

### Current Features

#### User Features
- User Registration and Authentication
- Real-time Location Tracking
- Ride Booking and Management
- Live Driver Location Updates
- Interactive Map Interface
- Secure Payment Integration
- Ride Status Updates

#### Captain Features
- Captain Registration and Authentication
- Real-time Ride Requests
- Live Navigation
- Ride Accept/Reject Options
- Current Location Broadcasting
- Active Status Management

#### Technical Features
- Real-time Communication using Socket.IO
- JWT Authentication
- Google Maps Integration
- Responsive Design (Mobile & Desktop)
- Secure API Architecture
- Real-time Location Updates

### Upcoming Features

#### Enhanced User Experience
1. **User/Captain Profiles**
   - Detailed profile management
   - Profile picture upload
   - Personal information management
   - Preferred payment methods
   - Saved locations

2. **Captain Ratings & Reviews**
   - Star rating system
   - Written reviews
   - Rating history
   - Captain performance metrics
   - Feedback management

3. **Ride History**
   - Detailed trip history
   - Route replay
   - Receipt generation
   - Past trips analytics
   - Favorite routes

4. **Additional Planned Features**
   - Multiple payment methods
   - Scheduled rides
   - Fare estimation
   - Emergency contact sharing
   - In-app chat system
   - Ride sharing options
   - Premium ride services

## Technical Architecture

### Frontend
- React.js with Vite
- Tailwind CSS for styling
- Socket.IO Client
- Google Maps API
- Context API for state management

### Backend
- Node.js & Express
- MongoDB Database
- Socket.IO for real-time communication
- JWT Authentication
- RESTful API architecture

## Repository Setup & Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm (v8 or higher) or yarn
- Git
- Google Maps API key

### Clone the Repository
```bash
# Clone the repository
git clone https://github.com/nabeel539/uber-clone.git

# Navigate to project directory
cd SmartRide
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file and add necessary environment variables
cp .env.example .env

# Add your Google Maps API key and backend URL to .env
# Example:
# VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
# VITE_BASE_URL=http://localhost:8000

# Start development server
npm run dev
```

### Backend Setup
```bash
# Navigate to backend directory
cd Backend

# Install dependencies
npm install

# Create .env file and add necessary environment variables
cp .env.example .env

# Configure your .env with the following:
# PORT=8000
# MONGODB_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret_key
# GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Start the server
npm start
```

### MongoDB Setup
1. Install MongoDB on your system
2. Create a new database named 'smartride'
3. Configure connection string in Backend/.env

### Additional Setup Steps
1. **Google Maps API Setup**
   - Go to Google Cloud Console
   - Create a new project
   - Enable Maps JavaScript API
   - Enable Directions API
   - Enable Places API
   - Create API credentials
   - Add API key to both frontend and backend .env files

2. **Environment Variables**
   - Set up all required environment variables as shown above
   - Ensure both frontend and backend have proper configurations
   - Make sure MongoDB connection string is correct

3. **Development Tools (Optional)**
   ```bash
   # Install nodemon globally for backend development
   npm install -g nodemon

   # Install useful VS Code extensions
   code --install-extension dbaeumer.vscode-eslint
   code --install-extension esbenp.prettier-vscode
   code --install-extension bradlc.vscode-tailwindcss
   ```

### Running the Application
1. **Start MongoDB**
   ```bash
   # Start MongoDB service
   mongod
   ```

2. **Start Backend Server**
   ```bash
   cd Backend
   npm start
   # Server will start on http://localhost:8000
   ```

3. **Start Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   # Application will be available on http://localhost:5173
   ```

### Troubleshooting
1. **MongoDB Connection Issues**
   - Verify MongoDB is running
   - Check connection string in .env
   - Ensure network connectivity

2. **Frontend Build Issues**
   - Clear node_modules and package-lock.json
   - Run npm install again
   - Check for Node.js version compatibility

3. **API Key Issues**
   - Verify Google Maps API key is correct
   - Check if billing is enabled in Google Cloud Console
   - Ensure API restrictions are properly set

## API Documentation

```
POST /users/register
```

### Request Body

| Field              | Type   | Description                           | Required |
| ------------------ | ------ | ------------------------------------- | -------- |
| fullname.firstname | String | User's first name (min. 3 characters) | Yes      |
| fullname.lastname  | String | User's last name (min. 3 characters)  | No       |
| email              | String | User's email address                  | Yes      |
| password           | String | User's password (min. 6 characters)   | Yes      |

### Example Request

```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "password123"
}
```

### Success Response

- **Status Code**: 201 (Created)
- **Response Body**:

```json
{
  "token": "jwt_token_string",
  "user": {
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com"
  }
}
```

### Error Responses

- **Status Code**: 400 (Bad Request)
  - Invalid email format
  - First name less than 3 characters
  - Password less than 6 characters
  - Missing required fields

### Validation Rules

- Email must be valid
- First name must be at least 3 characters
- Password must be at least 6 characters

## Login User

Endpoint for logging in an existing user.

### Endpoint

```
POST /users/login
```

### Request Body

| Field    | Type   | Description                         | Required |
| -------- | ------ | ----------------------------------- | -------- |
| email    | String | User's email address                | Yes      |
| password | String | User's password (min. 6 characters) | Yes      |

### Example Request

```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

### Success Response

- **Status Code**: 200 (OK)
- **Response Body**:

```json
{
  "token": "jwt_token_string",
  "user": {
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com"
  }
}
```

### Error Responses

- **Status Code**: 400 (Bad Request)
  - Invalid email format
  - Password less than 6 characters
  - Missing required fields
- **Status Code**: 401 (Unauthorized)
  - Invalid email or password

### Validation Rules

- Email must be valid
- Password must be at least 6 characters

## Get User Profile

Endpoint for retrieving the authenticated user's profile.

### Endpoint

```
GET /users/profile
```

### Headers

| Field         | Value              | Description              |
| ------------- | ------------------ | ------------------------ |
| Authorization | Bearer {jwt_token} | JWT authentication token |

### Success Response

- **Status Code**: 200 (OK)
- **Response Body**:

```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com"
}
```

### Error Responses

- **Status Code**: 401 (Unauthorized)
  - Missing authentication token
  - Invalid authentication token
  - Expired token

## Logout User

Endpoint for logging out the current user and invalidating their token.

### Endpoint

```
GET /users/logout
```

### Headers

| Field         | Value              | Description              |
| ------------- | ------------------ | ------------------------ |
| Authorization | Bearer {jwt_token} | JWT authentication token |

### Success Response

- **Status Code**: 200 (OK)
- **Response Body**:

```json
{
  "message": "Logged out successfully"
}
```

### Error Responses

- **Status Code**: 401 (Unauthorized)
  - Missing authentication token
  - Invalid authentication token
  - Expired token

### Notes

- The token will be blacklisted and cannot be used for future requests , both cookie and Authorization header tokens are cleared

### ** Captain Endpoints**

## Register Captain

Create a new captain account with vehicle details.

#### `POST /captains/register`

#### Request Headers

| Field        | Type   | Description      |
| ------------ | ------ | ---------------- |
| Content-Type | String | application/json |

#### Request Body

| Field               | Type   | Required | Description         |
| ------------------- | ------ | -------- | ------------------- |
| fullname.firstname  | String | Yes      | Min 3 chars         |
| fullname.lastname   | String | No       | Min 3 chars         |
| email               | String | Yes      | Valid email         |
| password            | String | Yes      | Min 6 chars         |
| vehicle.color       | String | Yes      | Min 3 chars         |
| vehicle.plate       | String | Yes      | Min 3 chars         |
| vehicle.capacity    | Number | Yes      | Min 1               |
| vehicle.vehicleType | String | Yes      | car/moto/auto |

#### Example Request

```json
{
  "fullname": {
    "firstname": "Jane",
    "lastname": "Doe"
  },
  "email": "jane@example.com",
  "password": "password123",
  "vehicle": {
    "color": "Red",
    "plate": "ABC123",
    "capacity": 4,
    "vehicleType": "car"
  }
}
```

### Success Response

- **Status Code**: 201 (Created)
- **Response Body**:

```json
{
  "captain": {
    "fullname": {
      "firstname": "Jane",
      "lastname": "Doe"
    },
    "email": "jane@example.com",
    "vehicle": {
      "color": "Red",
      "plate": "ABC123",
      "capacity": 4,
      "vehicleType": "car"
    }
  },
  "token": "jwt_token_string"
}
```

### Error Responses

- **Status Code**: 400 (Bad Request)
- **Response Body**:

```json
{
  "message": "Captain already exists"
}
```

### Validation Rules

- Invalid email format
- First name less than 3 characters
- Password less than 6 characters
- Vehicle color less than 3 characters
- Vehicle plate less than 3 characters
- Invalid vehicle type
- Missing required fields

## Login Captain

Authenticate an existing captain account.

#### `POST /captains/login`

### Request Body

| Field    | Type   | Description                            | Required |
| -------- | ------ | -------------------------------------- | -------- |
| email    | String | Captain's email address                | Yes      |
| password | String | Captain's password (min. 6 characters) | Yes      |

```json
{
  "email": "jane@example.com",
  "password": "password123"
}
```

### Success Response

- **Status Code**: 200 (OK)

```json
{
  "captain": {
    "fullname": {
      "firstname": "Jane",
      "lastname": "Doe"
    },
    "email": "jane@example.com",
    "vehicle": {
      "color": "Red",
      "plate": "ABC123",
      "capacity": 4,
      "vehicleType": "car"
    },
    "status": "inactive"
  },
  "token": "jwt_token_string"
}
```

### Error Response

- **Status Code**: 401 (Unauthorized)

```json
{
  "message": "Invalid email or password"
}
```

### Get Captain Profile

Retrieve authenticated captain's profile information.

### Endpoint

#### `GET /captains/profile`

### Request Headers

| Header          | Type   | Description                  | Required |
| --------------- | ------ | ---------------------------- | -------- |
| `Authorization` | string | JWT token for authentication | `true`   |

### Response

- **Status Code**: 200 (OK)

```json
{
  "captain": {
    "fullname": {
      "firstname": "Jane",
      "lastname": "Doe"
    },
    "email": "jane@example.com",
    "vehicle": {
      "color": "Red",
      "plate": "ABC123",
      "capacity": 4,
      "vehicleType": "car"
    },
    "status": "inactive"
  }
}
```

### Error Response

- **Status Code**: 401 (Unauthorized)

```json
{
  "message": "Unauthorized"
}
```

## Logout Captain

Log out the currently authenticated captain.

### Endpoint

#### `GET /captains/logout`

### Headers

| field           | value              | Description |
| --------------- | ------------------ | ----------- |
| `Authorization` | Bearer {jwt_token} | JWT token   |

### Response

- **Status Code**: 200 (OK)

```json
{
  "message": "Logged out successfully"
}
```

### Error Response

- **Status Code**: 401 (Unauthorized)

```json
{
  "message": "Unauthorized"
}
```

### Notes

- Token will be blacklisted after logout
- Both cookie and Authorization header tokens are cleared
- Blacklisted tokens cannot be reused
