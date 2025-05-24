FROM node:18-alpine

# Set working directory to the monorepo root
WORKDIR /app

# Copy root package.json and tsconfig.json
COPY package*.json ./
COPY tsconfig.json ./

# Copy the entire apps directory
COPY apps/ ./apps/

# Install dependencies from the root (this handles workspace dependencies)
RUN npm install

# Build the server
WORKDIR /app/apps/server
RUN npm run build

# Expose the port your server runs on
EXPOSE 3000

# Start the server
CMD ["node", "dist/index.js"]