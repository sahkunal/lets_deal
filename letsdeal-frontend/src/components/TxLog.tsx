import React, { FC } from 'react';
import { Terminal, ExternalLink, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { explorerTx, solscanTx } from '../constants';

export interface TxLogEntry {
  id: string;
  label: string;
  sig?: string;
  status: 'pending' | 'confirmed' | 'error';
  error?: string;
}

export const TxLog: FC<{ entries: TxLogEntry[] }> = ({ entries }) => {
  if (entries.length === 0) return null;

  return (
    <div className="bg-[#101216] border border-[#21252e] rounded-xl p-4 space-y-3 font-mono">
      <div className="flex items-center justify-between border-b border-[#21252e] pb-2 text-xs">
        <div className="flex items-center gap-2 font-bold text-[#f1f3f7]">
          <Terminal className="w-3.5 h-3.5 text-[#ff5500]" />
          <span>ON-CHAIN TRANSACTION LEDGER</span>
        </div>
        <span className="text-[10px] text-[#5c657a]">LIVE RPC EVENT LOG</span>
      </div>

      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
        {entries.map((e) => (
          <div
            key={e.id}
            className="flex items-center justify-between gap-3 text-xs p-2.5 rounded bg-[#08090b] border border-[#1b1e26]"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {e.status === 'confirmed' && (
                <span className="text-[#78d678] font-bold text-[11px] shrink-0">
                  [CONFIRMED]
                </span>
              )}
              {e.status === 'error' && (
                <span className="text-rose-400 font-bold text-[11px] shrink-0">
                  [REVERTED]
                </span>
              )}
              {e.status === 'pending' && (
                <span className="text-[#e2fe52] font-bold text-[11px] flex items-center gap-1 shrink-0">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  [PENDING]
                </span>
              )}

              <div className="min-w-0">
                <div className="text-slate-200 font-semibold truncate">{e.label}</div>
                {e.error && (
                  <div className="text-rose-400 text-[11px] truncate mt-0.5">{e.error}</div>
                )}
                {e.sig && (
                  <div className="text-[#5c657a] text-[10px] truncate mt-0.5 select-all">
                    Sig: {e.sig.slice(0, 16)}...{e.sig.slice(-10)}
                  </div>
                )}
              </div>
            </div>

            {e.sig && (
              <div className="flex items-center gap-1.5 shrink-0">
                <a
                  href={explorerTx(e.sig)}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2 py-0.5 rounded bg-[#181b22] hover:bg-[#252a35] text-[#949eb2] hover:text-[#ff5500] text-[10px] font-bold border border-[#282d38] transition-colors flex items-center gap-1"
                >
                  <span>Explorer</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
