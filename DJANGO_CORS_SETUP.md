# Django CORS Configuration

To remove the Next.js proxy layer and call Django directly, configure CORS in your Django backend.

## Install django-cors-headers

```bash
pip install django-cors-headers
```

## Settings Configuration

In your `settings.py`:

```python
INSTALLED_APPS = [
    ...
    'corsheaders',
    ...
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Should be at the top
    'django.middleware.common.CommonMiddleware',
    ...
]

# CORS Configuration
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # Next.js dev server
    "https://reley-media-frontend.vercel.app",  # Production frontend
    # Add your production domain here
]

# Or allow all origins (NOT recommended for production)
# CORS_ALLOW_ALL_ORIGINS = True

# Allow credentials (cookies, auth headers)
CORS_ALLOW_CREDENTIALS = True

# Allowed headers
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

# Allowed methods
CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]
```

## After Configuration

Once CORS is configured, the frontend will call Django directly without needing Next.js proxy routes.

The proxy routes can be kept for:
- Server-side rendering (SSR) benefits
- Additional caching
- But they're no longer required for client-side calls











