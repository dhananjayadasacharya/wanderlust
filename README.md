# Wanderlust - Travel Browsing Platform

A comprehensive travel booking platform built with Node.js, Express, and MongoDB, featuring AI-powered search capabilities.

## Features

### Core Functionality
- **Property Listings**: Browse and view detailed property listings
- **User Authentication**: Secure login/signup system using Passport.js
- **Reviews & Ratings**: Add and view reviews for properties
- **Interactive Maps**: Integrated Mapbox for property locations
- **Image Upload**: Cloudinary integration for image storage

### AI-Powered Search (New!)
- **Smart Search**: Google Generative AI-powered search that understands natural language queries
- **Intelligent Filtering**: AI analyzes user descriptions to find relevant properties
- **Fallback Search**: Automatic keyword-based search if AI is unavailable
- **Responsive Design**: Works seamlessly on mobile and desktop

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Passport.js with Local Strategy
- **AI Integration**: Google Generative AI (Gemini-1.5-flash)
- **Image Storage**: Cloudinary
- **Maps**: Mapbox SDK
- **Frontend**: EJS templating, Bootstrap 5, vanilla JavaScript
- **Session Management**: express-session with MongoDB store

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# MongoDB Connection
ATLAS_URL=your_mongodb_connection_string

# Cloudinary Configuration
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret

# Session Secret
SECRET=your_session_secret

# Google Generative AI
GEMINI_API_KEY=your_gemini_api_key

# Environment
NODE_ENV=development
```

## Installation & Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables in `.env` file
4. Run the application: `node app.js`
5. Visit `http://localhost:8080` in your browser

## API Endpoints

### Chatbot/Search
- `POST /chatbot/search` - AI-powered property search
- `GET /chatbot/test` - Test endpoint for API health check

### Listings
- `GET /listings` - View all properties
- `GET /listings/:id` - View specific property
- `POST /listings` - Create new listing (authenticated)
- `PUT /listings/:id` - Update listing (owner only)
- `DELETE /listings/:id` - Delete listing (owner only)

### Authentication
- `GET /signup` - Registration page
- `POST /signup` - Register new user
- `GET /login` - Login page
- `POST /login` - Authenticate user
- `GET /logout` - Logout user

## Recent Updates

### Version 2.0 Features
- **AI Search Integration**: Added Google Generative AI for intelligent property search
- **Mobile Optimization**: Improved responsive design for mobile devices
- **Enhanced UI**: Better search interface with loading states and result feedback
- **Performance Improvements**: Optimized image loading and search performance

## Project Structure

```
├── app.js              # Main application file
├── middleware.js       # Custom middleware functions
├── controllers/        # Route controllers
│   ├── chatbot.js     # AI search controller
│   ├── listings.js    # Property listing controller
│   ├── reviews.js     # Review management
│   └── users.js       # User authentication
├── models/            # Database models
│   ├── listing.js     # Property model
│   ├── review.js      # Review model
│   └── user.js        # User model
├── routes/            # Route definitions
├── public/            # Static assets (CSS, JS, images)
├── views/             # EJS templates
└── utils/             # Utility functions
```

