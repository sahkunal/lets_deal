"use client";

import React from "react";

// ============================================================================
// 1. COOL VAULT ICON (Cryptographic Safe / PDA Matrix)
// ============================================================================
export function CoolVaultIcon({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="vaultGrad1" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#9945FF" />
          <stop offset="50%" stopColor="#8752F3" />
          <stop offset="100%" stopColor="#14F195" />
        </linearGradient>
        <linearGradient id="vaultGrad2" x1="14" y1="14" x2="34" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#14F195" />
          <stop offset="100%" stopColor="#00FFA3" />
        </linearGradient>
      </defs>
      {/* Outer Hexagonal Shield */}
      <path
        d="M24 4L42 12V24C42 33.5 34.5 41.5 24 44C13.5 41.5 6 33.5 6 24V12L24 4Z"
        stroke="url(#vaultGrad1)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="rgba(153, 69, 255, 0.08)"
      />
      {/* Inner Vault Door Circuit */}
      <circle cx="24" cy="24" r="9" stroke="url(#vaultGrad2)" strokeWidth="2" fill="rgba(20, 241, 149, 0.08)" />
      {/* Central Keyhole Pin */}
      <circle cx="24" cy="24" r="3" fill="#14F195" />
      {/* Laser Alignment Ticks */}
      <line x1="24" y1="10" x2="24" y2="13" stroke="#14F195" strokeWidth="2" strokeLinecap="round" />
      <line x1="24" y1="35" x2="24" y2="38" stroke="#9945FF" strokeWidth="2" strokeLinecap="round" />
      <line x1="10" y1="24" x2="13" y2="24" stroke="#8752F3" strokeWidth="2" strokeLinecap="round" />
      <line x1="35" y1="24" x2="38" y2="24" stroke="#14F195" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// ============================================================================
// 2. COOL ATOMIC SWAP ICON (Orbital Dual-Particle Flow)
// ============================================================================
export function CoolSwapIcon({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="swapGrad1" x1="6" y1="12" x2="42" y2="12" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#9945FF" />
          <stop offset="100%" stopColor="#14F195" />
        </linearGradient>
        <linearGradient id="swapGrad2" x1="42" y1="36" x2="6" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#14F195" />
          <stop offset="100%" stopColor="#9945FF" />
        </linearGradient>
      </defs>
      {/* Upper Stream: Left to Right */}
      <path
        d="M10 16H36C39.3137 16 42 18.6863 42 22V23M34 10L40 16L34 22"
        stroke="url(#swapGrad1)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Lower Stream: Right to Left */}
      <path
        d="M38 32H12C8.68629 32 6 29.3137 6 26V25M14 38L8 32L14 26"
        stroke="url(#swapGrad2)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Central Quantum Node */}
      <circle cx="24" cy="24" r="4" fill="#14F195" />
      <circle cx="24" cy="24" r="8" stroke="rgba(20, 241, 149, 0.3)" strokeWidth="1" strokeDasharray="2 2" />
    </svg>
  );
}

// ============================================================================
// 3. COOL TIMELOCK / CHRONO ICON (Futuristic Epoch Dial)
// ============================================================================
export function CoolTimelockIcon({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="chronoGrad" x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#9945FF" />
          <stop offset="50%" stopColor="#3ECBFF" />
          <stop offset="100%" stopColor="#14F195" />
        </linearGradient>
      </defs>
      {/* Outer Dial */}
      <circle
        cx="24"
        cy="24"
        r="18"
        stroke="url(#chronoGrad)"
        strokeWidth="2"
        fill="rgba(153, 69, 255, 0.05)"
      />
      {/* Inner Segment Ring */}
      <circle
        cx="24"
        cy="24"
        r="12"
        stroke="rgba(255, 255, 255, 0.15)"
        strokeWidth="1.5"
        strokeDasharray="4 3"
      />
      {/* Chrono Hands */}
      <path d="M24 14V24L31 29" stroke="#14F195" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Center Pivot */}
      <circle cx="24" cy="24" r="2.5" fill="#FFFFFF" />
      {/* Hour Markers */}
      <circle cx="24" cy="9" r="1.5" fill="#14F195" />
      <circle cx="39" cy="24" r="1.5" fill="#3ECBFF" />
      <circle cx="24" cy="39" r="1.5" fill="#9945FF" />
      <circle cx="9" cy="24" r="1.5" fill="#8752F3" />
    </svg>
  );
}

// ============================================================================
// 4. COOL PROCESSOR / BINARY SERIALIZATION ICON
// ============================================================================
export function CoolProcessorIcon({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="procGrad" x1="12" y1="12" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#9945FF" />
          <stop offset="100%" stopColor="#14F195" />
        </linearGradient>
      </defs>
      {/* Microchip Chassis */}
      <rect
        x="12"
        y="12"
        width="24"
        height="24"
        rx="5"
        stroke="url(#procGrad)"
        strokeWidth="2"
        fill="rgba(20, 241, 149, 0.06)"
      />
      {/* Core Diode Matrix */}
      <rect x="18" y="18" width="12" height="12" rx="2" fill="#14F195" opacity="0.8" />
      <path d="M21 24H27M24 21V27" stroke="#000000" strokeWidth="2" strokeLinecap="round" />
      {/* Bus Pins */}
      <path
        d="M17 6V12M24 6V12M31 6V12M17 36V42M24 36V42M31 36V42M6 17H12M6 24H12M6 31H12M36 17H42M36 24H42M36 31H42"
        stroke="rgba(255, 255, 255, 0.4)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ============================================================================
// 5. COOL TELEMETRY RADAR PULSE ICON (Live Devnet Activity)
// ============================================================================
export function CoolRadarIcon({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="radarGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#14F195" />
          <stop offset="100%" stopColor="#00E599" />
        </linearGradient>
      </defs>
      {/* Concentric Signal Rings */}
      <circle cx="24" cy="24" r="20" stroke="rgba(20, 241, 149, 0.2)" strokeWidth="1.5" />
      <circle cx="24" cy="24" r="14" stroke="rgba(20, 241, 149, 0.4)" strokeWidth="1.5" />
      <circle cx="24" cy="24" r="8" stroke="rgba(20, 241, 149, 0.7)" strokeWidth="1.5" />
      <circle cx="24" cy="24" r="3" fill="#14F195" />
      {/* Radar Crosshairs */}
      <line x1="24" y1="4" x2="24" y2="44" stroke="rgba(20, 241, 149, 0.2)" strokeWidth="1" strokeDasharray="3 3" />
      <line x1="4" y1="24" x2="44" y2="24" stroke="rgba(20, 241, 149, 0.2)" strokeWidth="1" strokeDasharray="3 3" />
      {/* Radar Sweep Ray */}
      <path d="M24 24L38 10" stroke="url(#radarGrad)" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="38" cy="10" r="2.5" fill="#FFFFFF" />
    </svg>
  );
}

// ============================================================================
// 6. COOL SOLANA OFFICIAL LOGOMARK (High-Precision 3-Tier Rhomboids)
// ============================================================================
export function CoolSolanaLogo({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size * 0.82}
      viewBox="0 0 149 122"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id="solanaGradFull"
          x1="19.247"
          x2="79.786"
          y1="84.573"
          y2="16.138"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.08" stopColor="#9945FF" />
          <stop offset="0.3" stopColor="#8752F3" />
          <stop offset="0.5" stopColor="#5497D5" />
          <stop offset="0.6" stopColor="#43B4CA" />
          <stop offset="0.72" stopColor="#28E0B9" />
          <stop offset="0.97" stopColor="#19FB9B" />
        </linearGradient>
      </defs>
      {/* Bottom Bar */}
      <path
        fill="url(#solanaGradFull)"
        d="M130.62 103.55L112.29 123.15A4.256 4.256 0 0 1 109.18 124.5H22.31a2.132 2.132 0 0 1-1.95-1.28 2.118 2.118 0 0 1 .4-2.29l18.34-19.6a4.256 4.256 0 0 1 3.11-1.35h86.86a2.135 2.135 0 0 1 1.95 1.28 2.118 2.118 0 0 1-.4 2.29z"
      />
      {/* Middle Bar */}
      <path
        fill="url(#solanaGradFull)"
        d="M112.29 64.09a4.256 4.256 0 0 0-3.11-1.35H22.32a2.132 2.132 0 0 0-1.95 1.28 2.118 2.118 0 0 0 .4 2.29l18.34 19.6a4.256 4.256 0 0 0 3.11 1.35h86.86a2.133 2.133 0 0 0 1.95-1.28 2.118 2.118 0 0 0-.4-2.29l-18.34-19.6z"
      />
      {/* Top Bar */}
      <path
        fill="url(#solanaGradFull)"
        d="M22.31 49.01h86.86a4.266 4.266 0 0 0 3.11-1.35l18.32-19.6a2.121 2.121 0 0 0 .4-2.29 2.132 2.132 0 0 0-1.95-1.28H41.51a4.268 4.268 0 0 0-3.11 1.35L20.08 46.45a2.118 2.118 0 0 0 1.55 3.57z"
      />
    </svg>
  );
}

// ============================================================================
// 7. COOL NFT GEM MATRIX ICON
// ============================================================================
export function CoolNftMatrixIcon({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="gemGrad1" x1="12" y1="8" x2="36" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3ECBFF" />
          <stop offset="50%" stopColor="#9945FF" />
          <stop offset="100%" stopColor="#14F195" />
        </linearGradient>
      </defs>
      {/* Faceted Gem Geometry */}
      <path
        d="M14 12L24 4L34 12L42 20L24 44L6 20L14 12Z"
        stroke="url(#gemGrad1)"
        strokeWidth="2"
        strokeLinejoin="round"
        fill="rgba(153, 69, 255, 0.08)"
      />
      <path
        d="M14 12L24 24L34 12M24 24V44M6 20H42"
        stroke="rgba(255, 255, 255, 0.4)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="24" r="2.5" fill="#14F195" />
    </svg>
  );
}
