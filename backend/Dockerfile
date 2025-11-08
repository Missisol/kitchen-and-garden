FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create uploads directory if it doesn't exist
RUN mkdir -p static/uploads

# Expose port
EXPOSE 5002

# Set environment variables
ENV FLASK_APP=recipe.py
ENV FLASK_DEBUG=0
ENV PYTHONUNBUFFERED=1

# Run database migrations and start the application
CMD flask db upgrade && flask run --host=0.0.0.0 --port=5002

