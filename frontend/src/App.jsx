import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomeView from './components/HomeView';
import RegisterForm from './components/RegisterForm';
import WorkLogger from './components/WorkLogger';
import PassbookView from './components/PassbookView';
import CertificateView from './components/CertificateView';
import PublicVerifyView from './components/PublicVerifyView';
import Footer from './components/Footer';
import { getWorkers, getEmployers } from './services/api';
import HaqdarSahayak from "./components/HaqdarSahayak";

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [workers, setWorkers] = useState([]);
  const [employers, setEmployers] = useState([]);

  const loadUsers = async () => {
    try {
      const [wRes, eRes] = await Promise.all([getWorkers(), getEmployers()]);
      setWorkers(wRes.data?.workers || wRes.data || []);
      setEmployers(eRes.data?.employers || eRes.data || []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Worker context to feed into Haqdar Sahayak AI
  const activeWorkerContext = workers.length > 0 ? {
    name: workers[0].name || workers[0].fullName,
    totalShifts: workers[0].shifts?.length || workers[0].totalShifts || 0,
    pendingWages: workers[0].pendingWages || 0,
    approvedWages: workers[0].approvedWages || 0
  } : null;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="container" style={{ marginTop: 16, flex: 1 }}>
        {activeTab === 'home' && <HomeView setActiveTab={setActiveTab} />}
        {activeTab === 'register' && <RegisterForm onUserAdded={loadUsers} />}
        {activeTab === 'log' && (
          <WorkLogger workers={workers} employers={employers} onEntryLogged={loadUsers} />
        )}
        {activeTab === 'passbook' && <PassbookView workers={workers} />}
        {activeTab === 'cert' && <CertificateView workers={workers} />}
        {activeTab === 'verify' && <PublicVerifyView />}
      </main>

      {/* Floating AI Assistant for Workers */}
      <HaqdarSahayak workerData={activeWorkerContext} />

      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;
