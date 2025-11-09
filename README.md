# VoxVid - AI-Powered Video Generation Platform

VoxVid is a comprehensive full-stack application that transforms text scripts and audio into professional AI-generated videos using multiple platforms (D-ID and HeyGen). Create engaging video content with AI avatars, custom backgrounds, voice synthesis, and advanced positioning controls - no cameras, studios, or editing skills required.

## 🚀 Live Demo

**Repository**: [https://github.com/Ramachandra-2k96/VoxVid](https://github.com/Ramachandra-2k96/VoxVid)

## 📁 Project Structure

```
VoxVid/
├── Backend/                      # Django REST API
│   ├── api/                     # Main API app
│   │   ├── models.py            # Database models (User, Profile, VideoGeneration, etc.)
│   │   ├── views.py             # API endpoints and business logic
│   │   ├── serializers.py       # Data serialization
│   │   ├── urls.py              # API routing
│   │   ├── gcp_storage.py       # Google Cloud Storage utilities
│   │   └── email_service.py     # Brevo email service integration
│   ├── backend/                 # Django project settings
│   │   ├── settings.py          # Configuration
│   │   └── urls.py              # Main URL routing
│   ├── requirements.txt         # Python dependencies
│   ├── manage.py                # Django management
│   └── .env                     # Environment variables
│
└── frontend/                    # Next.js React app
    ├── app/                     # App router pages
    │   ├── layout.tsx           # Root layout with theme provider
    │   ├── page.tsx             # Landing page
    │   ├── login/               # Login page
    │   ├── signup/              # Registration page
    │   ├── forgot-password/     # Password reset page
    │   └── home/                # Protected dashboard area
    │       ├── layout.tsx       # Dashboard layout with dock navigation
    │       ├── page.tsx         # Dashboard home
    │       ├── create/          # D-ID video creation
    │       ├── create_heygen/   # HeyGen video creation
    │       ├── social/          # Public video feed
    │       ├── profile/         # User profile management
    │       └── settings/        # User settings
    ├── components/              # Reusable UI components
    │   ├── ui/                  # Shadcn UI components
    │   │   └── Dock.tsx         # Animated dock navigation
    │   ├── voice-input-button.tsx  # Speech-to-text component
    │   └── [other components]   # Landing page sections
    ├── lib/                     # Utility functions
    ├── package.json             # Node.js dependencies
    └── .env                     # Environment variables
```

## 🚀 Quick Start

### Prerequisites

- **Python 3.8+** (3.12 recommended)
- **Node.js 18+** (for Next.js 15)
- **pnpm** (package manager)
- **FFmpeg** (for audio processing with pydub)
- **Google Cloud Platform Account** (for file storage)
- **API Keys** (D-ID, HeyGen, Cerebras, Brevo)

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

4. **Install FFmpeg** (required for audio processing)
   ```bash
   # Ubuntu/Debian
   sudo apt-get install ffmpeg
   
   # macOS
   brew install ffmpeg
   
   # Windows (using Chocolatey)
   choco install ffmpeg
   ```

5. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

6. **Set up environment variables**
   
   Create or update `Backend/.env`:
   ```env
   # Required API Keys
   DDI_API_KEY=your_d_id_api_key_here
   HEYGEN_API_KEY=your_heygen_api_key_here
   CEREBRUS_API_KEY=your_cerebras_api_key_here
   
   # Django Configuration
   SECRET_KEY=your_django_secret_key
   DEBUG=True
   FRONTEND_URL=http://localhost:3000
   
   # Database (optional - defaults to SQLite)
   # DATABASE_URL=postgresql://user:password@host:port/database
   
   # Google Cloud Storage (Required for file uploads)
   GCP_SERVICE_ACCOUNT_FILE=/absolute/path/to/Backend/your-service-account-file.json
   GCP_BUCKET_NAME=your-unique-bucket-name
   
   # Email Service (Brevo/Sendinblue for password reset)
   Brevo_API_Key=your_brevo_api_key_here
   Brevo_API_Email=your_verified_sender_email@example.com
   ```

7. **Run database migrations**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

8. **Create a superuser (optional)**
   ```bash
   python manage.py createsuperuser
   ```

9. **Start the development server**
   ```bash
   python manage.py runserver
   ```

   Backend will be available at: `http://localhost:8000`
   Admin panel: `http://localhost:8000/admin`

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
# Required API Keys
DDI_API_KEY=your_d_id_api_key_here
HEYGEN_API_KEY=your_heygen_api_key_here
CEREBRUS_API_KEY=your_cerebras_api_key_here

# Google Cloud Storage (Required for file uploads)
GCP_SERVICE_ACCOUNT_FILE=/absolute/path/to/Backend/your-service-account-file.json
GCP_BUCKET_NAME=your-unique-bucket-name

# Email Service (Required for password reset)
Brevo_API_Key=your_brevo_api_key_here
Brevo_API_Email=your_verified_sender_email@example.com

# Database (Optional - defaults to SQLite)
# DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require

# Django Configuration
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
- `POST /api/auth/login/` - User login (username or email)
- `POST /api/auth/logout/` - User logout
- `POST /api/auth/token/` - Get JWT tokens
- `POST /api/auth/token/refresh/` - Refresh JWT token
- `GET /api/auth/me/` - Get current user info
- `POST /api/auth/password-reset/request/` - Request password reset OTP
- `POST /api/auth/password-reset/verify/` - Verify OTP and reset password

### Profile Management
- `GET /api/profile/` - Get user profile
- `PUT /api/profile/` - Update user profile
- `PATCH /api/profile/` - Partial profile update

### Video Generation (D-ID)
- `GET /api/videos/` - List user's videos
- `POST /api/videos/create/` - Create new D-ID video
- `GET /api/videos/{id}/` - Get specific video details
- `POST /api/videos/{id}/update/` - Update video status
- `POST /api/videos/{id}/publish/` - Toggle video public/private status

### Video Generation (HeyGen)
- `POST /api/heygen/create/` - Create HeyGen-style video with custom positioning

### Social Features
- `GET /api/social/videos/` - Get public video feed
- `POST /api/social/videos/{id}/like/` - Like/unlike a video
- `POST /api/social/videos/{id}/view/` - Record video view

### AI Enhancement
- `POST /api/ai/enhance/` - Enhance script using Cerebras AI

## 🎯 Key Features

### Video Generation
- **Dual Platform Support**: Create videos using D-ID or HeyGen APIs
- **Text-to-Video**: Convert scripts into AI-narrated videos
- **Audio-to-Video**: Upload audio files for custom narration
- **Custom Avatars**: Upload your own images as talking avatars
- **Background Customization**: Add custom images or videos as backgrounds
- **Advanced Positioning**: Precise avatar placement with scale and offset controls
- **Avatar Shapes**: Choose between square or circle avatar styles
- **Subtitle Support**: Optional subtitle generation for videos

### AI & Voice
- **AI Script Enhancement**: Improve scripts using Cerebras AI
- **Voice Input**: Browser-based speech-to-text for hands-free script writing
- **Multiple Voice Options**: Various AI voices for narration
- **Audio Processing**: Automatic audio format conversion to MP3

### User Experience
- **Social Feed**: Browse and interact with public videos
- **Video Likes & Views**: Engagement tracking for published content
- **Project Management**: Organize and track all your video projects
- **Real-time Status**: Monitor video generation progress
- **Dark/Light Mode**: Full theme support across all components
- **Responsive Design**: Optimized for desktop and mobile devices

### Security & Storage
- **JWT Authentication**: Secure token-based authentication
- **Password Reset**: OTP-based password recovery via email
- **Google Cloud Storage**: Reliable cloud storage for all media files
- **User Profiles**: Customizable user profiles with avatars and bio

## 🔑 External API Integrations

### D-ID API (AI Video Generation)
1. **Sign up**: Create account at [D-ID](https://www.d-id.com/)
2. **Get API Key**: Access your API key from the D-ID dashboard
3. **Configure**: Set `DDI_API_KEY` in your backend `.env` file
4. **Features**: Basic talking avatar videos with text-to-speech

### HeyGen API (Advanced Video Generation)
1. **Sign up**: Create account at [HeyGen](https://www.heygen.com/)
2. **Get API Key**: Access your API key from HeyGen dashboard
3. **Configure**: Set `HEYGEN_API_KEY` in your backend `.env` file
4. **Features**: Advanced videos with custom backgrounds, positioning, and subtitles

### Cerebras API (AI Script Enhancement)
1. **Sign up**: Create account at [Cerebras](https://cerebras.ai/)
2. **Get API Key**: Access your API key from Cerebras dashboard
3. **Configure**: Set `CEREBRUS_API_KEY` in your backend `.env` file
4. **Features**: AI-powered script improvement and enhancement

### Brevo (Email Service)
1. **Sign up**: Create account at [Brevo](https://www.brevo.com/) (formerly Sendinblue)
2. **Get API Key**: Navigate to SMTP & API → API Keys
3. **Verify Sender**: Add and verify your sender email address
4. **Configure**: Set `Brevo_API_Key` and `Brevo_API_Email` in `.env`
5. **Features**: OTP emails for password reset functionality

## 🔄 D-ID vs HeyGen Comparison

| Feature | D-ID | HeyGen |
|---------|------|--------|
| **Avatar Upload** | ✅ Yes | ✅ Yes |
| **Text-to-Speech** | ✅ Yes | ✅ Yes |
| **Audio Input** | ✅ Yes | ✅ Yes |
| **Custom Backgrounds** | ❌ No | ✅ Yes (Image/Video) |
| **Avatar Positioning** | ❌ Limited | ✅ Full Control (X, Y, Scale) |
| **Avatar Shapes** | ❌ No | ✅ Square/Circle |
| **Subtitles** | ❌ No | ✅ Yes |
| **Processing Speed** | ⚡ Fast | ⚡ Fast |
| **Best For** | Quick talking head videos | Professional videos with custom layouts |

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

## 🎬 Video Creation Workflow

### D-ID Video Creation
1. Navigate to `/home/create`
2. Upload an avatar image
3. Enter or speak your script (voice input supported)
4. Optionally enhance script with AI
5. Select voice and configure settings
6. Submit to generate video
7. Monitor status and download when complete

### HeyGen Video Creation
1. Navigate to `/home/create_heygen`
2. Upload avatar image and background (image or video)
3. Choose input type: text script or audio file
4. Position avatar using interactive canvas:
   - Adjust scale (size)
   - Set X/Y position
   - Choose shape (square/circle)
5. Configure voice settings (for text input)
6. Enable subtitles if needed
7. Submit to generate video
8. Track progress and download result

### Social Sharing
1. Go to your video in dashboard
2. Toggle "Publish" to make video public
3. Video appears in social feed (`/home/social`)
4. Other users can view, like, and track views

## 📱 Application Pages

### Public Pages
- **Landing Page** (`/`) - Hero section, features, testimonials, and FAQ
- **Login** (`/login`) - User authentication
- **Sign Up** (`/signup`) - New user registration
- **Forgot Password** (`/forgot-password`) - OTP-based password reset
- **Terms of Service** (`/terms`) - Legal terms
- **Privacy Policy** (`/privacy`) - Privacy information

### Protected Dashboard (`/home`)
- **Dashboard Home** - Overview and quick actions
- **Create Video (D-ID)** (`/home/create`) - Basic video creation with D-ID
- **Create Video (HeyGen)** (`/home/create_heygen`) - Advanced video creation with custom positioning
- **Social Feed** (`/home/social`) - Browse and interact with public videos
- **Profile** (`/home/profile`) - View and edit user profile
- **Settings** (`/home/settings`) - Account settings and preferences

### Key UI Components
- **Dock Navigation** - Animated bottom dock for quick navigation
- **Voice Input Button** - Speech-to-text for hands-free script writing
- **Theme Toggle** - Switch between light and dark modes
- **Video Preview Canvas** - Real-time avatar positioning preview

## 🚀 Deployment

### Backend Deployment (Django)
1. **Database Setup**
   - Use PostgreSQL for production
   - Set `DATABASE_URL` environment variable
   - Run migrations: `python manage.py migrate`

2. **Django Configuration**
   - Set `DEBUG=False`
   - Configure `ALLOWED_HOSTS` with your domain
   - Set `SECRET_KEY` to a strong random value
   - Configure `CORS_ALLOWED_ORIGINS`

3. **Server Setup**
   - Use `gunicorn` as WSGI server:
     ```bash
     gunicorn backend.wsgi:application --bind 0.0.0.0:8000
     ```
   - Set up Nginx as reverse proxy
   - Configure SSL/TLS certificates
   - Set up static file serving with WhiteNoise or CDN

4. **Environment Variables**
   - Set all required API keys
   - Configure GCP credentials
   - Set email service credentials

### Frontend Deployment (Next.js)
1. **Build Application**
   ```bash
   pnpm build
   ```

2. **Deploy to Vercel (Recommended)**
   - Connect GitHub repository
   - Set `NEXT_PUBLIC_API_URL` environment variable
   - Deploy automatically on push

3. **Alternative Platforms**
   - **Netlify**: Similar to Vercel
   - **AWS Amplify**: Full AWS integration
   - **Self-hosted**: Use `pnpm start` with PM2

4. **Configuration**
   - Update API URL to production backend
   - Configure custom domain
   - Set up CDN for assets
   - Enable analytics if needed

## 🆘 Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure frontend URL is in Django's `CORS_ALLOWED_ORIGINS` in `settings.py`
2. **API Key Issues**: Verify all API keys (D-ID, HeyGen, Cerebras, Brevo) are correctly set in backend `.env`
3. **Database Issues**: Run migrations with `python manage.py migrate`
4. **Port Conflicts**: Change ports in development if 3000/8000 are occupied
5. **Voice Input Not Working**: Ensure you're using Chrome/Edge (Web Speech API support required)
6. **Email Not Sending**: Verify Brevo API key and sender email are configured and verified

### GCP-Specific Issues

- **"does not have storage.buckets.get access"**: Service account needs "Storage Admin" role
- **"Bucket already exists"**: Choose a globally unique bucket name
- **"Invalid credentials"**: Check JSON key file path and contents
- **File uploads fail silently**: Check Django logs for detailed error messages
- **Permission Denied**: Ensure service account has "Storage Admin" role, not just "Storage Object Admin"

### API-Specific Issues

- **D-ID Video Fails**: Check API key validity and account credits
- **HeyGen Upload Fails**: Verify API key format (should start with `sk_V2_`)
- **Audio Conversion Errors**: Ensure `pydub` and `ffmpeg` are properly installed
  ```bash
  # Test FFmpeg installation
  ffmpeg -version
  ```
- **OTP Email Not Received**: Check Brevo sender email is verified and API key is valid
- **"Module not found" errors**: Ensure virtual environment is activated and dependencies installed
- **CORS issues in production**: Update `CORS_ALLOWED_ORIGINS` in Django settings

## 💾 Database Models

### User & Profile
- **User** - Django's built-in user model (username, email, password)
- **Profile** - Extended user information (bio, location, website, avatar)

### Video Generation
- **VideoGeneration** - Main model for video projects
  - Platform identifier (d-id or heygen)
  - Source URLs for uploaded media (GCP)
  - Script input and audio URLs
  - Platform-specific IDs (talk_id, talking_photo_id)
  - Status tracking (created, processing, done, error)
  - Result URLs for generated videos
  - Avatar positioning (scale, x, y offsets)
  - Voice configuration (provider, voice_id, voice_name)
  - Social features (is_public, views_count)

### Social Features
- **VideoLike** - User likes on videos
- **VideoView** - Video view tracking with user/IP

### Authentication
- **PasswordResetOTP** - OTP codes for password reset (10-minute expiry)

## 🔗 Links

### Project
- **Repository**: [https://github.com/Ramachandra-2k96/VoxVid](https://github.com/Ramachandra-2k96/VoxVid)

### API Services
- **D-ID API**: [https://www.d-id.com/](https://www.d-id.com/)
- **HeyGen API**: [https://www.heygen.com/](https://www.heygen.com/)
- **Cerebras AI**: [https://cerebras.ai/](https://cerebras.ai/)
- **Brevo (Email)**: [https://www.brevo.com/](https://www.brevo.com/)
- **Google Cloud Storage**: [https://cloud.google.com/storage](https://cloud.google.com/storage)

### Documentation
- **Django**: [https://docs.djangoproject.com/](https://docs.djangoproject.com/)
- **Django REST Framework**: [https://www.django-rest-framework.org/](https://www.django-rest-framework.org/)
- **Next.js**: [https://nextjs.org/docs](https://nextjs.org/docs)
- **Tailwind CSS**: [https://tailwindcss.com/docs](https://tailwindcss.com/docs)
- **Radix UI**: [https://www.radix-ui.com/](https://www.radix-ui.com/)

### Development Guidelines
- Follow PEP 8 for Python code
- Use TypeScript for all new frontend code
- Write meaningful commit messages
- Add tests for new features
- Update README for significant changes

## 👨‍💻 Author

**Ramachandra**
- GitHub: [@Ramachandra-2k96](https://github.com/Ramachandra-2k96)
- Email: ramachandraudupa2004@gmail.com

## 🙏 Acknowledgments

- **D-ID** for AI video generation API
- **HeyGen** for advanced video creation capabilities
- **Cerebras** for AI script enhancement
- **Brevo** for email service
- **Google Cloud** for reliable file storage
- **Vercel** for Next.js framework and hosting
- **Shadcn/ui** for beautiful UI components

## 📊 Project Stats

- **Languages**: Python, TypeScript, JavaScript
- **Frameworks**: Django, Next.js, React
- **Database**: SQLite (dev), PostgreSQL (prod)
- **Cloud**: Google Cloud Storage
- **APIs**: D-ID, HeyGen, Cerebras, Brevo

---

**⭐ If you find this project helpful, please consider giving it a star!**