import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ShieldCheck, KeyRound, QrCode, Lock, ArrowRight, Bot, Sparkles } from 'lucide-react';

const HomeView = ({ setActiveTab }) => {
  const { lang, t } = useLanguage();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 60 }}>
      {/* 1. Hero Banner with Deep Gradient & Modern Border */}
      <div
        style={{
          position: 'relative',
          borderRadius: 20,
          overflow: 'hidden',
          background: 'radial-gradient(circle at 10% 20%, #1e293b 0%, #0f172a 90%)',
          color: '#FFFFFF',
          padding: '32px 28px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 12px 32px -4px rgba(0, 0, 0, 0.25)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: 14,
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 6px 16px rgba(245, 158, 11, 0.35)',
              flexShrink: 0,
            }}
          >
            <ShieldCheck color="#FFFFFF" size={32} strokeWidth={2.4} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
                {t.brand}
              </h1>
              <span
                style={{
                  fontSize: 11,
                  background: 'rgba(245, 158, 11, 0.2)',
                  color: '#fbbf24',
                  padding: '2px 8px',
                  borderRadius: 12,
                  fontWeight: 700,
                  border: '1px solid rgba(245, 158, 11, 0.4)',
                }}
              >
                PROTOTYPE 2026
              </span>
            </div>
            <p style={{ margin: '4px 0 0', color: '#fcd34d', fontSize: 13, fontWeight: 600 }}>
              {lang === 'hi' ? 'श्रमिक सशक्तिकरण और वेतन सुरक्षा तंत्र' : 'Cryptographic Wage & Labor Proof Protocol'}
            </p>
          </div>
        </div>

        <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.6, maxWidth: 580, marginBottom: 24 }}>
          {lang === 'hi'
            ? 'असंगठित क्षेत्र के कामगारों के लिए एक पारदर्शी डिजिटल बहीखाता। हर कार्य दिवस पर दोनों पक्षों की सहमति (OTP) और अपरिवर्तनीय SHA-256 सुरक्षा मुहर के साथ वेतन व श्रम का प्रमाणित रिकॉर्ड।'
            : 'An immutable proof-of-work protocol for informal daily-wage workers. Guaranteed by dual-party OTP consensus, SHA-256 ledger chaining, and verifiable income certificates.'}
        </p>

        {/* Hero Quick Action Buttons */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setActiveTab('register')}
            style={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 10,
              padding: '12px 20px',
              fontSize: 14,
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(245, 158, 11, 0.35)',
            }}
          >
            {lang === 'hi' ? 'नया खाता बनाएं' : 'Get Started (Register)'}
            <ArrowRight size={16} />
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('passbook')}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: 10,
              padding: '12px 20px',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {lang === 'hi' ? 'मेरी पासबुक देखें' : 'View Passbook'}
          </button>
        </div>
      </div>

      {/* 2. Worker Card with Flexible Layout for Mobile & Desktop */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 16,
          alignItems: 'center',
          background: '#FFFFFF',
          borderLeft: '5px solid #f59e0b',
          borderRadius: 14,
          padding: '20px 24px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
          border: '1px solid #e2e8f0',
        }}
      >
        <div
          style={{
            width: 68,
            height: 68,
            borderRadius: 14,
            background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            border: '1px solid #fcd34d',
          }}
        >
          <span style={{ fontSize: 34 }} role="img" aria-label="Worker">👷</span>
        </div>
        <div style={{ flex: 1, minWidth: 220 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: '0 0 6px' }}>
            {lang === 'hi' ? 'हमारा काम। हमारा दाम। हमारा प्रमाण।' : 'Our Work. Our Wage. Our Proof.'}
          </h3>
          <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5, margin: 0 }}>
            {lang === 'hi'
              ? 'बिना किसी कागजी पर्ची या विवाद के, अपने हर दिन की मेहनत को सुरक्षित रखें और ऋण व सरकारी योजनाओं के लिए मान्य डिजिटल प्रमाणपत्र पाएं।'
              : 'Convert informal shifts into institutional income proof acceptable by microfinance lenders, banks, and welfare boards.'}
          </p>
        </div>
      </div>

      {/* 3. Core Protocol Pillars (Responsive Grid with Badges) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        {/* Dual-Party OTP */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: 16,
            padding: 18,
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: '#dcfce7',
                  color: '#16a34a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <KeyRound size={20} />
              </div>
              <span style={{ fontSize: 10, color: '#16a34a', background: '#dcfce7', padding: '3px 8px', borderRadius: 8, fontWeight: 700 }}>
                CONSENSUS
              </span>
            </div>
            <h4 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 6px', color: '#0f172a' }}>
              {lang === 'hi' ? 'द्विपक्षीय OTP सहमति' : 'Dual-Party OTP'}
            </h4>
            <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.4, margin: 0 }}>
              {lang === 'hi'
                ? 'मज़दूर और ठेकेदार दोनों द्वारा स्वतंत्र OTP दर्ज करने पर ही शिफ्ट प्रमाणित होती है।'
                : 'Shifts lock only when both the worker and contractor confirm their respective OTPs.'}
            </p>
          </div>
        </div>

        {/* SHA-256 Ledger */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: 16,
            padding: 18,
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: '#fef3c7',
                  color: '#d97706',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Lock size={20} />
              </div>
              <span style={{ fontSize: 10, color: '#d97706', background: '#fef3c7', padding: '3px 8px', borderRadius: 8, fontWeight: 700 }}>
                IMMUTABLE
              </span>
            </div>
            <h4 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 6px', color: '#0f172a' }}>
              {lang === 'hi' ? 'अपरिवर्तनीय SHA-256' : 'SHA-256 Tamper-Proof'}
            </h4>
            <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.4, margin: 0 }}>
              {lang === 'hi'
                ? 'प्रत्येक प्रविष्टि पिछली प्रविष्टि से गणितीय रूप से जुड़ी होती है। कोई भी तारीख या वेतन नहीं बदल सकता।'
                : 'Continuous hash-chain linking prevents retroactively altering wages or dates.'}
            </p>
          </div>
        </div>

        {/* Verifiable Certificate */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: 16,
            padding: 18,
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: '#dbeafe',
                  color: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <QrCode size={20} />
              </div>
              <span style={{ fontSize: 10, color: '#2563eb', background: '#dbeafe', padding: '3px 8px', borderRadius: 8, fontWeight: 700 }}>
                BANK READY
              </span>
            </div>
            <h4 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 6px', color: '#0f172a' }}>
              {lang === 'hi' ? 'QR व PDF प्रमाणपत्र' : 'Verifiable Certificate'}
            </h4>
            <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.4, margin: 0 }}>
              {lang === 'hi'
                ? 'बैंकों और सरकारी कार्यालयों के लिए आधिकारिक मुहर युक्त आय प्रमाणपत्र डाउनलोड करें।'
                : 'Instant PDF export with embedded verification QR code for micro-loans.'}
            </p>
          </div>
        </div>

        {/* Haqdar Sahayak AI */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: 16,
            padding: 18,
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: '#f3e8ff',
                  color: '#9333ea',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Bot size={20} />
              </div>
              <span style={{ fontSize: 10, color: '#9333ea', background: '#f3e8ff', padding: '3px 8px', borderRadius: 8, fontWeight: 700 }}>
                GEMINI AI
              </span>
            </div>
            <h4 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 6px', color: '#0f172a' }}>
              {lang === 'hi' ? 'हक़दार सहायक (Voice AI)' : 'Haqdar Sahayak Voice'}
            </h4>
            <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.4, margin: 0 }}>
              {lang === 'hi'
                ? 'कम पढ़े-लिखे श्रमिकों के लिए बहुभाषी बोलकर सहायता। पेंडिंग वेतन और विवाद समाधान की जानकारी।'
                : 'Bilingual voice assistance powered by Gemini 2.5 Flash for unorganized laborers.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeView;