FROM node:20-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    git \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Download and install Sui CLI binary
RUN curl -L https://github.com/MystenLabs/sui/releases/download/mainnet-v1.14.2/sui-mainnet-v1.14.2-ubuntu-x86_64.tgz -o sui.tgz \
    && echo "=== Listing tar contents ===" \
    && tar -tzf sui.tgz | head -30 \
    && echo "=== Extracting ===" \
    && tar -xzf sui.tgz \
    && echo "=== Current directory contents ===" \
    && ls -la \
    && echo "=== Finding sui binary ===" \
    && find . -maxdepth 5 -name "sui" -type f 2>/dev/null | head -10 \
    && echo "=== Copying sui binary ===" \
    && (cp ./target/release/sui /usr/local/bin/sui 2>/dev/null || \
        cp ./sui /usr/local/bin/sui 2>/dev/null || \
        find . -maxdepth 5 -name "sui" -type f -exec cp {} /usr/local/bin/sui \; 2>/dev/null) \
    && chmod +x /usr/local/bin/sui \
    && echo "=== Cleaning up ===" \
    && rm -rf sui.tgz target external-crates crates sui-mainnet-* \
    && echo "=== Verifying installation ===" \
    && sui --version

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
