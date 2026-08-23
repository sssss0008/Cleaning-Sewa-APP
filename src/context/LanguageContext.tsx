import React, { createContext, useContext, useState, useMemo } from 'react';

type Language = 'EN' | 'NP';

interface Translations {
  [key: string]: {
    EN: string;
    NP: string;
  };
}

export const translations: Translations = {
  home: { EN: 'Home', NP: 'होम' },
  services: { EN: 'Services', NP: 'सेवाहरू' },
  book: { EN: 'Book', NP: 'बुकिङ' },
  about: { EN: 'About', NP: 'हाम्रो बारेमा' },
  contact: { EN: 'Contact', NP: 'सम्पर्क' },
  my_bookings: { EN: 'My Bookings', NP: 'मेरो बुकिङहरू' },
  pro_dashboard: { EN: 'Pro Dashboard', NP: 'प्रो ड्यासबोर्ड' },
  become_partner: { EN: 'Become a Partner', NP: 'साझेदार बन्नुहोस्' },
  join_pro: { EN: 'Join as a Professional', NP: 'प्रोफेशनल बन्नुहोस्' },
  faqs: { EN: 'FAQs', NP: 'जिज्ञासाहरू' },
  glossary: { EN: 'Glossary', NP: 'शब्दकोश' },
  privacy: { EN: 'Privacy Policy', NP: 'गोपनीयता नीति' },
  refund: { EN: 'Refund Policy', NP: 'फिर्ता नीति' },
  admin_login: { EN: 'Admin Login', NP: 'एडमिन लगइन' },
  professional_cleaning: { EN: 'Professional Cleaning', NP: 'व्यावसायिक सफाई' },
  trained_pro: { EN: 'Trained Professional', NP: 'तालिमप्राप्त कर्मचारी' },
  direct_payment: { EN: 'Direct Payment', NP: 'प्रत्यक्ष भुक्तानी' },
  next: { EN: 'Next', NP: 'अर्को' },
  get_started: { EN: 'Get Started', NP: 'सुरु गरौं' },
  skip: { EN: 'SKIP', NP: 'छोड्नुहोस्' },
  get_call: { EN: 'Get Call', NP: 'कल पाउनुहोस्' },
  top_services: { EN: 'Top Services', NP: 'उत्कृष्ट सेवाहरू' },
  trending_services: { EN: 'Trending Services', NP: 'लोकप्रिय सेवाहरू' },
  see_all: { EN: 'See All', NP: 'सबै हेर्नुहोस्' },
  search_placeholder: { EN: 'Search for a service...', NP: 'सेवा खोजनुहोस्...' },
};

interface LanguageContextType {
  language: Language;
  t: (key: string) => string;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('EN');

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'EN' ? 'NP' : 'EN'));
  };

  const t = (key: string) => {
    return translations[key]?.[language] || key;
  };

  const value = useMemo(() => ({ language, t, toggleLanguage }), [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// FIXED: Renamed export to useLanguage to match UI calls
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
