import React from 'react';
import { Sparkles, Wand2, Shirt, Layers, MessageSquare } from 'lucide-react';
import { useApp, AppView } from '../context/AppContext';

export const MobileNav: React.FC = () => {
  const { currentView, setCurrentView } = useApp();

  const items: { view: AppView; label: string; icon: React.ReactNode }[] = [
    { view: 'home', label: 'Home', icon: <Sparkles className="w-5 h-5" /> },
    { view: 'advisor', label: 'Advisor', icon: <Wand2 className="w-5 h-5" /> },
    { view: 'wardrobe', label: 'Wardrobe', icon: <Shirt className="w-5 h-5" /> },
    { view: 'builder', label: 'Builder', icon: <Layers className="w-5 h-5" /> },
    { view: 'chat', label: 'Ask AI', icon: <MessageSquare className="w-5 h-5" /> },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-stone-50/95 dark:bg-stone-950/95 backdrop-blur-md border-t border-stone-200 dark:border-stone-800 pb-safe">
      <div className="grid grid-cols-5 h-14">
        {items.map((item) => {
          const isActive = currentView === item.view;
          return (
            <button
              key={item.view}
              onClick={() => setCurrentView(item.view)}
              className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                isActive
                  ? 'text-stone-900 dark:text-stone-100 font-semibold'
                  : 'text-stone-400 hover:text-stone-700 dark:hover:text-stone-300'
              }`}
            >
              {item.icon}
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
