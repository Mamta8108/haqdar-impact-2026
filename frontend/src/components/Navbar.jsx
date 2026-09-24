import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ShieldCheck, Languages } from 'lucide-react';

const Navbar = ({ activeTab, setActiveTab }) => {
  const { lang, toggleLang, t } = useLanguage();

  const navItems = [
    { id: 'home', label: lang === 'hi' ? 'मुख्य पृष्ठ' : 'Home' },
    { id: 'register', label: lang === 'hi' ? 'खाता' : 'Register' },
    { id: 'log', label: lang === 'hi' ? 'काम दर्ज' : 'Log Work' },
    { id: 'passbook', label: lang === 'hi' ? 'पासबुक' : 'Passbook' },
    { id: 'cert', label: lang === 'hi' ? 'प्रमाणपत्र' : 'Certificate' },
    { id: 'verify', label: lang === 'hi' ? 'जाँच' : 'Verify' },
  ];

  return (
    <header
      style={{
        background: '#0f172a',
        color: '#FFFFFF',
        padding: '12px 16px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
      }}
    >
      <div
        style={{
          maxWidth: 760,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        {/* Brand Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div
            onClick={() => setActiveTab('home')}
            style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.35)',
                flexShrink: 0,
              }}
            >
              <ShieldCheck color="#FFFFFF" size={24} strokeWidth={2.4} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 18, lineHeight: 1.2, letterSpacing: '-0.01em' }}>
                {t.brand}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: '#94a3b8',
                  letterSpacing: '0.01em',
                  marginTop: 2,
                }}
              >
                {t.tagline}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={toggleLang}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#f8fafc',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: 20,
              padding: '6px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <Languages size={15} color="#fbbf24" />
            {lang === 'hi' ? 'English' : 'हिन्दी'}
          </button>
        </div>

        {/* Tab Navigation Pill Bar with Smooth Horizontal Overflow */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '4px',
            borderRadius: 12,
            gap: 4,
            overflowX: 'auto',
            scrollbarWidth: 'none', // Firefox
            msOverflowStyle: 'none', // IE/Edge
          }}
        >
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                style={{
                  flex: '1 0 auto',
                  background: isActive
                    ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                    : 'transparent',
                  color: isActive ? '#FFFFFF' : '#94a3b8',
                  border: 'none',
                  borderRadius: 8,
                  padding: '8px 12px',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: 12,
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease-in-out',
                  whiteSpace: 'nowrap',
                  boxShadow: isActive ? '0 2px 8px rgba(245, 158, 11, 0.3)' : 'none',
                }}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;