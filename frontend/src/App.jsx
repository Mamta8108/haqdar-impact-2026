import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomeView from './components/HomeView';
import RegisterForm from './components/RegisterForm';
import WorkLogger from './components/WorkLogger';
import PassbookView from './components/PassbookView';
import CertificateView from './components/CertificateView';
import PublicVerifyView from './components/PublicVerifyView';
import Footer from './components/Footer';
import { getWorkers, getEmployers, getWorkerPassbook } from './services/api';
import HaqdarSahayak from './components/HaqdarSahayak';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [workers, setWorkers] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [selectedWorkerId, setSelectedWorkerId] = useState('');
  const [activeWorkerContext, setActiveWorkerContext] = useState(null);

  const loadUsers = async () => {
    try {
      const [wRes, eRes] = await Promise.allSettled([getWorkers(), getEmployers()]);
      const workerList = (wRes.status === 'fulfilled' && (wRes.value?.data?.workers || wRes.value?.data)) || [];
      const employerList = (eRes.status === 'fulfilled' && (eRes.value?.data?.employers || eRes.value?.data)) || [];
      setWorkers(Array.isArray(workerList) ? workerList : []);
      setEmployers(Array.isArray(employerList) ? employerList : []);

      if (workerList.length > 0) {
        setSelectedWorkerId((prev) => prev || workerList[0]._id);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setWorkers([]);
      setEmployers([]);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    const fetchWorkerLedger = async () => {
      if (!selectedWorkerId) return;
      try {
        const worker = workers.find((w) => w._id === selectedWorkerId);
        const res = await getWorkerPassbook(selectedWorkerId);
        const passbook = res?.data;

        if (!passbook) return;

        const confirmed = passbook.entries?.filter((e) => e.status === 'confirmed') || [];
        const pending = passbook.entries?.filter((e) => e.status === 'pending') || [];

        const totalEarned = confirmed.reduce((sum, e) => sum + (e.agreedWage || 0), 0);
        const pendingWages = pending.reduce((sum, e) => sum + (e.agreedWage || 0), 0);

        const employerNames = [
          ...new Set(
            passbook.entries
              ?.map((e) => e.employerId?.businessName || e.employerId?.name)
              .filter(Boolean)
          ),
        ].join(', ');

        setActiveWorkerContext({
          name: worker?.name || 'कामगार',
          phone: worker?.phone || '',
          totalShifts: passbook.entries?.length || 0,
          confirmedDays: confirmed.length,
          totalEarned: totalEarned,
          pendingWages: pendingWages,
          employers: employerNames || 'दर्ज नहीं',
          isChainIntact: passbook.isChainIntact ?? true,
        });
      } catch (err) {
        console.error('Failed to load worker ledger for AI:', err);
      }
    };

    fetchWorkerLedger();
  }, [selectedWorkerId, workers]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="container" style={{ marginTop: 16, flex: 1 }}>
        {activeTab === 'home' && <HomeView setActiveTab={setActiveTab} />}
        {activeTab === 'register' && <RegisterForm onUserAdded={loadUsers} />}
        {activeTab === 'log' && (
          <WorkLogger workers={workers} employers={employers} onEntryLogged={loadUsers} />
        )}
        {activeTab === 'passbook' && (
          <PassbookView 
            workers={workers} 
            selectedWorker={selectedWorkerId}
            onSelectWorker={setSelectedWorkerId}
          />
        )}
        {activeTab === 'cert' && <CertificateView workers={workers} />}
        {activeTab === 'verify' && <PublicVerifyView />}
      </main>

      <HaqdarSahayak workerData={activeWorkerContext} />

      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;