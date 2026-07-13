# letsdeal — frontend

Terminal-styled trading UI for the `lets_deal` NFT⇄SOL escrow program
(`FzwhoLmFm8avMRpgwTL5mWiC8oi8RSqkbDdYBU7SeQj`, devnet).

Two dashboards, one deal:

- **/buyer** — create a new escrow (seller, NFT mint, amount, deadline),
  deposit SOL, execute the trade once the NFT lands, or claim a refund
  after the deadline.
- **/seller** — load an escrow by address, deposit the NFT once SOL is
  locked, execute the trade.

No IDL file required. Every instruction is hand-built against the exact
account layout in `programs/lets_deal/src/instructions/*.rs` and
`state/escrow.rs`, with Anchor discriminators recomputed client-side
(`sha256("global:<ix_name>")`). This means the frontend isn't coupled to
whatever Anchor CLI version generated your local IDL — it talks straight
to the deployed program.

## Setup

```bash
npm install
cp .env.example .env
```

Edit `.env` and set `VITE_RPC_URL` to a private devnet RPC (Helius,
QuickNode, etc.) — the public `api.devnet.solana.com` endpoint rate-limits
aggressively and will cause deposit/execute transactions to fail under
normal use.

```bash
npm run dev
```

Open the printed localhost URL, connect a wallet (Phantom, Solflare, or
Backpack), and pick a role.

## Trying it end-to-end on devnet

1. As **buyer**: fill in the seller's wallet address, the mint of the NFT
   you're buying, the SOL amount, and a deadline. Submitting this creates
   a fresh escrow account and initializes it on-chain.
2. Copy the escrow address shown after creation and send it to the
   seller (Discord, whatever — it's a public address, not a secret).
3. As **buyer**: click "deposit funds" to lock the SOL.
4. As **seller**: paste the escrow address into the seller dashboard,
   click "deposit nft" once the SOL step shows locked.
5. Either side clicks "execute trade" once both deposits are in — this
   atomically swaps the NFT to the buyer and releases the SOL to the
   seller.
6. If the seller never deposits before the deadline, the buyer's
   "claim refund" button lights up and returns the SOL.

## Project layout

```
src/
  constants.ts          program id, RPC url, explorer link helpers
  lib/
    discriminator.ts     Anchor ix/account discriminator (no IDL needed)
    pda.ts                vault PDA derivation
    instructions.ts       one builder per instruction, matches Rust structs
    escrowAccount.ts       manual borsh decode of the Escrow account
    ata.ts                 associated-token-account resolve/create helper
  hooks/
    useEscrow.ts           polls + decodes an escrow account by address
    useCountdown.ts         live deadline countdown
  components/               step tracker, stat cards, action cards, tx log
  pages/
    RoleSelect.tsx          landing page
    BuyerDashboard.tsx
    SellerDashboard.tsx
  wallet/
    WalletContextProvider.tsx   Phantom + Solflare + Backpack via wallet-adapter
```

## If the program changes

Instruction account order and instruction data must match
`programs/lets_deal/src/instructions/*.rs` exactly — Anchor doesn't
validate names client-side, only position and type. If you add/reorder
accounts or ix args in the Rust program, update the matching builder in
`src/lib/instructions.ts` and the layout comment in
`src/lib/escrowAccount.ts`.

## Build

```bash
npm run build
npm run preview
```

Output lands in `dist/` — static files, deployable anywhere (Vercel,
Netlify, Cloudflare Pages, S3, etc). Routing uses `HashRouter` so it works
as plain static files with no server-side rewrite rules needed.
