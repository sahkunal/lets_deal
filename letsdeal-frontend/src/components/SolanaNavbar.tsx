import React, { FC, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { ArrowRight, Droplets, Loader2, Menu, X } from 'lucide-react';
import { TelemetryBar } from './TelemetryBar';
import { useSolBalance } from '../hooks/useSolBalance';

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

      <header className="sticky top-0 z-50 bg-[#000000]/90 backdrop-blur-md border-b border-[#1A1A20]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Minimalist Monochrome Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-7 h-7 rounded-lg bg-[#141418] border border-[#262630] flex items-center justify-center text-white group-hover:border-white transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 397 311" fill="none">
                <path d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h313.7c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z" fill="#FFFFFF"/>
                <path d="M64.6 3.8C67 1.4 70.3 0 73.8 0h313.7c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z" fill="#FFFFFF"/>
                <path d="M333.6 120.9c-2.4-2.4-5.7-3.8-9.2-3.8H10.7c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h313.7c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z" fill="#FFFFFF"/>
              </svg>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-white">
                LetsDeal
              </span>
              <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-[#16161C] border border-[#24242E] text-zinc-400">
                Solana
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
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    active
                      ? 'text-white bg-[#18181E] border border-[#282834]'
                      : 'text-zinc-400 hover:text-white hover:bg-[#101014]'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2.5">
            {publicKey && (
              <div className="hidden lg:flex items-center gap-2">
                {/* Balance */}
                <div className="px-3 py-1.5 rounded-full bg-[#101014] border border-[#22222A] text-xs font-mono text-zinc-200 flex items-center gap-1.5">
                  <span className="text-zinc-400 font-bold">◎</span>
                  <span>{balance !== null ? `${balance.toFixed(3)} SOL` : '...'}</span>
                </div>

                {/* Devnet Airdrop */}
                <button
                  onClick={handleAirdrop}
                  disabled={airdropping}
                  className="px-2.5 py-1.5 rounded-full bg-[#141418] hover:bg-[#1E1E26] border border-[#262630] text-zinc-300 hover:text-white text-xs font-mono transition-colors flex items-center gap-1 disabled:opacity-40"
                  title="Request 1 Devnet SOL"
                >
                  {airdropping ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Droplets className="w-3.5 h-3.5 text-zinc-400" />
                  )}
                  <span>Airdrop</span>
                </button>
              </div>
            )}

            {/* Launch App Button for Home */}
            {location.pathname !== '/app' && (
              <Link
                to="/app"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-zinc-200 text-black text-xs font-semibold tracking-wide transition-colors"
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
              className="md:hidden p-2 rounded-xl bg-[#141418] border border-[#22222A] text-zinc-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#1C1C22] bg-[#0A0A0D] px-4 py-4 space-y-1.5">
            {navLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3.5 py-2 rounded-xl text-xs font-medium text-zinc-300 hover:bg-[#141418] hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}

        {/* Faucet toast */}
        {airdropMsg && (
          <div className="bg-[#121216] text-white text-xs font-mono py-1 px-4 text-center border-t border-[#262630]">
            {airdropMsg}
          </div>
        )}
      </header>
    </>
  );
};
