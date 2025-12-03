/**
 * Centralized configuration for the application
 * All environment variables and configuration values should be defined here
 */

// API Configuration
export const apiConfig = {
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
} as const;

// Sui Blockchain Configuration
export const suiConfig = {
  network: (import.meta.env.VITE_SUI_NETWORK || 'testnet') as 'mainnet' | 'testnet' | 'devnet',
  rpcUrl: import.meta.env.VITE_SUI_RPC_URL || 'https://fullnode.testnet.sui.io:443',
  packageId: import.meta.env.VITE_SUBSCRIPTION_PACKAGE_ID || '',
  explorerUrl: import.meta.env.VITE_SUI_EXPLORER_URL || 'https://suiscan.xyz/testnet',
} as const;

// Walrus Configuration
export const walrusConfig = {
  publisherUrl: import.meta.env.VITE_WALRUS_PUBLISHER_URL || 'https://publisher.walrus-testnet.walrus.space',
  aggregatorUrl: import.meta.env.VITE_WALRUS_AGGREGATOR_URL || 'https://aggregator.walrus-testnet.walrus.space',
  network: (import.meta.env.VITE_WALRUS_NETWORK || 'testnet') as 'mainnet' | 'testnet',
  maxFileSize: 10 * 1024 * 1024, // 10MB
} as const;

// Authentication Configuration
export const authConfig = {
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
  jwtSecret: import.meta.env.VITE_JWT_SECRET || '',
  sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
} as const;

// Feature Flags
export const features = {
  collaboration: import.meta.env.VITE_ENABLE_COLLABORATION === 'true',
  ai: import.meta.env.VITE_ENABLE_AI === 'true',
  analytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  videoChat: import.meta.env.VITE_ENABLE_VIDEO_CHAT === 'true',
  walrus: import.meta.env.VITE_ENABLE_WALRUS === 'true',
  subscriptions: import.meta.env.VITE_ENABLE_SUBSCRIPTIONS === 'true',
  extensions: import.meta.env.VITE_ENABLE_EXTENSIONS === 'true',
} as const;

// WebSocket Configuration
export const wsConfig = {
  url: import.meta.env.VITE_WS_URL || 'ws://localhost:3001',
  reconnectDelay: 3000,
  maxReconnectAttempts: 5,
  heartbeatInterval: 30000,
} as const;

// WebRTC Configuration
export const webrtcConfig = {
  peerJsHost: import.meta.env.VITE_PEERJS_HOST || 'localhost',
  peerJsPort: parseInt(import.meta.env.VITE_PEERJS_PORT || '9000'),
  peerJsPath: import.meta.env.VITE_PEERJS_PATH || '/peerjs',
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
} as const;

// Editor Configuration
export const editorConfig = {
  theme: 'vs-dark',
  fontSize: 14,
  tabSize: 2,
  autoSave: true,
  autoSaveDelay: 1000,
  minimap: true,
  lineNumbers: true,
  wordWrap: 'on' as const,
} as const;

// Storage Configuration
export const storageConfig = {
  prefix: 'sui-studio',
  version: '1.0',
  maxProjects: 100,
  maxFileSize: 5 * 1024 * 1024, // 5MB
} as const;

// Analytics Configuration
export const analyticsConfig = {
  enabled: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  trackingId: import.meta.env.VITE_ANALYTICS_ID || '',
  debug: import.meta.env.DEV,
} as const;

// Rate Limiting Configuration
export const rateLimitConfig = {
  maxRequests: 100,
  windowMs: 60 * 1000, // 1 minute
  message: 'Too many requests, please try again later.',
} as const;

// Application Metadata
export const appConfig = {
  name: 'Sui Studio',
  version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  description: 'Professional IDE for Sui Move Development',
  author: 'Sui Studio Team',
  repository: 'https://github.com/yourusername/sui-studio',
  supportEmail: 'support@suistudio.dev',
  discordUrl: 'https://discord.gg/suistudio',
} as const;

// Environment
export const env = {
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  mode: import.meta.env.MODE,
} as const;

// Export all configs
export const config = {
  api: apiConfig,
  sui: suiConfig,
  walrus: walrusConfig,
  auth: authConfig,
  features,
  ws: wsConfig,
  webrtc: webrtcConfig,
  editor: editorConfig,
  storage: storageConfig,
  analytics: analyticsConfig,
  rateLimit: rateLimitConfig,
  app: appConfig,
  env,
} as const;

export default config;

// Type exports
export type Config = typeof config;
export type Features = typeof features;
export type SuiNetwork = typeof suiConfig.network;
export type WalrusNetwork = typeof walrusConfig.network;
