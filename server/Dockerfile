# First stage: Build the React app
FROM node:16 AS frontend-builder
WORKDIR /app
COPY client/ .
RUN npm install
RUN npm run build

# Second stage: Set up the Flask app with Gunicorn
FROM python:3.9 AS backend
WORKDIR /app

# Copy requirements and install dependencies
COPY server/requirements.txt .
RUN pip install -r requirements.txt

# Copy the Flask app code
COPY server/ .

# Copy the built React files from the first stage
COPY --from=frontend-builder /app/build /app/client/build

# Expose the Flask port
EXPOSE 8000

# Run Flask app with Gunicorn
CMD ["sh", "-c", "gunicorn --bind 0.0.0.0:${PORT:-8000} app:app"]
