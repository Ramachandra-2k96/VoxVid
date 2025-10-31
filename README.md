# VoxVid - AI-Powered Script-to-Avatar Video Generation

VoxVid is a full-stack application that transforms text scripts into professional videos using AI voices and avatars. The platform allows users to create engaging video content instantly without cameras, studios, or editing skills.

## 🚀 Live Demo

**Repository**: [https://github.com/Ramachandra-2k96/VoxVid](https://github.com/Ramachandra-2k96/VoxVid)

## 📁 Project Structure

```
VoxVid/
├── Backend/                 # Django REST API
│   ├── api/                # Main API app
│   │   ├── models.py       # Database models
│   │   ├── views.py        # API endpoints
│   │   ├── serializers.py  # Data serialization
│   │   └── urls.py         # API routing
│   ├── backend/            # Django project settings
│   │   ├── settings.py     # Configuration
│   │   └── urls.py         # Main URL routing
│   ├── requirements.txt    # Python dependencies
│   ├── manage.py          # Django management
│   └── .env               # Environment variables
│
└── frontend/               # Next.js React app
    ├── app/               # App router pages
    │   ├── layout.tsx     # Root layout
    │   ├── page.tsx       # Home page
    │   ├── login/         # Authentication pages
    │   └── home/          # Dashboard
    ├── components/        # Reusable UI components
    ├── lib/              # Utility functions
    ├── package.json      # Node.js dependencies
    └── .env              # Environment variables
```

## 🛠️ Technology Stack

### Backend
- **Django 5.2+** - Web framework
- **Django REST Framework** - API development
- **JWT Authentication** - Secure user authentication
- **SQLite/PostgreSQL** - Database (SQLite for development, PostgreSQL for production)
- **Google Cloud Storage** - File storage for images and videos
- **D-ID API** - AI video generation service
- **Cerebras API** - AI script enhancement
- **CORS Headers** - Cross-origin resource sharing

### Frontend
- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Radix UI** - Component library
- **React Hook Form** - Form handling
- **Zod** - Schema validation

## 🚀 Quick Start

### Prerequisites

- **Python 3.8+**
- **Node.js 18+**
- **pnpm**
- **Google Cloud Platform Account** (for file storage)

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ramachandra-2k96/VoxVid.git
   cd VoxVid
   ```

2. **Navigate to Backend directory**
   ```bash
   cd Backend
   ```

3. **Create virtual environment**
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

4. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

5. **Set up environment variables**
   
   Create or update `Backend/.env`:
   ```env
   DDI_API_KEY=your_d_id_api_key_here
   CEREBRUS_API_KEY=your_cerebrus_api_key_here
   SECRET_KEY=your_django_secret_key
   DEBUG=True
   FRONTEND_URL=http://localhost:3000
   
   # Database (optional - defaults to SQLite)
   # DATABASE_URL=postgresql://user:password@host:port/database
   
   # Google Cloud Storage (Required for file uploads)
   GCP_SERVICE_ACCOUNT_FILE=/path/to/Backend/your-service-account-file.json
   GCP_BUCKET_NAME=your-unique-bucket-name

   Brevo_API_Key=xkeysib-20a05ffb4731aHFWjy94Tln82THsX(Update it)
   Brevo_API_Email=ramachandraudupa2004@gmail.com(Add )
   ```

6. **Run database migrations**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

7. **Start the development server**
   ```bash
   python manage.py runserver
   ```

   Backend will be available at: `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   
   Create or update `frontend/.env`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

4. **Start the development server**
   ```bash
   pnpm dev
   ```

   Frontend will be available at: `http://localhost:3000`

## 🔧 Environment Variables

### Backend (.env)
```env
# Required
DDI_API_KEY=your_d_id_api_key_here
CEREBRUS_API_KEY=your_cerebrus_api_key_here

# Google Cloud Storage (Required for file uploads)
GCP_SERVICE_ACCOUNT_FILE=/absolute/path/to/Backend/your-service-account-file.json
GCP_BUCKET_NAME=your-unique-bucket-name

# Database (Optional - defaults to SQLite)
# DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require

# Optional
FRONTEND_URL=http://localhost:3000
SECRET_KEY=your_django_secret_key
DEBUG=True
```

### Frontend (.env)
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/token/` - Get JWT tokens
- `POST /api/auth/token/refresh/` - Refresh JWT token
- `GET /api/auth/me/` - Get current user info

### Video Generation
- `GET /api/videos/` - List user's videos
- `POST /api/videos/create/` - Create new video
- `GET /api/videos/{id}/` - Get specific video
- `POST /api/videos/{id}/update/` - Update video status

### AI Enhancement
- `POST /api/ai/enhance-script/` - Enhance script using AI

## 🎯 Key Features

- **AI Video Generation**: Convert text scripts to professional videos
- **Avatar Selection**: Choose from various AI avatars
- **Voice Synthesis**: Multiple voice options for narration
- **Cloud File Storage**: Secure storage of images and videos on Google Cloud
- **Script Enhancement**: AI-powered script improvement using Cerebras API
- **User Authentication**: Secure JWT-based authentication
- **Video Management**: Track and manage generated videos
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Status**: Track video generation progress

## 🔑 D-ID API Integration

This project integrates with D-ID's API for AI video generation. You'll need:

1. **D-ID Account**: Sign up at [D-ID](https://www.d-id.com/)
2. **API Key**: Get your API key from the D-ID dashboard
3. **Add to Environment**: Set `DDI_API_KEY` in your backend `.env` file

## ☁️ Google Cloud Storage Setup

VoxVid uses Google Cloud Storage for storing uploaded images and generated videos.

### Prerequisites
1. **GCP Account**: Create one at [https://console.cloud.google.com/](https://console.cloud.google.com/)
2. **Billing Enabled**: Enable billing on your GCP project (free tier available)
3. **Project Created**: Create a new project or select an existing one

### Setup Steps

1. **Enable Cloud Storage API**
   - Navigate to APIs & Services > Library
   - Search for "Cloud Storage API"
   - Click Enable

2. **Create Service Account**
   - Go to IAM & Admin > Service Accounts
   - Click "Create Service Account"
   - Name it (e.g., "voxvid-storage")
   - **Important**: Grant role "Storage Admin" (not just "Storage Object Admin")
   - Click "Done"

3. **Generate JSON Key**
   - Click on the created service account
   - Go to "Keys" tab
   - Click "Add Key" > "Create New Key"
   - Select "JSON" format
   - Download the key file

4. **Configure Application**
   - Place the JSON file in the `Backend/` directory
   - Update `Backend/.env` with the correct paths:
     ```env
     GCP_SERVICE_ACCOUNT_FILE=/home/ramachandra/Music/VoxVid/Backend/your-key-file.json
     GCP_BUCKET_NAME=voxvid-bucket
     ```

### Automatic Bucket Management
- The application automatically creates the bucket if it doesn't exist
- Uniform Bucket-Level Access is enabled automatically
- Public read access is configured for all uploaded files
- Files are organized in folders: `images/` and `videos/`

### Troubleshooting GCP Issues
- **Permission Denied**: Ensure service account has "Storage Admin" role
- **Bucket Creation Failed**: Check if bucket name is globally unique
- **File Upload Failed**: Verify JSON key file path and permissions

## 🚀 Deployment

### Backend Deployment
- Configure production database (PostgreSQL recommended)
- Set `DEBUG=False` in production
- Configure `ALLOWED_HOSTS` for your domain
- Use `gunicorn` for production server
- Set up static file serving

### Frontend Deployment
- Build the application: `pnpm build`
- Deploy to Vercel, Netlify, or similar platform
- Update `NEXT_PUBLIC_API_URL` to your production API URL

## 🆘 Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure frontend URL is in Django's `CORS_ALLOWED_ORIGINS`
2. **API Key Issues**: Verify D-ID API key is correctly set in backend `.env`
3. **Database Issues**: Run migrations with `python manage.py migrate`
4. **Port Conflicts**: Change ports in development if 3000/8000 are occupied
5. **GCP Permission Errors**: Ensure service account has "Storage Admin" role, not just "Storage Object Admin"
6. **GCP Bucket Creation Failed**: Choose a globally unique bucket name
7. **File Upload Errors**: Verify the JSON key file path and permissions

### GCP-Specific Issues

- **"does not have storage.buckets.get access"**: Service account needs "Storage Admin" role
- **"Bucket already exists"**: Choose a different bucket name
- **"Invalid credentials"**: Check JSON key file path and contents
- **File uploads fail silently**: Check Django logs for detailed error messages

## 🔗 Links

- **Repository**: [https://github.com/Ramachandra-2k96/VoxVid](https://github.com/Ramachandra-2k96/VoxVid)
- **D-ID API**: [https://www.d-id.com/](https://www.d-id.com/)
- **Django Documentation**: [https://docs.djangoproject.com/](https://docs.djangoproject.com/)
- **Next.js Documentation**: [https://nextjs.org/docs](https://nextjs.org/docs)