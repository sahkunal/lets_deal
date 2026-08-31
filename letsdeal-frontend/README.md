# ⚡ LetsDeal — Ultra-Premium Solana Escrow Protocol dApp

<div align="center">

[![Solana Devnet](https://img.shields.io/badge/Solana-Devnet-14F195?style=for-the-badge&logo=solana&logoColor=white)](https://explorer.solana.com/address/FzwhoLmFm8avMRpgwTL5mWiC8oi8RSqkbDdYBU7SeQj?cluster=devnet)
[![Anchor Framework](https://img.shields.io/badge/Anchor-v1.0.2-2D7DD2?style=for-the-badge&logo=rust&logoColor=white)](https://www.anchor-lang.com/)
[![React / Vite](https://img.shields.io/badge/Frontend-React%2018%20%7C%20Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0.6-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](./LICENSE)

<p align="center">
  <b>Deterministic, Non-Custodial P2P Escrow Terminal for Atomic SOL ⇄ NFT Swaps on Solana.</b>
</p>

</div>

---

## 🌟 Overview & Architecture

**LetsDeal** is a non-custodial, high-velocity OTC escrow protocol deployed on **Solana Devnet** (`FzwhoLmFm8avMRpgwTL5mWiC8oi8RSqkbDdYBU7SeQj`).

### Key Value Propositions
1. **Zero Counterparty Custody**: Assets are locked strictly inside **Program Derived Addresses (PDAs)** governed by open-source smart contract code.
2. **Atomic Settlement**: Swaps execute atomically via CPI with PDA signing seeds. Either both transfers succeed or the transaction reverts.
3. **Automated Refund Guarantee**: If the seller fails to deposit the NFT before the deadline, the buyer can unilaterally claim a 100% refund of their locked SOL.
4. **Zero-IDL Runtime Coupling**: Instruction discriminators are computed on-the-fly (`sha256("global:<ix_name>")[0..8]`) and account buffers (113 bytes) are parsed directly with pure Borsh decoding.

---

## 🎨 Ultra-Premium Design System & Components

- **3D Tilt & Glare Card (`TiltCard.tsx`)**: Cursor-following 3D perspective mouse tilt with dynamic radial glare reflection.
- **3D Holographic Vault Card (`VirtualEscrowCard.tsx`)**: 3D flippable card displaying live collateral values, buyer/seller public keys, on-chain PDA proof, and byte offset calculations.
- **Floating Glassmorphism Navbar (`Header.tsx`)**: Responsive navbar with live Solana Devnet cluster status pill, fast role switcher, and official Solana Wallet Adapter (`Phantom`, `Solflare`, `Backpack`).
- **Visual Step Pipeline Tracker (`StepTracker.tsx`)**: 4-stage visual status indicator (`1. Initialized` → `2. SOL Deposited` → `3. NFT Deposited` → `4. Completed` / `Refunded`).
- **Live Transaction Terminal (`TxLog.tsx`)**: Real-time on-chain transaction stream with direct links to Solana Explorer.

---

## 📱 User Portals & Workflows

### 1. Overview & Landing Portal (`/`)
- Cyberpunk Hero Section with live Devnet statistics.
- Interactive 3D Holographic Escrow Vault Card.
- **On-Chain Escrow Inspector**: Enter any Escrow Public Key to instantly inspect on-chain state, balances, buyer, seller, and deadline.
- Protocol Architecture & PDA Math Breakdown.

### 2. Buyer Portal (`/buyer`)
- **Create Deal Form**: Seller Public Key, NFT Mint Address, Amount in SOL, Deadline in Hours.
- **1-Click Sample Data Fill**: Quickly test on Devnet without manual typing.
- **Step Actions**:
  - `Deposit SOL`: Transfers SOL into the Vault PDA.
  - `Execute Trade`: Atomically triggers the bilateral swap once the NFT is locked.
  - `Claim Refund`: Active after deadline expiration to withdraw locked SOL.
- **Live Countdown Timer**: Real-time timeout countdown with warning states.

### 3. Seller Portal (`/seller`)
- **Load Deal Form**: Paste any Escrow Public Key or pick from saved recent deals.
- **Step Actions**:
  - `Deposit NFT`: Resolves or creates the Vault Associated Token Account (ATA) with `allowOwnerOffCurve: true` and transfers the NFT into custody.
  - `Execute Trade`: Releases the locked SOL directly to the seller's wallet and delivers the NFT to the buyer.

---

## ⚡ Developer Setup & Run

### 1. Install Dependencies
```bash
cd letsdeal-frontend
npm install --ignore-scripts
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
*(Optional: Set `VITE_RPC_URL` to a custom Helius or QuickNode Devnet RPC endpoint).*

### 3. Run Locally
```bash
npm run dev
```
Open [http://localhost:8000](http://localhost:8000) in your browser.

### 4. Build for Production
```bash
npm run build
```
Optimized static bundle will be generated in `dist/`.
