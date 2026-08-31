import React, { FC, ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: ReactNode;
  subValue?: string;
  accent?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export const StatCard: FC<StatCardProps> = ({
  label,
  value,
  subValue,
  accent = 'text-[#f1f3f7]',
  icon: Icon
}) => (
  <div className="bg-[#13151a] border border-[#21252e] p-4 rounded-xl space-y-1.5 font-mono">
    <div className="flex items-center justify-between text-[11px] text-[#949eb2]">
      <span className="uppercase tracking-wider">{label}</span>
      {Icon && <Icon className="w-3.5 h-3.5 text-[#ff5500] opacity-75" />}
    </div>

    <div className={`text-xl font-bold tracking-tight ${accent}`}>
      {value}
    </div>

    {subValue && (
      <div className="text-[11px] text-[#5c657a] truncate">
        {subValue}
      </div>
    )}
  </div>
);
