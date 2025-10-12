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
- **SQLite** - Database (development)
- **D-ID API** - AI video generation service
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
   SECRET_KEY=your_django_secret_key
   DEBUG=True
   ```

6. **Run database migrations**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

8. **Start the development server**
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

## 🎯 Key Features

- **AI Video Generation**: Convert text scripts to professional videos
- **Avatar Selection**: Choose from various AI avatars
- **Voice Synthesis**: Multiple voice options for narration
- **User Authentication**: Secure JWT-based authentication
- **Video Management**: Track and manage generated videos
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Status**: Track video generation progress

## 🔑 D-ID API Integration

This project integrates with D-ID's API for AI video generation. You'll need:

1. **D-ID Account**: Sign up at [D-ID](https://www.d-id.com/)
2. **API Key**: Get your API key from the D-ID dashboard
3. **Add to Environment**: Set `DDI_API_KEY` in your backend `.env` file

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

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure frontend URL is in Django's `CORS_ALLOWED_ORIGINS`
2. **API Key Issues**: Verify D-ID API key is correctly set in backend `.env`
3. **Database Issues**: Run migrations with `python manage.py migrate`
4. **Port Conflicts**: Change ports in development if 3000/8000 are occupied

### Getting Help

- Check the [Issues](https://github.com/Ramachandra-2k96/VoxVid/issues) page
- Create a new issue with detailed description
- Include error messages and environment details

## 🔗 Links

- **Repository**: [https://github.com/Ramachandra-2k96/VoxVid](https://github.com/Ramachandra-2k96/VoxVid)
- **D-ID API**: [https://www.d-id.com/](https://www.d-id.com/)
- **Django Documentation**: [https://docs.djangoproject.com/](https://docs.djangoproject.com/)
- **Next.js Documentation**: [https://nextjs.org/docs](https://nextjs.org/docs)