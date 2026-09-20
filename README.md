# HAQDAR (हक़दार)
> Cryptographic Proof-of-Work & Wage Verification Protocol for Informal Labor

Haqdar is an offline-resilient, zero-gas decentralized passbook protocol designed to convert verbal daily-wage agreements into an immutable, mathematically verified proof-of-income for unorganized workers.

---

## Key Architectural Features

- **Dual-Party OTP Consensus Handshake:** Prevents unilateral shift or wage manipulation by requiring independent 6-digit OTP confirmation from both the laborer and the contractor.
- **Gas-Free SHA-256 Hash Chaining:** Chains daily records sequentially ($CurrentHash = \text{SHA-256}(WorkerID + EmployerID + Date + Wage + Hours + PrevHash)$), providing blockchain-grade tamper evidence without crypto tokens or gas fees.
- **24-Hour Dispute Safeguard:** Automatically transitions unverified shifts into timestamped "Unconfirmed" records to eliminate employer plausible deniability.
- **Verifiable QR Credentials:** Generates PDF wage certificates with scannable QR payloads audit-ready for microfinance institutions and welfare boards in under 1 second.
- **Offline & Low-Bandwidth Inclusion:** Native Web Speech synthesis for Hindi audio passbook readouts, 1-click bilingual toggle, and architectural support for USSD (`*99#`) / SMS verification.
- *Haqdar Sahayak (Multilingual Gemini Voice Assistant):* Employs Google GenAI SDK (`gemini-2.5-flash`) with native Web Speech API integration. Offers dual-way Hindi audio synthesis and speech-to-text specifically for low-literacy workers to track pending wages, dispute resolutions, and proof receipts without typing.

---

## Tech Stack

- **Frontend:** React.js (Vite), Lucide Icons, Web Speech API, jsPDF, QRCode
- **Backend:** Node.js, Express.js REST API, Node.js Crypto Engine
- **Database:** MongoDB Atlas

---

## Local Setup

### 1. Backend
```bash
cd backend
npm install
npm run dev
