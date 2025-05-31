# Use a Python image
FROM python:3.12-slim

# Set working directory inside the container
WORKDIR /app

# Copy the backend files
COPY . /app

# Install Python dependencies
RUN pip install --upgrade pip && pip install -r requirements.txt

# Run Django server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
