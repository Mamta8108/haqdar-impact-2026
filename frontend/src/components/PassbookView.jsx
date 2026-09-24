import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ShieldCheck, ShieldAlert, Volume2, Check, Clock } from 'lucide-react';
import { getWorkerPassbook, confirmOtp, triggerTamperTest, simulate24Hours, repairWorkerChain } from '../services/api';
import HaqdarSahayak from './HaqdarSahayak';


const PassbookView = ({ workers }) => {
  const { t } = useLanguage();
  const [selectedWorker, setSelectedWorker] = useState('');
  const [passbookData, setPassbookData] = useState(null);
  const [otpInputs, setOtpInputs] = useState({});

  const fetchPassbook = async (wId) => {
    if (!wId) {
      setPassbookData(null);
      return;
    }
    try {
      const res = await getWorkerPassbook(wId);
      setPassbookData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (selectedWorker) fetchPassbook(selectedWorker);
  }, [selectedWorker]);

  const speakPassbook = () => {
    if (!passbookData || !window.speechSynthesis) return;
    const confirmedCount = passbookData.entries.filter((e) => e.status === 'confirmed').length;
    const totalWage = passbookData.entries
      .filter((e) => e.status === 'confirmed')
      .reduce((sum, e) => sum + e.agreedWage, 0);

    const speechText = `हकदार पासबुक: आपके कुल ${confirmedCount} दिन सत्यापित हैं, और कुल कमाई ${totalWage} रुपये है।`;
    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.lang = 'hi-IN';
    window.speechSynthesis.speak(utterance);
  };

  const handleVerifyOtp = async (entryId, role, enteredOtp) => {
    try {
      await confirmOtp({ entryId, role, otp: enteredOtp });
      fetchPassbook(selectedWorker);
    } catch (err) {
      alert(err.response?.data?.message || 'गलत ओटीपी');
    }
  };

  const handleFastForward = async () => {
    try {
      const res = await simulate24Hours();
      alert(res.data.message);
      if (selectedWorker) fetchPassbook(selectedWorker);
    } catch (err) {
      console.error(err);
    }
  };

  const handleTamperTest = async (entryId) => {
    const fake = prompt('टेस्ट के लिए नया गलत वेतन (₹) डालें:');
    if (!fake) return;
    await triggerTamperTest({ entryId, fakeWage: fake });
    fetchPassbook(selectedWorker);
  };

  const handleRepairChain = async () => {
    if (!selectedWorker) return;
    try {
      const res = await repairWorkerChain(selectedWorker);
      alert(res.data.message);
      fetchPassbook(selectedWorker);
    } catch (err) {
      console.error(err);
    }
  };

  const confirmedEntries = passbookData?.entries.filter((e) => e.status === 'confirmed') || [];
  const totalEarnings = confirmedEntries.reduce((s, e) => s + e.agreedWage, 0);

  const getStatusBadge = (status) => {
    if (status === 'confirmed') {
      return <span className="badge badge-confirmed">✓ सत्यापित (Confirmed)</span>;
    }
    if (status === 'unconfirmed') {
      return <span className="badge badge-unconfirmed">⚠ समय समाप्त / अपुष्ट (Unconfirmed)</span>;
    }
    return <span className="badge badge-pending">⏳ प्रतीक्षारत (Pending)</span>;
  };

  return (
    <div>
      <div className="card">
        <label style={{ fontSize: 13, color: 'var(--ink-soft)' }}>कामगार चुनें (Select Worker)</label>
        <select
          value={selectedWorker}
          onChange={(e) => setSelectedWorker(e.target.value)}
          style={{ width: '100%', padding: '10px', borderRadius: 6, border: '1px solid var(--border)', marginTop: 4 }}
        >
          <option value="">-- कामगार पासबुक खोलें --</option>
          {workers.map((w) => (
            <option key={w._id} value={w._id}>
              {w.name} ({w.phone})
            </option>
          ))}
        </select>

        {selectedWorker && (
          <button
            onClick={handleFastForward}
            style={{
              marginTop: 12,
              background: '#FFF5DC',
              color: '#C28800',
              border: '1px solid #C28800',
              borderRadius: 8,
              padding: '8px 14px',
              fontSize: 12,
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Clock size={14} />
            24 घंटे बीतने का परीक्षण (Simulate 24-Hour Rule)
          </button>
        )}
      </div>

      {passbookData && (
        <>
          <div className="card" style={{ background: '#1F2E4A', color: '#FFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ fontSize: 13, color: '#B7C2DD' }}>डिजिटल खाता संक्षेप</div>
              <button
                onClick={speakPassbook}
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  color: '#FFF',
                  border: 'none',
                  borderRadius: 20,
                  padding: '5px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 12,
                }}
              >
                <Volume2 size={15} />
                {t.voicePrompt}
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <div style={{ fontSize: 12, color: '#B7C2DD' }}>{t.confirmedDays}</div>
                <div style={{ fontSize: 24, fontWeight: 700 }}>{confirmedEntries.length} दिन</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#B7C2DD' }}>{t.totalEarned}</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#FFD166' }}>₹ {totalEarnings}</div>
              </div>
            </div>

            <div
              style={{
                marginTop: 16,
                padding: '8px 12px',
                borderRadius: 6,
                background: passbookData.isChainIntact ? 'rgba(43, 122, 75, 0.3)' : 'rgba(192, 57, 43, 0.4)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: 12,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {passbookData.isChainIntact ? (
                  <>
                    <ShieldCheck color="#2ECC71" size={18} />
                    <span>{t.tamperAlert}</span>
                  </>
                ) : (
                  <>
                    <ShieldAlert color="#E74C3C" size={18} />
                    <span style={{ color: '#FFAAA6' }}>{t.tamperFail}</span>
                  </>
                )}
              </div>

              {!passbookData.isChainIntact && (
                <button
                  onClick={handleRepairChain}
                  style={{
                    background: '#FFFFFF',
                    color: '#C0392B',
                    border: 'none',
                    borderRadius: 4,
                    padding: '5px 10px',
                    fontWeight: 700,
                    fontSize: 11,
                    cursor: 'pointer',
                  }}
                >
                  चेन रीसेट करें (Restore Chain)
                </button>
              )}
            </div>
          </div>

          {passbookData.entries.map((entry) => (
            <div key={entry._id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 16 }}>
                    {new Date(entry.date).toLocaleDateString('hi-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--ink-soft)' }}>
                    ठेकेदार: {entry.employerId?.businessName || entry.employerId?.name}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#1F2E4A' }}>₹ {entry.agreedWage}</div>
                  {getStatusBadge(entry.status)}
                </div>
              </div>

              {entry.workDescription && (
                <div style={{ fontSize: 13, marginTop: 8, color: '#4B5563' }}>
                  विवरण: {entry.workDescription}
                </div>
              )}

              {entry.status === 'pending' && (
                <div style={{ marginTop: 12, padding: 10, background: '#F8F9FA', borderRadius: 8 }}>
                  <div style={{ fontSize: 12, marginBottom: 6, fontWeight: 600, color: 'var(--ink-soft)' }}>
                    द्विपक्षीय सत्यापन (SMS OTP)
                  </div>

                  <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                    <input
                      type="text"
                      placeholder={`Worker OTP (${entry.workerConfirmed ? 'Done' : entry.workerOtp})`}
                      disabled={entry.workerConfirmed}
                      onChange={(e) => setOtpInputs({ ...otpInputs, [`w_${entry._id}`]: e.target.value })}
                      style={{ flex: 1, padding: 6, borderRadius: 4, border: '1px solid var(--border)', fontSize: 12 }}
                    />
                    <button
                      disabled={entry.workerConfirmed}
                      onClick={() => handleVerifyOtp(entry._id, 'worker', otpInputs[`w_${entry._id}`] || entry.workerOtp)}
                      style={{
                        padding: '6px 10px',
                        background: entry.workerConfirmed ? '#2B7A4B' : '#1F2E4A',
                        color: '#FFF',
                        border: 'none',
                        borderRadius: 4,
                        fontSize: 12,
                      }}
                    >
                      {entry.workerConfirmed ? <Check size={14} /> : 'पुष्टि करें'}
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: 6 }}>
                    <input
                      type="text"
                      placeholder={`Employer OTP (${entry.employerConfirmed ? 'Done' : entry.employerOtp})`}
                      disabled={entry.employerConfirmed}
                      onChange={(e) => setOtpInputs({ ...otpInputs, [`e_${entry._id}`]: e.target.value })}
                      style={{ flex: 1, padding: 6, borderRadius: 4, border: '1px solid var(--border)', fontSize: 12 }}
                    />
                    <button
                      disabled={entry.employerConfirmed}
                      onClick={() => handleVerifyOtp(entry._id, 'employer', otpInputs[`e_${entry._id}`] || entry.employerOtp)}
                      style={{
                        padding: '6px 10px',
                        background: entry.employerConfirmed ? '#2B7A4B' : '#1F2E4A',
                        color: '#FFF',
                        border: 'none',
                        borderRadius: 4,
                        fontSize: 12,
                      }}
                    >
                      {entry.employerConfirmed ? <Check size={14} /> : 'पुष्टि करें'}
                    </button>
                  </div>
                </div>
              )}

              <div style={{ marginTop: 10, borderTop: '1px dashed var(--border)', paddingTop: 6 }}>
                <div className="mono-hash">SHA-256: {entry.currentHash?.slice(0, 24)}...</div>
                {entry.status === 'confirmed' && (
                  <button
                    onClick={() => handleTamperTest(entry._id)}
                    style={{ fontSize: 11, background: 'none', border: 'none', color: '#C0392B', textDecoration: 'underline', marginTop: 4 }}
                  >
                    छेड़छाड़ परीक्षण (Simulate Tamper Edit)
                  </button>
                )}
              </div>
            </div>
          ))}
        </>
      )}

      {/* Live Voice AI Widget connected to the active passbook */}
      <HaqdarSahayak
        workerData={
          selectedWorker && passbookData
            ? {
                name: workers.find((w) => w._id === selectedWorker)?.name || 'Ramesh Yadav',
                phone: workers.find((w) => w._id === selectedWorker)?.phone || '',
                totalShifts: passbookData.entries?.length || 1,
                confirmedDays: confirmedEntries.length,
                totalEarned: totalEarnings,
                pendingWages: passbookData.entries
                  ?.filter((e) => e.status === 'pending')
                  ?.reduce((s, e) => s + (e.agreedWage || 0), 0),
                employers: [
                  ...new Set(
                    passbookData.entries
                      ?.map((e) => e.employerId?.businessName || e.employerId?.name)
                      .filter(Boolean)
                  ),
                ].join(', '),
                isChainIntact: passbookData.isChainIntact,
              }
            : null
        }
      />
    
    </div>
  );
};

export default PassbookView;