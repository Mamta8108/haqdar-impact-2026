const express = require('express');
const router = express.Router();
const {
  createWorkdayEntry,
  verifyOtp,
  getWorkerPassbook,
  tamperTestEntry,
  expireUnconfirmedEntries,
  simulateFastForward24h,
  repairChain,
} = require('../controllers/ledgerController');

router.post('/entry', createWorkdayEntry);
router.post('/confirm', verifyOtp);
router.get('/passbook/:workerId', getWorkerPassbook);
router.post('/tamper-test', tamperTestEntry);
router.post('/expire-check', expireUnconfirmedEntries);
router.post('/simulate-24h', simulateFastForward24h);
router.post('/repair-chain/:workerId', repairChain);

module.exports = router;