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
    <div className="h-10 bg-transparent flex items-center justify-between px-4 relative z-50 select-none">
      {/* Left Section - Logo & Menus */}
      <div className="flex items-center gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-walrus-cyan to-walrus-purple rounded-lg flex items-center justify-center shadow-neon-sm">
            <img
              src="https://res.cloudinary.com/dwiewdn6f/image/upload/v1765140543/Logo_-_Cloud-removebg-preview_obkvso.png"
              alt="Sui Studio"
              className="w-5 h-5 object-contain"
            />
          </div>
          <span className="font-bold text-gray-200 tracking-wide font-display text-sm">Sui Studio</span>
        </div>

        <div className="w-px h-4 bg-white/10 mx-2" />

        {/* Menu Items */}
        <div className="flex items-center">
          {menus.map((menu) => (
            <div key={menu.label} className="relative">
              <button
                onClick={() => handleMenuClick(menu.label)}
                className={`px-3 py-1.5 text-xs font-medium transition-all rounded-lg ${activeMenu === menu.label
                  ? 'bg-white/10 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                {menu.label}
              </button>

              {/* Dropdown Menu */}
              {activeMenu === menu.label && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setActiveMenu(null)}
                  />
                  <div className="absolute top-full left-0 mt-2 w-64 bg-walrus-dark-900/95 border border-white/10 rounded-xl shadow-premium py-1 z-50 backdrop-blur-xl ring-1 ring-black/50">
                    {menu.items.map((item, index) => (
                      item.divider ? (
                        <div key={index} className="h-px bg-white/5 my-1 mx-2" />
                      ) : (
                        <button
                          key={index}
                          onClick={() => handleMenuItemClick(item)}
                          className="w-full flex items-center justify-between px-4 py-2 text-xs text-gray-300 hover:text-white hover:bg-walrus-cyan/10 transition-all group"
                        >
                          <span className="font-medium group-hover:translate-x-1 transition-transform">{item.label}</span>
                          {item.shortcut && (
                            <span className="text-[10px] text-gray-600 font-mono group-hover:text-walrus-cyan/70">
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
      </div>

      {/* Center Section - Search */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-md w-full px-4">
        <div className={`flex items-center gap-2 px-3 py-1.5 bg-walrus-dark-800/50 rounded-xl border transition-all duration-300 ${searchFocused
          ? 'border-walrus-cyan/30 shadow-neon-sm bg-walrus-dark-900'
          : 'border-white/5 hover:border-white/10'
          }`}>
          <Search size={14} className={`transition-colors ${searchFocused ? 'text-walrus-cyan' : 'text-gray-600'}`} />
          <input
            type="text"
            placeholder="Search files, commands, symbols..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="flex-1 bg-transparent text-xs text-gray-200 placeholder-gray-600 outline-none font-medium"
          />
          <kbd className="px-1.5 py-0.5 text-[10px] bg-white/5 border border-white/5 rounded-md text-gray-500 font-mono">
            ⌘P
          </kbd>
        </div>
      </div>

      {/* Right Section - Window Controls */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 opacity-60 hover:opacity-100 transition-opacity">
          {/* Avatar / User */}
          <button className="w-7 h-7 rounded-full bg-gradient-to-tr from-walrus-cyan to-walrus-purple p-[1px]">
            <div className="w-full h-full rounded-full bg-walrus-dark-950 flex items-center justify-center">
              <User size={14} className="text-gray-400" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuBar;
