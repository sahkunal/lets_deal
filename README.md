# 🚀 LetsDeal — Trustless Escrow Protocol on Solana

<p align="center">
  🔐 Deterministic Escrow • ⚡ Anchor Smart Contract • 🌐 Next.js dApp
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Solana-Devnet-green?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Anchor-Framework-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Next.js-Frontend-black?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge" />
</p>

---

## 🌐 Live Overview

> 💡 *“Don’t trust users — trust the program.”*

LetsDeal is a **trustless escrow system** where:

* Assets are locked inside **Program Derived Addresses (PDAs)**
* Trades execute only when **on-chain conditions are satisfied**
* Refunds are enforced automatically


## 🧠 Core Logic

```text id="flowlogic"
Seller ───────► Escrow Vault (PDA) ◄────── Buyer
                  │
                  │
        ┌─────────┴─────────┐
        │                   │
   Conditions Met      Conditions Fail
        │                   │
        ▼                   ▼
   ✅ Execute Trade     🔁 Refund
```

---

## 🏗️ Architecture

### 🔑 PDA Design

| Account        | Purpose               |
| -------------- | --------------------- |
| `escrow_state` | Stores trade metadata |
| `vault`        | Holds locked assets   |

👉 Funds are controlled by **program logic**, not private keys.

---

## ⚙️ Instruction Flow

```text id="flow2"
1. Initialize Escrow
2. Deposit (SOL / NFT)
3. Execute Trade
4. Refund
```

---

## 📁 Project Structure

```text id="structure"
lets_deal/
├── app/                     → Frontend (Next.js)
│   ├── page.tsx
│   ├── layout.tsx
│   └── globals.css
│
├── components/
│   ├── WalletProvider.tsx
│   └── escrow/
│        ├── Initialize.tsx
│        ├── DepositSOL.tsx
│        ├── DepositNFT.tsx
│        ├── Execute.tsx
│        └── Refund.tsx
│
├── lib/                     → Client logic
│   ├── anchor.ts
│   ├── solana.ts
│   └── hooks/
│
├── programs/lets_deal/src/  → Smart contract
│   ├── lib.rs
│   ├── state/
│   ├── constants.rs
│   ├── errors.rs
│
├── tests/
├── migrations/
└── Anchor.toml
```

---

## 🌐 Frontend UI

✨ Built with modern Web3 UX principles:

* 🌑 Dark dashboard
* 🧊 Card-based layout
* 🔘 Modular action panels
* 🔌 Wallet integration
* ⚡ Real-time interaction

---

## ⚙️ Setup

### 📦 Install

```bash id="install"
cd app
npm install --legacy-peer-deps
```

---

### ▶️ Run

```bash id="run"
npm run dev
```

Open:

```text id="url"
http://localhost:3000
```

---

## 🔗 Backend Verification

Run:

```bash id="logs"
solana logs
```

Expected:

```text id="expected"
Program log: Instruction: Initialize
```

---

## 🧪 Testing

```bash id="test"
anchor test
```

✔ Initialization
✔ Deposit
✔ Execution
✔ Refund

---

## 🚀 Deployment

### 🔑 Program ID FxtUUx1J4NiWoLtpaqstk9obhEdVMjaCth4UwfSuRC6F

```text id="pid"
YOUR_PROGRAM_ID FxtUUx1J4NiWoLtpaqstk9obhEdVMjaCth4UwfSuRC6F
```

### 🔍 Explorer

```text id="explorer"
https://explorer.solana.com/?cluster=devnet
```

---

## 🛠 Tech Stack

* 🦀 Anchor (Rust)
* ⚡ Solana Web3.js
* 🧩 PDA Architecture
* 🌐 Next.js
* 🎨 Tailwind CSS

---

## 🧩 Design Philosophy

> Replace trust with deterministic logic.

Instead of asking:

> “Will the user act honestly?”

The protocol guarantees:

> “The user has no choice but to follow rules.”

---

## 📊 Project Status

| Feature            | Status |
| ------------------ | ------ |
| Escrow Logic       | ✅      |
| PDA Security       | ✅      |
| Frontend UI        | ✅      |
| Wallet Integration | ⚙️     |
| Production Ready   | 🚧     |

---

## 📸 Screenshots

```md id="screens"
![Dashboard](./assets/dashboard.png)
![Transaction](./assets/tx.png)
```

---

## 👨‍💻 Author

**Kunal Sah**
Solana Developer • Web3 Builder

---

## ⭐ Support

If this helped you:

* ⭐ Star the repo
* 🍴 Fork it
* 🚀 Build on it

---

## 📜 License

MIT
