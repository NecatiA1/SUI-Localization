"use client";

import {
  createNetworkConfig,
  SuiClientProvider,
  WalletProvider,
} from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import "@mysten/dapp-kit/dist/index.css";

// Hangi ağlara bağlanacağımızı tanımlıyoruz
const { networkConfig } = createNetworkConfig({
  // İstersen devnet veya localnet de ekleyebilirsin
  testnet: { url: getFullnodeUrl("testnet") },
});

const queryClient = new QueryClient();

export function SuiProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
        <WalletProvider>{children}</WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}
