# Sui Studio

> The Unified Development Platform for the Sui Ecosystem - Bridging the gap between first-time explorers and enterprise teams.

A modern, feature-rich development environment for building on the Sui blockchain. Sui Studio provides both web and desktop experiences, offering instant access for beginners and powerful tools for professional developers.

## Features

### Web Studio
- **Instant Access** - Zero setup. Start coding in your browser in under 5 seconds
- **Cloud Sync** - Your projects follow you. Start on tablet, finish on desktop
- **Guided Tutorials** - Integrated learning paths for first-time explorers

### Desktop Studio
- **Local Power** - Full access to local file systems, hardware acceleration, and offline mode
- **Advanced Debugger** - Step-through execution with real-time gas profiling
- **Team Security** - Enterprise-grade secret management and granular permissions

## Tech Stack

- **React 19** - Modern UI framework
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Framer Motion** - Smooth animations
- **Lucide React** - Beautiful icons

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd new-sui-studio

# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
new-sui-studio/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── Hero.tsx        # Landing hero section
│   ├── Navbar.tsx      # Navigation bar
│   ├── Partners.tsx    # Partners showcase
│   ├── Personas.tsx    # User personas
│   ├── Pricing.tsx     # Pricing section
│   ├── Roadmap.tsx     # Product roadmap
│   └── ...
├── App.tsx             # Main application component
├── index.tsx           # Application entry point
├── constants.tsx       # Application constants
├── types.ts            # TypeScript type definitions
└── vite.config.ts      # Vite configuration
```

## Who Is This For?

### The Explorer
Web2 developers or students curious about Move. Get started with one-click Web Studio and templates.

### The Builder
Professional blockchain engineers shipping dApps. Benefit from hot-reloading and visual transaction inspector.

### The Enterprise
Large teams building infrastructure. Leverage SSO, audit logs, and team workspaces.

## Key Problems Solved

- **The Setup Hell** - Beginners lose hours configuring local environments before writing a single line of Move code
- **Fragmented Tooling** - Professionals juggle separate tools for debugging, gas analysis, and deployment
- **Environment Drift** - Teams struggle with inconsistent dependencies causing "it works on my machine" issues

## License

This project is private and not licensed for public use.

## Contributing

This is a private project. Contributions are limited to authorized team members.
