FROM node:20-slim

# Install system dependencies including build tools for Rust compilation
RUN apt-get update && apt-get install -y \
    curl \
    git \
    ca-certificates \
    build-essential \
    pkg-config \
    libssl-dev \
    clang \
    libclang-dev \
    llvm-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Rust and compile Sui CLI from source
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"

# Install Sui CLI by compiling from source (this takes ~10-15 minutes)
# Using mainnet branch for stable version
RUN cargo install --locked --git https://github.com/MystenLabs/sui.git --branch mainnet sui

# Verify Sui CLI installation
RUN sui --version && echo "✅ Sui CLI installed successfully"

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
