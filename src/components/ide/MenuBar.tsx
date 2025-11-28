import React, { useState } from 'react';
import {
  ChevronLeft, ChevronRight, Search, Settings, User,
  Minimize, Maximize, X as CloseIcon
} from 'lucide-react';

interface MenuBarProps {
  onMinimize?: () => void;
  onMaximize?: () => void;
  onClose?: () => void;
}

const MenuBar: React.FC<MenuBarProps> = ({ onMinimize, onMaximize, onClose }) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [searchFocused, setSearchFocused] = useState(false);

  const menus = [
    {
      label: 'File',
      items: [
        { label: 'New File', shortcut: 'Ctrl+N' },
        { label: 'Open File', shortcut: 'Ctrl+O' },
        { label: 'Open Folder', shortcut: 'Ctrl+K Ctrl+O' },
        { label: 'Save', shortcut: 'Ctrl+S' },
        { label: 'Save As', shortcut: 'Ctrl+Shift+S' },
        { divider: true },
        { label: 'Close Editor', shortcut: 'Ctrl+W' },
        { label: 'Close Folder', shortcut: 'Ctrl+K F' },
      ],
    },
    {
      label: 'Edit',
      items: [
        { label: 'Undo', shortcut: 'Ctrl+Z' },
        { label: 'Redo', shortcut: 'Ctrl+Y' },
        { divider: true },
        { label: 'Cut', shortcut: 'Ctrl+X' },
        { label: 'Copy', shortcut: 'Ctrl+C' },
        { label: 'Paste', shortcut: 'Ctrl+V' },
        { divider: true },
        { label: 'Find', shortcut: 'Ctrl+F' },
        { label: 'Replace', shortcut: 'Ctrl+H' },
      ],
    },
    {
      label: 'Selection',
      items: [
        { label: 'Select All', shortcut: 'Ctrl+A' },
        { label: 'Expand Selection', shortcut: 'Shift+Alt+Right' },
        { label: 'Shrink Selection', shortcut: 'Shift+Alt+Left' },
        { divider: true },
        { label: 'Add Cursor Above', shortcut: 'Ctrl+Alt+Up' },
        { label: 'Add Cursor Below', shortcut: 'Ctrl+Alt+Down' },
      ],
    },
    {
      label: 'View',
      items: [
        { label: 'Command Palette', shortcut: 'Ctrl+Shift+P' },
        { label: 'Open View', shortcut: 'Ctrl+Q' },
        { divider: true },
        { label: 'Explorer', shortcut: 'Ctrl+Shift+E' },
        { label: 'Search', shortcut: 'Ctrl+Shift+F' },
        { label: 'Terminal', shortcut: 'Ctrl+`' },
        { divider: true },
        { label: 'Toggle Sidebar', shortcut: 'Ctrl+B' },
        { label: 'Toggle Panel', shortcut: 'Ctrl+J' },
      ],
    },
    {
      label: 'Go',
      items: [
        { label: 'Go to File', shortcut: 'Ctrl+P' },
        { label: 'Go to Symbol', shortcut: 'Ctrl+Shift+O' },
        { label: 'Go to Line', shortcut: 'Ctrl+G' },
        { divider: true },
        { label: 'Back', shortcut: 'Alt+Left' },
        { label: 'Forward', shortcut: 'Alt+Right' },
      ],
    },
    {
      label: 'Run',
      items: [
        { label: 'Start Debugging', shortcut: 'F5' },
        { label: 'Run Without Debugging', shortcut: 'Ctrl+F5' },
        { label: 'Stop Debugging', shortcut: 'Shift+F5' },
        { divider: true },
        { label: 'Build', shortcut: 'Ctrl+Shift+B' },
        { label: 'Test', shortcut: 'Ctrl+Shift+T' },
      ],
    },
    {
      label: 'Terminal',
      items: [
        { label: 'New Terminal', shortcut: 'Ctrl+Shift+`' },
        { label: 'Split Terminal', shortcut: 'Ctrl+Shift+5' },
        { divider: true },
        { label: 'Kill Terminal', shortcut: '' },
        { label: 'Clear Terminal', shortcut: '' },
      ],
    },
    {
      label: 'Help',
      items: [
        { label: 'Welcome' },
        { label: 'Documentation' },
        { label: 'Show All Commands', shortcut: 'Ctrl+Shift+P' },
        { divider: true },
        { label: 'About Sui Studio' },
      ],
    },
  ];

  const handleMenuClick = (label: string) => {
    setActiveMenu(activeMenu === label ? null : label);
  };

  const handleMenuItemClick = (item: any) => {
    console.log('Menu item clicked:', item.label);
    setActiveMenu(null);

    // Handle menu actions
    switch (item.label) {
      case 'New File':
        document.dispatchEvent(new CustomEvent('ide:newFile'));
        break;
      case 'Save':
        document.dispatchEvent(new CustomEvent('ide:save'));
        break;
      case 'Find':
        document.dispatchEvent(new CustomEvent('ide:find'));
        break;
      case 'Command Palette':
        document.dispatchEvent(new CustomEvent('ide:commandPalette'));
        break;
      case 'Toggle Sidebar':
        document.dispatchEvent(new CustomEvent('ide:toggleSidebar'));
        break;
      case 'Toggle Panel':
        document.dispatchEvent(new CustomEvent('ide:togglePanel'));
        break;
      case 'Build':
        document.dispatchEvent(new CustomEvent('ide:build'));
        break;
      case 'Test':
        document.dispatchEvent(new CustomEvent('ide:test'));
        break;
      default:
        console.log('Action not implemented:', item.label);
    }
  };

  return (
    <div className="h-9 bg-walrus-dark-950 border-b border-walrus-dark-600 flex items-center justify-between px-2 relative z-50">
      {/* Left Section - Logo & Menus */}
      <div className="flex items-center gap-1">
        {/* Logo */}
        <div className="flex items-center gap-2 px-2 mr-2">
          <div className="w-5 h-5 bg-walrus-cyan/10 rounded flex items-center justify-center border border-walrus-cyan/30">
            <img
              src="https://res.cloudinary.com/dwiewdn6f/image/upload/v1763580906/sui-sui-logo_gmux9g.png"
              alt="Sui"
              className="w-3 h-3 object-contain"
            />
          </div>
        </div>

        {/* Menu Items */}
        {menus.map((menu) => (
          <div key={menu.label} className="relative">
            <button
              onClick={() => handleMenuClick(menu.label)}
              className={`px-3 py-1 text-xs font-medium transition-all rounded ${activeMenu === menu.label
                  ? 'bg-walrus-cyan/10 text-walrus-cyan'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
            >
              {menu.label}
            </button>

            {/* Dropdown Menu */}
            {activeMenu === menu.label && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setActiveMenu(null)}
                />

                {/* Menu Dropdown */}
                <div className="absolute top-full left-0 mt-1 w-64 bg-walrus-dark-800 border border-walrus-dark-600 rounded-lg shadow-glass py-1 z-50 backdrop-blur-xl">
                  {menu.items.map((item, index) => (
                    item.divider ? (
                      <div key={index} className="h-px bg-white/5 my-1" />
                    ) : (
                      <button
                        key={index}
                        onClick={() => handleMenuItemClick(item)}
                        className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                      >
                        <span className="font-medium">{item.label}</span>
                        {item.shortcut && (
                          <span className="text-xs text-gray-500 font-mono">
                            {item.shortcut}
                          </span>
                        )}
                      </button>
                    )
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Center Section - Navigation & Search */}
      <div className="flex items-center gap-2 flex-1 max-w-xl mx-4">
        {/* Navigation Arrows */}
        <div className="flex items-center gap-1">
          <button className="p-1 text-gray-500 hover:text-white hover:bg-white/5 rounded transition-all">
            <ChevronLeft size={16} />
          </button>
          <button className="p-1 text-gray-500 hover:text-white hover:bg-white/5 rounded transition-all">
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Search Bar */}
        <div className={`flex-1 flex items-center gap-2 px-3 py-1 bg-walrus-dark-900 rounded-lg border transition-all ${searchFocused
            ? 'border-walrus-cyan/50 shadow-neon'
            : 'border-walrus-dark-600'
          }`}>
          <Search size={14} className="text-gray-500" />
          <input
            type="text"
            placeholder="sui-studio"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 outline-none font-tech"
          />
          <kbd className="px-1.5 py-0.5 text-xs bg-walrus-dark-800 border border-white/10 rounded text-gray-500 font-mono">
            Ctrl+P
          </kbd>
        </div>
      </div>

      {/* Right Section - Window Controls */}
      <div className="flex items-center gap-1">
        {/* Settings */}
        <button className="p-1.5 text-gray-500 hover:text-white hover:bg-white/5 rounded transition-all">
          <Settings size={16} />
        </button>

        {/* User */}
        <button className="p-1.5 text-gray-500 hover:text-white hover:bg-white/5 rounded transition-all">
          <User size={16} />
        </button>

        <div className="w-px h-4 bg-white/10 mx-1" />

        {/* Window Controls */}
        <button
          onClick={onMinimize}
          className="p-1.5 text-gray-500 hover:text-white hover:bg-white/10 rounded transition-all"
        >
          <Minimize size={14} />
        </button>
        <button
          onClick={onMaximize}
          className="p-1.5 text-gray-500 hover:text-white hover:bg-white/10 rounded transition-all"
        >
          <Maximize size={14} />
        </button>
        <button
          onClick={onClose}
          className="p-1.5 text-gray-500 hover:text-white hover:bg-red-500/20 rounded transition-all"
        >
          <CloseIcon size={14} />
        </button>
      </div>
    </div>
  );
};

export default MenuBar;
