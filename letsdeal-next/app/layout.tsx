import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LetsDeal — Non-Custodial OTC Escrow on Solana",
  description:
    "Trustless, atomic SOL ⇄ NFT over-the-counter swaps powered by Program Derived Address vaults on Solana.",
  keywords: ["solana", "escrow", "otc", "nft", "defi", "web3"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-[#060B14] text-[#F5F7FA] antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
