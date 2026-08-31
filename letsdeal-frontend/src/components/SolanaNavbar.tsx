import React, { FC, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { ArrowRight, Droplets, Loader2, Menu, X, ExternalLink } from 'lucide-react';
import { TelemetryBar } from './TelemetryBar';
import { useSolBalance } from '../hooks/useSolBalance';
import { explorerAddress, PROGRAM_ID } from '../constants';

export const SolanaNavbar: FC = () => {
  const location = useLocation();
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const { balance, refreshBalance } = useSolBalance();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [airdropping, setAirdropping] = useState(false);
  const [airdropMsg, setAirdropMsg] = useState<string | null>(null);

  const handleAirdrop = async () => {
    if (!publicKey) return;
    setAirdropping(true);
    setAirdropMsg(null);
    try {
      const sig = await connection.requestAirdrop(publicKey, 1 * LAMPORTS_PER_SOL);
      await connection.confirmTransaction(sig, "confirmed");
      refreshBalance();
      setAirdropMsg("✓ 1.0 SOL Airdropped");
      setTimeout(() => setAirdropMsg(null), 3000);
    } catch {
      setAirdropMsg("Faucet rate limited");
      setTimeout(() => setAirdropMsg(null), 3000);
    } finally {
      setAirdropping(false);
    }
  };

  const navLinks = [
    { label: 'Explore', path: '/' },
    { label: 'Trade Terminal', path: '/app' },
    { label: 'Developers', path: '/developers' },
    { label: 'Explorer', path: '/explorer' },
  ];

  return (
    <>
      <TelemetryBar />

      <header className="sticky top-0 z-50 bg-[#000000]/80 backdrop-blur-xl border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Solana-Grade Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#9945FF] via-[#00C2FF] to-[#14F195] p-[1.5px] shadow-lg shadow-[#14F195]/10 group-hover:shadow-[#14F195]/30 transition-all">
              <div className="w-full h-full bg-[#000000] rounded-[10px] flex items-center justify-center">
                <svg className="w-4 h-4" viewBox="0 0 397 311" fill="none">
                  <path d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h313.7c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z" fill="url(#nav_p0)"/>
                  <path d="M64.6 3.8C67 1.4 70.3 0 73.8 0h313.7c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z" fill="url(#nav_p1)"/>
                  <path d="M333.6 120.9c-2.4-2.4-5.7-3.8-9.2-3.8H10.7c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h313.7c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z" fill="url(#nav_p2)"/>
                  <defs>
                    <linearGradient id="nav_p0" x1="362.4" y1="234.1" x2="26.6" y2="311.7" gradientUnits="userSpaceOnUse"><stop stopColor="#00FFA3"/><stop offset="1" stopColor="#DC1FFF"/></linearGradient>
                    <linearGradient id="nav_p1" x1="362.4" y1=".1" x2="26.6" y2="77.7" gradientUnits="userSpaceOnUse"><stop stopColor="#00FFA3"/><stop offset="1" stopColor="#DC1FFF"/></linearGradient>
                    <linearGradient id="nav_p2" x1="28.6" y1="117.1" x2="364.4" y2="194.7" gradientUnits="userSpaceOnUse"><stop stopColor="#00FFA3"/><stop offset="1" stopColor="#DC1FFF"/></linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5">
                LetsDeal
                <span className="text-[10px] font-mono font-bold text-[#14F195]">
                  on Solana
                </span>
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
                    active
                      ? 'text-white bg-white/[0.08] shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Controls: Faucet & Launch / Wallet */}
          <div className="flex items-center gap-2.5">
            {publicKey && (
              <div className="hidden lg:flex items-center gap-2">
                {/* Balance */}
                <div className="px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-xs font-mono text-slate-200 flex items-center gap-1.5">
                  <span className="text-[#14F195] font-bold">◎</span>
                  <span>{balance !== null ? `${balance.toFixed(3)} SOL` : '...'}</span>
                </div>

                {/* Devnet Airdrop */}
                <button
                  onClick={handleAirdrop}
                  disabled={airdropping}
                  className="px-2.5 py-1.5 rounded-full bg-[#14F195]/10 hover:bg-[#14F195]/20 border border-[#14F195]/30 text-[#14F195] text-xs font-mono transition-colors flex items-center gap-1 disabled:opacity-40"
                  title="Request 1 Devnet SOL"
                >
                  {airdropping ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Droplets className="w-3.5 h-3.5" />
                  )}
                  <span>Airdrop</span>
                </button>
              </div>
            )}

            {/* Launch App Button for Home */}
            {location.pathname !== '/app' && (
              <Link
                to="/app"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#9945FF] to-[#14F195] text-slate-950 text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity shadow-md shadow-[#14F195]/15"
              >
                <span>Launch App</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}

            {/* Official Wallet Button */}
            <WalletMultiButton />

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-white/[0.06] text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/[0.08] bg-[#000000] px-4 py-4 space-y-2">
            {navLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:bg-white/[0.06] hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}

        {/* Faucet toast */}
        {airdropMsg && (
          <div className="bg-[#14F195]/15 text-[#14F195] text-xs font-mono py-1 px-4 text-center border-t border-[#14F195]/30">
            {airdropMsg}
          </div>
        )}
      </header>
    </>
  );
};
