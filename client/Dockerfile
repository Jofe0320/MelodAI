# Use a Node.js base image
FROM node:16

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json .
RUN npm install

# Copy the React app code
COPY . .

# Build the React app
RUN npm run build

# Serve the React app
EXPOSE 3000
CMD ["npx", "serve", "-s", "build"]
