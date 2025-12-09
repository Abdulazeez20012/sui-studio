FROM node:20-slim

# Install system dependencies (minimal set)
RUN apt-get update && apt-get install -y \
    curl \
    git \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Download pre-built Sui CLI binary (much faster than compiling)
# Using official releases from GitHub
RUN curl -fLJ https://github.com/MystenLabs/sui/releases/download/mainnet-v1.36.2/sui-mainnet-v1.36.2-ubuntu-x86_64.tgz \
    -o sui.tgz && \
    mkdir -p sui-temp && \
    tar -xzf sui.tgz -C sui-temp && \
    find sui-temp -name "sui" -type f -executable -exec mv {} /usr/local/bin/sui \; && \
    chmod +x /usr/local/bin/sui && \
    rm -rf sui.tgz sui-temp && \
    sui --version && echo "✅ Sui CLI installed successfully"

# Create workspace directory for user projects
RUN mkdir -p /app/workspaces && chmod 777 /app/workspaces

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start server
CMD ["npm", "start"]
