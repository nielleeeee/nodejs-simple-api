# Use a Node.js base image with a suitable version
FROM node:20-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm ci --omit=dev --production

# Copy the rest of your application code
COPY . .

# Install tsc-alias for path aliasing
RUN npm install --save-dev tsc-alias drizzle-kit @types/pg pg drizzle-orm
RUN npx drizzle-kit generate

# Build the TypeScript code
RUN npm run build

# Use a smaller image for production
FROM node:20-alpine 

WORKDIR /app

# Install PostgreSQL client tools
RUN apk add --no-cache postgresql-client

USER root
RUN chown -R node:node /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/drizzle ./drizzle
COPY --from=builder /app/src/db ./src/db
COPY --from=builder /app/entrypoint.sh ./
COPY --from=builder /app/drizzle.config.ts ./

# Set environment variables
ENV NODE_ENV production
ENV PORT 3000

# Expose the port your app listens on
EXPOSE ${PORT}

RUN chmod +x entrypoint.sh

CMD ["sh", "entrypoint.sh"]