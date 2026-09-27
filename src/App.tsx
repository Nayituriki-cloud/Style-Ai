/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { MobileNav } from './components/MobileNav';
import { HomeView } from './components/HomeView';
import { AdvisorView } from './components/AdvisorView';
import { PhotoAnalysisView } from './components/PhotoAnalysisView';
import { WardrobeView } from './components/WardrobeView';
import { OutfitBuilderView } from './components/OutfitBuilderView';
import { OutfitGeneratorView } from './components/OutfitGeneratorView';
import { ColorMatchingView } from './components/ColorMatchingView';
import { OutfitCalendarView } from './components/OutfitCalendarView';
import { StyleProfileView } from './components/StyleProfileView';
import { ChatAssistantView } from './components/ChatAssistantView';
import { ShoppingView } from './components/ShoppingView';
import { DatabaseSchemaView } from './components/DatabaseSchemaView';
import { ProModal } from './components/ProModal';
import { AuthModal } from './components/AuthModal';
import { ToastContainer } from './components/ToastContainer';

const MainContent: React.FC = () => {
  const { currentView } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans selection:bg-amber-200 selection:text-stone-900 transition-colors duration-200">
      <Navbar />

      <main className="flex-1 pb-16 lg:pb-0">
        {currentView === 'home' && <HomeView />}
        {currentView === 'advisor' && <AdvisorView />}
        {currentView === 'analysis' && <PhotoAnalysisView />}
        {currentView === 'wardrobe' && <WardrobeView />}
        {currentView === 'builder' && <OutfitBuilderView />}
        {currentView === 'generator' && <OutfitGeneratorView />}
        {currentView === 'colors' && <ColorMatchingView />}
        {currentView === 'calendar' && <OutfitCalendarView />}
        {currentView === 'profile' && <StyleProfileView />}
        {currentView === 'chat' && <ChatAssistantView />}
        {currentView === 'shopping' && <ShoppingView />}
        {currentView === 'schema' && <DatabaseSchemaView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 dark:border-stone-800 py-8 px-4 sm:px-6 lg:px-8 text-xs text-stone-500 bg-stone-100/60 dark:bg-stone-950">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-stone-900 dark:text-stone-100 tracking-tight">STYLE AI</span>
            <span aria-hidden="true">·</span>
            <span>Personal AI Fashion Stylist & Digital Wardrobe</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Powered by Gemini 3.8</span>
            <span aria-hidden="true">·</span>
            <span>WCAG AA Accessible</span>
            <span aria-hidden="true">·</span>
            <span>AI Safety Guaranteed</span>
          </div>
        </div>
      </footer>

      <MobileNav />
      <ProModal />
      <AuthModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
