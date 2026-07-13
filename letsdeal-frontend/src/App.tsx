import { FC } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { WalletContextProvider } from "./wallet/WalletContextProvider";
import { RoleSelect } from "./pages/RoleSelect";
import { BuyerDashboard } from "./pages/BuyerDashboard";
import { SellerDashboard } from "./pages/SellerDashboard";

// HashRouter so `npm run build` output can be opened as static files or
// dropped on any static host without server-side route config.
export const App: FC = () => {
  return (
    <WalletContextProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<RoleSelect />} />
          <Route path="/buyer" element={<BuyerDashboard />} />
          <Route path="/seller" element={<SellerDashboard />} />
        </Routes>
      </HashRouter>
    </WalletContextProvider>
  );
};
