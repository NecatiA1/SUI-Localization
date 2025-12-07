import type { Metadata } from "next";
import "./globals.css";
import { SuiProviders } from "./sui-provider";

export const metadata: Metadata = {
  title: "SUI Localization Demo",
  description: "Localization demo dapp on Sui",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SuiProviders>{children}</SuiProviders>
      </body>
    </html>
  );
}
