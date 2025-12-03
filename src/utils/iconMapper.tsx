import React from 'react';
import {
  Bug,
  Search,
  Code,
  TestTube,
  FileCode,
  Zap,
  Package,
  Palette,
  FileText,
  BookOpen,
  Sparkles,
  Wrench,
  Shield,
  Terminal,
  GitBranch,
  Database,
  Cloud,
  Lock,
  Eye,
  Settings,
  Layers,
  Box,
  CheckCircle,
  AlertCircle,
  Info,
  HelpCircle,
} from 'lucide-react';

/**
 * Icon mapping utility for consistent icon usage across the application
 * Maps string identifiers to Lucide React icon components
 */

export type IconName = 
  | 'bug'
  | 'search'
  | 'code'
  | 'test'
  | 'file'
  | 'zap'
  | 'package'
  | 'palette'
  | 'document'
  | 'book'
  | 'sparkles'
  | 'wrench'
  | 'shield'
  | 'terminal'
  | 'git'
  | 'database'
  | 'cloud'
  | 'lock'
  | 'eye'
  | 'settings'
  | 'layers'
  | 'box'
  | 'check'
  | 'alert'
  | 'info'
  | 'help';

export const iconMap: Record<IconName, React.ComponentType<any>> = {
  bug: Bug,
  search: Search,
  code: Code,
  test: TestTube,
  file: FileCode,
  zap: Zap,
  package: Package,
  palette: Palette,
  document: FileText,
  book: BookOpen,
  sparkles: Sparkles,
  wrench: Wrench,
  shield: Shield,
  terminal: Terminal,
  git: GitBranch,
  database: Database,
  cloud: Cloud,
  lock: Lock,
  eye: Eye,
  settings: Settings,
  layers: Layers,
  box: Box,
  check: CheckCircle,
  alert: AlertCircle,
  info: Info,
  help: HelpCircle,
};

/**
 * Category to icon mapping for extensions and features
 */
export const categoryIcons: Record<string, IconName> = {
  'Analysis': 'search',
  'Language': 'code',
  'Debugging': 'bug',
  'Formatting': 'palette',
  'Snippets': 'zap',
  'Linting': 'shield',
  'Testing': 'test',
  'Documentation': 'book',
  'Tools': 'wrench',
  'Themes': 'palette',
  'Git': 'git',
  'Database': 'database',
  'Cloud': 'cloud',
  'Security': 'lock',
};

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
  color?: string;
}

/**
 * Get an icon component by name
 * @param name - Icon identifier
 * @param size - Icon size in pixels (default: 20)
 * @param className - Additional CSS classes
 * @param color - Icon color
 */
export const Icon: React.FC<IconProps> = ({ 
  name, 
  size = 20, 
  className = '', 
  color 
}) => {
  const IconComponent = iconMap[name] || Code;
  return <IconComponent size={size} className={className} color={color} />;
};

/**
 * Get icon component by name (for direct use)
 */
export const getIcon = (name: IconName | string): React.ComponentType<any> => {
  return iconMap[name as IconName] || Code;
};

/**
 * Get icon for a category
 */
export const getCategoryIcon = (category: string): IconName => {
  return categoryIcons[category] || 'code';
};

/**
 * Render icon by name with props
 */
export const renderIcon = (
  name: IconName | string,
  props?: { size?: number; className?: string; color?: string }
): React.ReactElement => {
  const IconComponent = getIcon(name);
  return <IconComponent {...props} />;
};

/**
 * Standard icon sizes
 */
export const iconSizes = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  '2xl': 40,
} as const;

export type IconSize = keyof typeof iconSizes;

/**
 * Get icon size value
 */
export const getIconSize = (size: IconSize | number): number => {
  if (typeof size === 'number') return size;
  return iconSizes[size] || iconSizes.md;
};

export default Icon;
