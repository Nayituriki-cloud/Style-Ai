import React, { useState } from 'react';
import {
  Sparkles,
  Camera,
  Shirt,
  Layers,
  Wand2,
  Calendar,
  User,
  ShoppingBag,
  MessageSquare,
  Palette,
  Database,
  Sun,
  Moon,
  Crown,
  Menu,
  X,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { useApp, AppView } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    user,
    logout,
    theme,
    toggleTheme,
    setProModalOpen,
    setAuthModalOpen,
    demoLogin,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navItems: { view: AppView; label: string; icon: React.ReactNode }[] = [
    { view: 'home', label: 'Home', icon: <Sparkles className="w-4 h-4" /> },
    { view: 'advisor', label: 'AI Stylist', icon: <Wand2 className="w-4 h-4" /> },
    { view: 'wardrobe', label: 'My Wardrobe', icon: <Shirt className="w-4 h-4" /> },
    { view: 'builder', label: 'Outfit Builder', icon: <Layers className="w-4 h-4" /> },
    { view: 'generator', label: 'Generate Outfit', icon: <Sparkles className="w-4 h-4" /> },
    { view: 'analysis', label: 'Photo Analysis', icon: <Camera className="w-4 h-4" /> },
    { view: 'colors', label: 'Color Engine', icon: <Palette className="w-4 h-4" /> },
    { view: 'calendar', label: 'Calendar', icon: <Calendar className="w-4 h-4" /> },
    { view: 'shopping', label: 'Shopping', icon: <ShoppingBag className="w-4 h-4" /> },
    { view: 'chat', label: 'Ask AI', icon: <MessageSquare className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-stone-50/90 dark:bg-stone-950/90 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => setCurrentView('home')}
              className="group flex items-center gap-2.5 text-left focus:outline-none"
            >
              <div className="w-9 h-9 rounded-sm bg-stone-900 dark:bg-stone-100 flex items-center justify-center text-stone-100 dark:text-stone-900 font-serif font-bold text-lg tracking-wider transition-transform group-hover:scale-105">
                S
              </div>
              <div>
                <span className="font-serif font-bold text-xl tracking-tight text-stone-900 dark:text-stone-100">
                  STYLE AI
                </span>
                <span className="hidden sm:block text-[10px] tracking-widest uppercase text-stone-500 font-medium">
                  Atelier & Wardrobe
                </span>
              </div>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navItems.map((item) => {
                const isActive = currentView === item.view;
                return (
                  <button
                    key={item.view}
                    onClick={() => setCurrentView(item.view)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 shadow-xs'
                        : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-200/50 dark:hover:bg-stone-900'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Pro Button / Badge */}
            {user?.isPro ? (
              <button
                onClick={() => setProModalOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold tracking-wider uppercase bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800 rounded-md hover:bg-amber-200/70 transition-colors"
              >
                <Crown className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>PRO</span>
              </button>
            ) : (
              <button
                onClick={() => setProModalOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-md hover:from-amber-700 hover:to-amber-800 transition-colors shadow-xs"
              >
                <Crown className="w-3.5 h-3.5" />
                <span>Get Pro</span>
              </button>
            )}

            {/* DB Schema Explorer Button */}
            <button
              onClick={() => setCurrentView('schema')}
              title="Database Schema & Architecture"
              className={`p-2 rounded-md transition-colors ${
                currentView === 'schema'
                  ? 'bg-stone-200 dark:bg-stone-800 text-stone-900 dark:text-stone-100'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-900'
              }`}
            >
              <Database className="w-4 h-4" />
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
              className="p-2 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-900 rounded-md transition-colors"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {/* User Profile Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1 pl-2 rounded-full border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-900 transition-colors"
                >
                  <span className="hidden md:block text-xs font-medium text-stone-700 dark:text-stone-300 max-w-[100px] truncate">
                    {user.name}
                  </span>
                  <img
                    src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover border border-stone-300 dark:border-stone-700"
                  />
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                </button>

                {profileDropdownOpen && (
                  <div
                    onClick={() => setProfileDropdownOpen(false)}
                    className="absolute right-0 mt-2 w-52 bg-white dark:bg-stone-900 rounded-lg shadow-lg border border-stone-200 dark:border-stone-800 py-1.5 z-50 text-xs"
                  >
                    <div className="px-3 py-2 border-b border-stone-100 dark:border-stone-800">
                      <p className="font-semibold text-stone-900 dark:text-stone-100 truncate">{user.name}</p>
                      <p className="text-stone-500 dark:text-stone-400 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => setCurrentView('profile')}
                      className="w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300"
                    >
                      <User className="w-4 h-4 text-stone-400" />
                      <span>My Style Profile</span>
                    </button>
                    <button
                      onClick={() => setProModalOpen(true)}
                      className="w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300"
                    >
                      <Crown className="w-4 h-4 text-amber-500" />
                      <span>STYLE AI Pro</span>
                    </button>
                    <div className="border-t border-stone-100 dark:border-stone-800 my-1"></div>
                    <button
                      onClick={logout}
                      className="w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={demoLogin}
                  className="px-2.5 py-1.5 text-xs font-medium text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 border border-stone-200 dark:border-stone-800 rounded-md hover:bg-stone-100 dark:hover:bg-stone-900 transition-colors"
                >
                  Demo Mode
                </button>
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="px-3 py-1.5 text-xs font-medium bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 rounded-md hover:opacity-90 transition-opacity"
                >
                  Sign In
                </button>
              </div>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 px-4 pt-3 pb-6 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => {
                setCurrentView(item.view);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                currentView === item.view
                  ? 'bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900'
                  : 'text-stone-700 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-900'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
          <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
            <button
              onClick={() => {
                setCurrentView('schema');
                setMobileMenuOpen(false);
              }}
              className="text-xs text-stone-600 dark:text-stone-400 flex items-center gap-1.5"
            >
              <Database className="w-4 h-4" />
              <span>Database Architecture</span>
            </button>
            <button
              onClick={() => {
                setProModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1"
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Style AI Pro</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
