# RAG Agent Chat Application

A modern full-stack chat application built with React and Node.js that integrates with external AI services through webhooks to provide intelligent responses. This application features user authentication, persistent chat history, and real-time messaging capabilities.

## 🚀 Features

- **User Authentication**: Secure signup/login system with JWT tokens
- **Real-time Chat Interface**: Interactive chat with message history
- **AI Integration**: Connects to external AI services via webhooks (n8n integration)
- **Persistent Storage**: Chat history saved per user in localStorage and MongoDB
- **Multiple Chat Sessions**: Create, manage, and switch between multiple chat conversations
- **Responsive Design**: Modern UI with TailwindCSS and DaisyUI
- **User Profiles**: Profile management with avatar support via Cloudinary

## 🛠 Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Cloudinary** for image storage
- **bcryptjs** for password hashing

### Frontend
- **React 19** with modern hooks
- **Vite** for build tooling
- **TailwindCSS** + **DaisyUI** for styling
- **React Router** for navigation
- **Zustand** for state management
- **Axios** for HTTP requests
- **React Hot Toast** for notifications
- **Lucide React** for icons

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

## 🔧 Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd "RAG AGENT"
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development

# Cloudinary Configuration (for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

### 4. External AI Service Setup
The application is configured to work with n8n webhooks. Ensure your AI service is running on:
```

```

## 🚀 Running the Application

### Start Backend Server
```bash
cd backend
npm run dev
```
Server will start on `http://localhost:5000`

### Start Frontend Development Server
```bash
cd frontend
npm run dev
```
Frontend will start on `http://localhost:5173`

## 📁 Project Structure

```
RAG AGENT/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── lib/            # Utility libraries (db, socket, cloudinary)
│   │   ├── middleware/     # Authentication middleware
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   └── index.js        # Server entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── store/          # Zustand state management
│   │   ├── lib/            # Utility functions
│   │   ├── constants/      # App constants
│   │   └── App.jsx         # Main App component
│   └── package.json
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/check` - Check authentication status

## 🎯 Key Features Explained

### Chat Interface
- **Multiple Conversations**: Users can create and manage multiple chat sessions
- **Persistent History**: Chat history is saved per user and persists across sessions
- **Real-time Responses**: Messages are processed through external AI services
- **Auto-naming**: New chats are automatically named based on the first message

### User Authentication
- Secure JWT-based authentication
- Password hashing with bcryptjs
- Protected routes and user sessions
- Profile management with avatar upload

### AI Integration
- Webhook integration with external AI services (n8n)
- Flexible response handling for different AI service formats
- Error handling for service unavailability

## 🔧 Configuration

### Webhook Configuration
The application sends user messages to a webhook endpoint and processes the AI responses. Configure your AI service to:
- Accept POST requests at ``
- Process the `message` field from the request body
- Return responses in JSON format with fields like `output`, `response`, `message`, or `answer`

### Environment Variables
Ensure all required environment variables are set in the backend `.env` file for proper functionality.

## 🚀 Deployment

### Backend Deployment
1. Set production environment variables
2. Build and deploy to your preferred platform (Railway, Heroku, etc.)
3. Ensure MongoDB connection is configured for production

### Frontend Deployment
```bash
cd frontend
npm run build
```
Deploy the `dist` folder to your preferred hosting service (Vercel, Netlify, etc.)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🐛 Known Issues

- The application currently expects n8n webhook service on localhost:5678
- Chat history is stored in both localStorage (frontend) and should be synced with backend storage

## 🔮 Future Enhancements

- [ ] Backend chat history synchronization
- [ ] File upload support in chat
- [ ] Chat export functionality
- [ ] Theme customization
- [ ] Mobile app version
- [ ] Voice message support

---

For questions or support, please open an issue in the repository.
