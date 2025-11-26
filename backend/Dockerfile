FROM node:20-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    git \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Download pre-built Sui CLI binary (much faster than compiling)
RUN curl -L https://github.com/MystenLabs/sui/releases/download/mainnet-v1.14.2/sui-mainnet-v1.14.2-ubuntu-x86_64.tgz -o sui.tgz \
    && tar -xzf sui.tgz \
    && mv sui-mainnet-v1.14.2-ubuntu-x86_64/sui /usr/local/bin/sui \
    && chmod +x /usr/local/bin/sui \
    && rm -rf sui.tgz sui-mainnet-v1.14.2-ubuntu-x86_64

# Verify Sui installation
RUN sui --version

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
