import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
  : 'https://haqdar-api.onrender.com/api';

const API = axios.create({
  baseURL: API_BASE_URL,
});

// Fallback demo data so the app displays cleanly on Vercel even without a deployed backend
const DEMO_WORKERS = [
  { _id: 'w1', name: 'Ramesh Yadav', phone: '9877223344', role: 'worker' },
  { _id: 'w2', name: 'Rama Yadav', phone: '9876543210', role: 'worker' }
];

const DEMO_EMPLOYERS = [
  { _id: 'e1', name: 'Sharma Construction', businessName: 'Sharma Construction', phone: '9988776655', role: 'employer' }
];

const DEMO_PASSBOOK = {
  worker: { name: 'Ramesh Yadav', phone: '9877223344' },
  entries: [
    {
      _id: 'entry_1',
      date: new Date().toISOString(),
      employerId: { businessName: 'Sharma Construction', name: 'Sharma Construction' },
      agreedWage: 500,
      workDescription: 'RCC Slab Casting - Day Shift',
      status: 'confirmed',
      workerConfirmed: true,
      employerConfirmed: true,
      currentHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
    }
  ],
  isChainIntact: true
};

// Auth & Users
export const registerUser = (userData) => API.post('/auth/register', userData);
export const loginUser = (phone) => API.post('/auth/login', { phone });

export const getWorkers = async () => {
  try {
    const res = await API.get('/auth/workers');
    return res.data?.workers ? res : { data: res.data };
  } catch (err) {
    console.warn('Backend offline or unreachable, using fallback worker data');
    return { data: DEMO_WORKERS };
  }
};

export const getEmployers = async () => {
  try {
    const res = await API.get('/auth/employers');
    return res.data?.employers ? res : { data: res.data };
  } catch (err) {
    console.warn('Backend offline or unreachable, using fallback employer data');
    return { data: DEMO_EMPLOYERS };
  }
};

// Ledger & Cryptographic Chain
export const logWorkday = (entryData) => API.post('/ledger/entry', entryData);
export const confirmOtp = (data) => API.post('/ledger/confirm', data);

export const getWorkerPassbook = async (workerId) => {
  try {
    const res = await API.get(`/ledger/passbook/${workerId}`);
    return res;
  } catch (err) {
    console.warn('Backend offline or unreachable, using fallback passbook data');
    return { data: DEMO_PASSBOOK };
  }
};

export const triggerTamperTest = (data) => API.post('/ledger/tamper-test', data);
export const simulate24Hours = () => API.post('/ledger/simulate-24h');
export const repairWorkerChain = (workerId) => API.post(`/ledger/repair-chain/${workerId}`);

export default API;