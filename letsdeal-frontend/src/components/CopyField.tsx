import React, { FC, useState } from 'react';
import { Copy, Check } from 'lucide-react';

export const CopyField: FC<{
  label?: string;
  value: string;
  truncate?: boolean;
}> = ({ label, value, truncate }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayVal = truncate && value.length > 28
    ? `${value.slice(0, 12)}...${value.slice(-10)}`
    : value;

  return (
    <div className="flex flex-col gap-1 w-full font-mono">
      {label && (
        <span className="text-[10px] uppercase tracking-wider text-[#949eb2]">
          {label}
        </span>
      )}
      <div className="flex items-center justify-between gap-2 px-3 py-2 rounded bg-[#08090b] border border-[#21252e] text-xs text-[#f1f3f7]">
        <span className="truncate select-all" title={value}>
          {displayVal}
        </span>
        <button
          onClick={handleCopy}
          className="p-1 rounded hover:bg-[#1a1d24] text-[#949eb2] hover:text-[#ff5500] transition-colors shrink-0"
          title="Copy address"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-[#ff5500]" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
};
