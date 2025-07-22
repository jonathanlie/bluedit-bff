# --- Build Stage ---
# Use a Node.js version that includes build tools
FROM node:20-slim AS build

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy the rest of the application code
COPY . .

# --- Final Stage ---
# Use a smaller, more secure base image
FROM node:20-slim

WORKDIR /usr/src/app

# Create a non-root user for security
RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 --gid 1001 nodejs

# Copy dependencies and application code from the build stage
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/index.js ./index.js

# Switch to the non-root user
USER nodejs

# Expose the port the server will run on
EXPOSE 4000

# The command to start the server
CMD [ "node", "index.js" ]
