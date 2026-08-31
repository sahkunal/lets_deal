import { FC } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { WalletContextProvider } from "./wallet/WalletContextProvider";
import { HomePage } from "./pages/HomePage";
import { AppPage } from "./pages/AppPage";
import { DevelopersPage } from "./pages/DevelopersPage";
import { ExplorerPage } from "./pages/ExplorerPage";

export const App: FC = () => {
  return (
    <WalletContextProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/app" element={<AppPage />} />
          <Route path="/trade" element={<AppPage />} />
          <Route path="/buyer" element={<AppPage />} />
          <Route path="/seller" element={<AppPage />} />
          <Route path="/developers" element={<DevelopersPage />} />
          <Route path="/docs" element={<DevelopersPage />} />
          <Route path="/explorer" element={<ExplorerPage />} />
        </Routes>
      </HashRouter>
    </WalletContextProvider>
  );
};
