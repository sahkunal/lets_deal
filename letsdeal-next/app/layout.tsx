import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { WalletContextProvider } from "@/components/WalletContextProvider";
import SubpageVideoBackground from "@/components/SubpageVideoBackground";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#01050C",
};

export const metadata: Metadata = {
  title: "LetsDeal — Non-Custodial OTC Escrow on Solana",
  description:
    "Trustless, atomic SOL ⇄ NFT over-the-counter swaps powered by Program Derived Address vaults on Solana.",
  keywords: ["solana", "escrow", "otc", "nft", "defi", "web3"],
  icons: {
    icon: [
      { url: "/currency.png" },
      { url: "/icon.png" },
    ],
    apple: "/currency.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={inter.variable}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body
        className="bg-[#060B14] text-[#F5F7FA] antialiased overflow-x-hidden"
        suppressHydrationWarning
      >
        <SubpageVideoBackground />
        <WalletContextProvider>
          {children}
        </WalletContextProvider>
      </body>
    </html>
  );
}

