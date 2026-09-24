import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { registerUser } from '../services/api';
import { UserPlus, CheckCircle2, ArrowRight } from 'lucide-react';

const RegisterForm = ({ onUserAdded, setActiveTab }) => {
  const { t } = useLanguage();
  const [role, setRole] = useState('worker');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [msg, setMsg] = useState('');
  const [createdUser, setCreatedUser] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !phone) return;
    try {
      await registerUser({ name, phone, role, businessName });
      
      // Store the submitted details before resetting the inputs
      setCreatedUser({
        name,
        phone,
        role,
        businessName: role === 'employer' ? businessName : null
      });

      setMsg(role === 'worker' ? '✓ श्रमिक खाता सफलतापूर्वक बन गया!' : '✓ ठेकेदार खाता सफलतापूर्वक बन गया!');
      setName('');
      setPhone('');
      setBusinessName('');
      if (onUserAdded) onUserAdded();
    } catch (err) {
      setCreatedUser(null);
      setMsg('✗ ' + (err.response?.data?.message || 'Error creating account'));
    }
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        <button
          type="button"
          onClick={() => { setRole('worker'); setCreatedUser(null); setMsg(''); }}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: 8,
            border: 'none',
            background: role === 'worker' ? '#1F2E4A' : '#E5E7EB',
            color: role === 'worker' ? '#FFF' : '#374151',
            fontWeight: 600,
            fontSize: 14,
            cursor: 'pointer'
          }}
        >
          {t.worker}
        </button>
        <button
          type="button"
          onClick={() => { setRole('employer'); setCreatedUser(null); setMsg(''); }}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: 8,
            border: 'none',
            background: role === 'employer' ? '#1F2E4A' : '#E5E7EB',
            color: role === 'employer' ? '#FFF' : '#374151',
            fontWeight: 600,
            fontSize: 14,
            cursor: 'pointer'
          }}
        >
          {t.employer}
        </button>
      </div>

      {/* Confirmation Receipt Card */}
      {createdUser && (
        <div
          style={{
            background: '#ECFDF5',
            border: '1px solid #6EE7B7',
            borderRadius: 10,
            padding: '14px 16px',
            marginBottom: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 6
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#065F46', fontWeight: 700, fontSize: 14 }}>
            <CheckCircle2 size={18} color="#059669" />
            <span>{createdUser.role === 'worker' ? 'पंजीकृत श्रमिक विवरण' : 'पंजीकृत ठेकेदार विवरण'}</span>
          </div>

          <div style={{ fontSize: 13, color: '#047857', lineHeight: 1.5, marginTop: 4 }}>
            <div><strong>नाम:</strong> {createdUser.name}</div>
            <div><strong>मोबाइल नंबर:</strong> +91 {createdUser.phone}</div>
            {createdUser.businessName && (
              <div><strong>साइट / फर्म:</strong> {createdUser.businessName}</div>
            )}
          </div>

          {setActiveTab && (
            <button
              type="button"
              onClick={() => setActiveTab('log')}
              style={{
                marginTop: 8,
                alignSelf: 'flex-start',
                background: '#059669',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 6,
                padding: '6px 12px',
                fontSize: 12,
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                cursor: 'pointer'
              }}
            >
              काम दर्ज करें (Log Shift)
              <ArrowRight size={14} />
            </button>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <label style={{ fontSize: 13, color: 'var(--ink-soft)', display: 'block', marginBottom: 4 }}>
            {role === 'worker' ? 'पूरा नाम (Worker Name)' : 'मालिक/ठेकेदार का नाम'}
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="उदा. रमेश कुमार / Rekha Devi"
            style={{ width: '100%', padding: '10px', borderRadius: 6, border: '1px solid var(--border)' }}
          />
        </div>

        <div>
          <label style={{ fontSize: 13, color: 'var(--ink-soft)', display: 'block', marginBottom: 4 }}>
            मोबाइल नंबर (Phone Number)
          </label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 9876543210"
            style={{ width: '100%', padding: '10px', borderRadius: 6, border: '1px solid var(--border)' }}
          />
        </div>

        {role === 'employer' && (
          <div>
            <label style={{ fontSize: 13, color: 'var(--ink-soft)', display: 'block', marginBottom: 4 }}>
              फर्म या साइट का नाम (Business/Site)
            </label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="उदा. शर्मा कंस्ट्रक्शन"
              style={{ width: '100%', padding: '10px', borderRadius: 6, border: '1px solid var(--border)' }}
            />
          </div>
        )}

        <button
          type="submit"
          style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: '#FFF',
            border: 'none',
            borderRadius: 8,
            padding: '12px',
            fontSize: 15,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            marginTop: 6,
            cursor: 'pointer'
          }}
        >
          <UserPlus size={18} />
          {t.register}
        </button>
      </form>

      {msg && !createdUser && (
        <div style={{ marginTop: 12, padding: '10px', borderRadius: 6, background: '#FEE2E2', color: '#991B1B', fontSize: 13, fontWeight: 500 }}>
          {msg}
        </div>
      )}
    </div>
  );
};

export default RegisterForm;