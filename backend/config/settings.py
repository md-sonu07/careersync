"""
Django settings for CareerSync project.

Configured for Django REST Framework, SQLite, and React frontend integration using python-decouple.
"""

import os
import sys
from pathlib import Path
from datetime import timedelta
from decouple import config, Csv

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Add 'apps' folder to Python path for clean app imports
sys.path.insert(0, os.path.join(BASE_DIR, 'apps'))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/6.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = config('SECRET_KEY', default='django-insecure-careersync-fallback-secret-key')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = config('DEBUG', default=True, cast=bool)

ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='localhost,127.0.0.1', cast=Csv())


# Application definition

INSTALLED_APPS = [
    # Django Core Apps
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third Party Apps
    'rest_framework',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',
    'corsheaders',
    'drf_yasg',

    # Custom Local Apps
    'accounts',
    'institutions',
    'students',
    'companies',
    'academicians',
    'skills',
    'assessments',
    'courses',
    'analytics',
    'ai',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Placed as high as possible for CORS preflight
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

# Custom User Model
AUTH_USER_MODEL = 'accounts.User'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'


# Database Configuration (SQLite)
# https://docs.djangoproject.com/en/6.1/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / config('DB_NAME', default='db.sqlite3'),
    }
}


# Password validation
# https://docs.djangoproject.com/en/6.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/6.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/6.1/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'


# Default primary key field type
# https://docs.djangoproject.com/en/6.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


# CORS Headers Configuration for React Frontend Integration
CORS_ALLOWED_ORIGINS = config('CORS_ALLOWED_ORIGINS', default='http://localhost:3000,http://localhost:5173,http://127.0.0.1:3000,http://127.0.0.1:5173', cast=Csv())
CORS_ALLOW_CREDENTIALS = True
if DEBUG:
    CORS_ALLOW_ALL_ORIGINS = True

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
    'x-guest-id',
]



# Django REST Framework Settings
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.AllowAny',
    ),
    'DEFAULT_RENDERER_CLASSES': (
        'rest_framework.renderers.JSONRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',
    ),
    'DEFAULT_THROTTLE_CLASSES': (
        'rest_framework.throttling.UserRateThrottle',
    ),
    'DEFAULT_THROTTLE_RATES': {
        'user': '60/min',
        'ai_chat': '20/min',
    },
}


# Simple JWT Configuration
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=config('JWT_ACCESS_MINUTES', default=60, cast=int)),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=config('JWT_REFRESH_DAYS', default=7, cast=int)),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': True,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
}


# AI Configuration
# AI_PROVIDER is retained for legacy callers. Chat uses the primary/fallback
# settings below so the browser never needs access to an AI provider or key.
AI_PROVIDER = config('AI_PROVIDER', default='mock')

# Chat defaults: local Ollama first, then Gemini when Ollama cannot respond.
AI_CHAT_PRIMARY_PROVIDER = config('AI_CHAT_PRIMARY_PROVIDER', default='ollama')
AI_CHAT_FALLBACK_ENABLED = config('AI_CHAT_FALLBACK_ENABLED', default=True, cast=bool)
AI_CHAT_FALLBACK_PROVIDER = config('AI_CHAT_FALLBACK_PROVIDER', default='gemini')

OLLAMA_BASE_URL = config('OLLAMA_BASE_URL', default='http://127.0.0.1:11434')
OLLAMA_MODEL = config('OLLAMA_MODEL', default='qwen3:8b')
OLLAMA_TIMEOUT_SECONDS = config('OLLAMA_TIMEOUT_SECONDS', default=30, cast=int)

GEMINI_API_KEY = config('GEMINI_API_KEY', default='')
# AI_MODEL remains supported for existing .env files.
GEMINI_MODEL = config('GEMINI_MODEL', default=config('AI_MODEL', default='gemini-3.6-flash'))
GEMINI_TIMEOUT_SECONDS = config('GEMINI_TIMEOUT_SECONDS', default=30, cast=int)

# OpenAI-compatible provider settings (only used when AI_PROVIDER=openai)
OPENAI_API_KEY = config('OPENAI_API_KEY', default='')
OPENAI_BASE_URL = config('OPENAI_BASE_URL', default='https://opencode.ai/zen/v1/chat/completions')
AI_SYSTEM_PROMPT = """You are Career AI 👋, a learning and career assistant for CareerSync.
Be concise, clear, and beginner-friendly. Provide concrete examples. Never invent user data. Distinguish facts from suggestions. Stay professional and educational."""

# Swagger UI Configuration for drf_yasg
SWAGGER_SETTINGS = {
    'SECURITY_DEFINITIONS': {
        'Bearer': {
            'type': 'apiKey',
            'name': 'Authorization',
            'in': 'header',
            'description': 'Enter JWT token in format: Bearer <your_token>'
        }
    },
    'USE_SESSION_AUTH': False,
    'JSON_EDITOR': True,
}

# Razorpay Configuration
RAZORPAY_KEY_ID = config('RAZORPAY_KEY_ID', default='rzp_test_SgNPgO51icjN28')
RAZORPAY_KEY_SECRET = config('RAZORPAY_KEY_SECRET', default='23lZ3ffgn3n2ggOeN1BMhRJE')
RAZORPAY_WEBHOOK_SECRET = config('RAZORPAY_WEBHOOK_SECRET', default='5094022fbfb69d093bfc995822b2238079c5413acfa1f314e3e41928dfd5c582')

# ImageKit Configuration
IMAGEKIT_PUBLIC_KEY = config('IMAGEKIT_PUBLIC_KEY', default='public_vNSu+tU1Im8jNsOi7Ipd1Ptt92c=')
IMAGEKIT_PRIVATE_KEY = config('IMAGEKIT_PRIVATE_KEY', default='private_Epzp01NXplITplT8YKI4Rk7ZLO0=')
IMAGEKIT_URL_ENDPOINT = config('IMAGEKIT_URL_ENDPOINT', default='https://ik.imagekit.io/crms')

