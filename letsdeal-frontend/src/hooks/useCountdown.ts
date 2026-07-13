import { useEffect, useState } from "react";

export function useCountdown(deadlineUnixSeconds: number | null) {
  const [now, setNow] = useState(() => Math.floor(Date.now() / 1000));

  useEffect(() => {
    const id = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(id);
  }, []);

  if (deadlineUnixSeconds === null) {
    return { label: "--:--:--", expired: false };
  }

  const diff = deadlineUnixSeconds - now;
  if (diff <= 0) {
    return { label: "expired", expired: true };
  }

  const h = Math.floor(diff / 3600);
  const m = Math.floor((diff % 3600) / 60);
  const s = diff % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");

  return { label: `${pad(h)}:${pad(m)}:${pad(s)}`, expired: false };
}
