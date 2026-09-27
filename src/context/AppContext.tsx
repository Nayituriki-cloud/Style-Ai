import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  StyleProfile,
  WardrobeItem,
  Outfit,
  OutfitCalendarEntry,
  ChatMessage,
  BudgetLevel,
  OccasionType,
} from '../types/database';
import {
  DEMO_PROFILE,
  INITIAL_WARDROBE,
  INITIAL_OUTFITS,
  INITIAL_CALENDAR,
} from '../data/demoData';

export type AppView =
  | 'home'
  | 'advisor'
  | 'analysis'
  | 'wardrobe'
  | 'builder'
  | 'generator'
  | 'colors'
  | 'calendar'
  | 'profile'
  | 'chat'
  | 'shopping'
  | 'schema';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface AppContextType {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string) => void;
  demoLogin: () => void;
  logout: () => void;
  styleProfile: StyleProfile;
  updateStyleProfile: (profile: Partial<StyleProfile>) => void;
  wardrobe: WardrobeItem[];
  addWardrobeItem: (item: Omit<WardrobeItem, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'timesWorn'>) => void;
  updateWardrobeItem: (id: string, updates: Partial<WardrobeItem>) => void;
  deleteWardrobeItem: (id: string) => void;
  toggleFavoriteItem: (id: string) => void;
  outfits: Outfit[];
  addOutfit: (outfit: Omit<Outfit, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
  deleteOutfit: (id: string) => void;
  toggleFavoriteOutfit: (id: string) => void;
  calendar: OutfitCalendarEntry[];
  assignToCalendar: (
    dayOfWeek: OutfitCalendarEntry['dayOfWeek'],
    dateString: string,
    outfitId: string,
    occasion: OccasionType,
    notes?: string
  ) => void;
  removeFromCalendar: (id: string) => void;
  toggleCalendarWorn: (id: string) => void;
  chatMessages: ChatMessage[];
  addChatMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  budgetFilter: BudgetLevel | 'All';
  setBudgetFilter: (b: BudgetLevel | 'All') => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  proModalOpen: boolean;
  setProModalOpen: (open: boolean) => void;
  activateProSubscription: () => void;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEMO_USER: User = {
  id: 'usr_demo_01',
  email: 'emmanuel@styleai.studio',
  name: 'Emmanuel Nayituriki',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  isPro: true,
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-03-26T00:00:00Z',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // View State
  const [currentView, setCurrentView] = useState<AppView>('home');

  // Auth State
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('styleai_user');
    return saved ? JSON.parse(saved) : DEMO_USER;
  });

  // Style Profile
  const [styleProfile, setStyleProfile] = useState<StyleProfile>(() => {
    const saved = localStorage.getItem('styleai_profile');
    return saved ? JSON.parse(saved) : DEMO_PROFILE;
  });

  // Wardrobe Items
  const [wardrobe, setWardrobe] = useState<WardrobeItem[]>(() => {
    const saved = localStorage.getItem('styleai_wardrobe');
    return saved ? JSON.parse(saved) : INITIAL_WARDROBE;
  });

  // Outfits
  const [outfits, setOutfits] = useState<Outfit[]>(() => {
    const saved = localStorage.getItem('styleai_outfits');
    return saved ? JSON.parse(saved) : INITIAL_OUTFITS;
  });

  // Calendar
  const [calendar, setCalendar] = useState<OutfitCalendarEntry[]>(() => {
    const saved = localStorage.getItem('styleai_calendar');
    return saved ? JSON.parse(saved) : INITIAL_CALENDAR;
  });

  // Chat
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('styleai_chat');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'chat_welcome',
            role: 'assistant',
            content: "Welcome to STYLE AI! I'm your dedicated personal fashion advisor. Ask me anything about outfit coordination, dress codes, color theory, or what to wear with pieces in your wardrobe!",
            timestamp: new Date().toISOString(),
            suggestedPrompts: [
              'How should I dress for a job interview?',
              'What can I wear with black jeans?',
              'Create an outfit using clothes in my wardrobe',
              'Which shoes match my navy single-pleat trousers?',
            ],
          },
        ];
  });

  // Budget Filter
  const [budgetFilter, setBudgetFilter] = useState<BudgetLevel | 'All'>('All');

  // Theme
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('styleai_theme');
    return (saved as 'light' | 'dark') || 'light';
  });

  // Modals & Toasts
  const [proModalOpen, setProModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync to localStorage
  useEffect(() => {
    if (user) localStorage.setItem('styleai_user', JSON.stringify(user));
    else localStorage.removeItem('styleai_user');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('styleai_profile', JSON.stringify(styleProfile));
  }, [styleProfile]);

  useEffect(() => {
    localStorage.setItem('styleai_wardrobe', JSON.stringify(wardrobe));
  }, [wardrobe]);

  useEffect(() => {
    localStorage.setItem('styleai_outfits', JSON.stringify(outfits));
  }, [outfits]);

  useEffect(() => {
    localStorage.setItem('styleai_calendar', JSON.stringify(calendar));
  }, [calendar]);

  useEffect(() => {
    localStorage.setItem('styleai_chat', JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    localStorage.setItem('styleai_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const login = (email: string) => {
    const newUser: User = {
      id: 'usr_' + Math.random().toString(36).substring(2, 7),
      email,
      name: email.split('@')[0],
      isPro: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setUser(newUser);
    setAuthModalOpen(false);
    showToast(`Signed in as ${newUser.name}`);
  };

  const demoLogin = () => {
    setUser(DEMO_USER);
    setAuthModalOpen(false);
    showToast('Loaded Demo Account with full Wardrobe & Pro features!');
  };

  const logout = () => {
    setUser(null);
    showToast('Signed out successfully', 'info');
  };

  const updateStyleProfile = (updates: Partial<StyleProfile>) => {
    setStyleProfile((prev) => ({
      ...prev,
      ...updates,
      updatedAt: new Date().toISOString(),
    }));
    showToast('Style Profile updated');
  };

  const addWardrobeItem = (
    itemData: Omit<WardrobeItem, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'timesWorn'>
  ) => {
    const newItem: WardrobeItem = {
      ...itemData,
      id: 'w_' + Math.random().toString(36).substring(2, 9),
      userId: user?.id || 'guest',
      timesWorn: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setWardrobe((prev) => [newItem, ...prev]);
    showToast(`Added "${newItem.name}" to your Wardrobe`);
  };

  const updateWardrobeItem = (id: string, updates: Partial<WardrobeItem>) => {
    setWardrobe((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item))
    );
    showToast('Wardrobe item updated');
  };

  const deleteWardrobeItem = (id: string) => {
    setWardrobe((prev) => prev.filter((item) => item.id !== id));
    showToast('Item removed from wardrobe', 'info');
  };

  const toggleFavoriteItem = (id: string) => {
    setWardrobe((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isFavorite: !item.isFavorite } : item))
    );
  };

  const addOutfit = (outfitData: Omit<Outfit, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    const newOutfit: Outfit = {
      ...outfitData,
      id: 'outfit_' + Math.random().toString(36).substring(2, 9),
      userId: user?.id || 'guest',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setOutfits((prev) => [newOutfit, ...prev]);
    showToast(`Saved look: "${newOutfit.title}"`);
  };

  const deleteOutfit = (id: string) => {
    setOutfits((prev) => prev.filter((o) => o.id !== id));
    showToast('Outfit removed', 'info');
  };

  const toggleFavoriteOutfit = (id: string) => {
    setOutfits((prev) =>
      prev.map((o) => (o.id === id ? { ...o, isFavorite: !o.isFavorite } : o))
    );
  };

  const assignToCalendar = (
    dayOfWeek: OutfitCalendarEntry['dayOfWeek'],
    dateString: string,
    outfitId: string,
    occasion: OccasionType,
    notes?: string
  ) => {
    const newEntry: OutfitCalendarEntry = {
      id: 'cal_' + Math.random().toString(36).substring(2, 9),
      userId: user?.id || 'guest',
      dayOfWeek,
      dateString,
      outfitId,
      occasion,
      notes,
      isWorn: false,
      createdAt: new Date().toISOString(),
    };
    // Replace if same day
    setCalendar((prev) => [...prev.filter((e) => e.dateString !== dateString), newEntry]);
    showToast(`Outfit scheduled for ${dayOfWeek}`);
  };

  const removeFromCalendar = (id: string) => {
    setCalendar((prev) => prev.filter((e) => e.id !== id));
    showToast('Outfit unassigned from calendar', 'info');
  };

  const toggleCalendarWorn = (id: string) => {
    setCalendar((prev) =>
      prev.map((e) => (e.id === id ? { ...e, isWorn: !e.isWorn } : e))
    );
  };

  const addChatMessage = (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMsg: ChatMessage = {
      ...msg,
      id: 'chat_' + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString(),
    };
    setChatMessages((prev) => [...prev, newMsg]);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const activateProSubscription = () => {
    if (user) {
      setUser({ ...user, isPro: true });
    }
    setProModalOpen(false);
    showToast('Welcome to STYLE AI PRO! All premium styling features unlocked.');
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        user,
        isAuthenticated: !!user,
        login,
        demoLogin,
        logout,
        styleProfile,
        updateStyleProfile,
        wardrobe,
        addWardrobeItem,
        updateWardrobeItem,
        deleteWardrobeItem,
        toggleFavoriteItem,
        outfits,
        addOutfit,
        deleteOutfit,
        toggleFavoriteOutfit,
        calendar,
        assignToCalendar,
        removeFromCalendar,
        toggleCalendarWorn,
        chatMessages,
        addChatMessage,
        budgetFilter,
        setBudgetFilter,
        theme,
        toggleTheme,
        proModalOpen,
        setProModalOpen,
        activateProSubscription,
        authModalOpen,
        setAuthModalOpen,
        toasts,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
