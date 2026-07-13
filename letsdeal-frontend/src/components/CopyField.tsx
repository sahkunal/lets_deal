import { FC, useState } from "react";

export const CopyField: FC<{ label: string; value: string }> = ({
  label,
  value,
}) => {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  return (
    <div>
      <div className="mono-label" style={{ marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input className="term-input" readOnly value={value} />
        <button className="term-btn" onClick={copy} style={{ minWidth: 90 }}>
          {copied ? "copied" : "copy"}
        </button>
      </div>
    </div>
  );
};
