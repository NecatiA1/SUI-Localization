"use client";

import { useState, useEffect } from "react";
import { localizationClient } from "@/lib/localizationClient";

// Sui dApp Kit
import {
  ConnectButton,
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";

// --- Types (backend response'larına göre) ---
type StartResponse = {
  geoTxId: number;
  createdAt: string;
  city: {
    id: number;
    name: string;
    countryCode: string;
  };
};

type ConfirmResponse = {
  geoTxId: number;
  status: string;
  txScore: string;
  confirmedAt: string;
  amountSui?: number;
};

export default function DemoPage() {
  // Cüzdandan gelen hesap
  const account = useCurrentAccount();

  // dApp Kit hook’u ile tx imzalama + çalıştırma
  const { mutate: signAndExecuteTransaction, isPending: sendingTx } =
    useSignAndExecuteTransaction();

  // UI state
  const [userAddress, setUserAddress] = useState<string>("");
  const [recipient, setRecipient] = useState<string>(
    "0x17045ff5d6b4b308617b81a9157d4288364390493d5b88f47eb523513138685a" // buraya kendi testnet adresini koy
  );
  const [amountSui, setAmountSui] = useState<string>("0.1");

  const [txDigest, setTxDigest] = useState<string>("");
  const [geoTxId, setGeoTxId] = useState<number | null>(null);

  const [startResult, setStartResult] = useState<StartResponse | null>(null);
  const [confirmResult, setConfirmResult] = useState<ConfirmResponse | null>(
    null
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cüzdan bağlandığında userAddress'i otomatik doldur
  useEffect(() => {
    if (account?.address) {
      setUserAddress(account.address);
    }
  }, [account]);

  // 1) START: konum izni + şehir çözümü + geo intent
  async function handleStart() {
    if (!account?.address) {
      setError("Please connect a Sui wallet first.");
      return;
    }

    try {
      setError(null);
      setLoading(true);
      setConfirmResult(null);

      const res = await localizationClient.startWithLocation({
        userAddress: account.address,
        meta: {
          demo: true,
          note: "Hackathon demo",
        },
      });

      setStartResult(res);
      setGeoTxId(res.geoTxId);
    } catch (err: any) {
      console.error("startWithLocation error", err);
      setError(err?.message || "Start failed");
    } finally {
      setLoading(false);
    }
  }

  // 2) PAY & CONFIRM: cüzdandan SUI gönder + txDigest ile backend confirm
  async function handlePayAndConfirm() {
    if (!account?.address) {
      setError("Please connect a Sui wallet first.");
      return;
    }

    if (!geoTxId) {
      setError("You need to run Start first.");
      return;
    }

    if (!recipient) {
      setError("Please set a recipient address.");
      return;
    }

    const numericAmount = Number(amountSui);
    if (!numericAmount || Number.isNaN(numericAmount) || numericAmount <= 0) {
      setError("Please enter a valid SUI amount.");
      return;
    }

    try {
      setError(null);
      setLoading(true);

      // 2.1. Sui Transaction oluştur
      const tx = new Transaction();

      // SUI birimi: MIST (1 SUI = 10^9 MIST)
      const amountInMist = Math.floor(numericAmount * 1_000_000_000);

      // Gas coin'den belirtilen miktarı ayır
      const [coin] = tx.splitCoins(tx.gas, [amountInMist]);

      // Bu coin'i recipient'a gönder
      tx.transferObjects([coin], recipient);

      // 2.2. Cüzdandan imzala + çalıştır
      signAndExecuteTransaction(
        {
          transaction: tx,
          // dapp-kit network default'un testnet olduğunu varsayıyoruz
          chain: "sui:testnet",
        },
        {
          onSuccess: async (result) => {
            console.log("Executed transaction:", result);
            const digest = result.digest;
            setTxDigest(digest);

            try {
              // 2.3. Localization backend'ine confirm at
              console.log("Calling confirm() with geoTxId:", geoTxId);
              const confirmRes = await localizationClient.confirm({
                geoTxId,
                txDigest: digest,
              });
              console.log("confirm() result:", confirmRes);
              setConfirmResult(confirmRes);
            } catch (confirmErr: any) {
              console.error("confirm error", confirmErr);
              setError(
                confirmErr?.message ||
                  "Payment succeeded but confirm() failed on backend."
              );
            } finally {
              setLoading(false);
            }
          },
          onError: (walletErr) => {
            console.error("Wallet tx error", walletErr);
            setError("Transaction rejected or failed in wallet.");
            setLoading(false);
          },
        }
      );
    } catch (err: any) {
      console.error("handlePayAndConfirm error", err);
      setError(err?.message || "Pay & Confirm failed");
      setLoading(false);
    }
  }

  const isGlobalLoading = loading || sendingTx;

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
      <div className="w-full max-w-2xl p-6 rounded-2xl border border-slate-800 bg-slate-900/70 shadow-lg space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Localization Demo Dapp</h1>
            <p className="text-xs text-slate-400 mt-1">
              Connect wallet → Start (location intent) → Pay & Confirm.
            </p>
          </div>
          <ConnectButton />
        </div>

        {/* Wallet info */}
        <div className="text-xs text-slate-300 border border-slate-800 bg-slate-950/40 rounded-md px-3 py-2">
          {account ? (
            <>
              <div className="font-semibold">Connected wallet</div>
              <div className="break-all text-slate-200 text-[11px]">
                {account.address}
              </div>
            </>
          ) : (
            <span>No wallet connected. Please connect first.</span>
          )}
        </div>

        {/* Inputs */}
        <div className="space-y-3 text-sm">
          <div>
            <label className="block text-sm mb-1">
              Recipient (Sui address)
            </label>
            <input
              className="w-full px-3 py-2 rounded-md bg-slate-800 border border-slate-700 text-xs"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
            <p className="mt-1 text-[11px] text-slate-500">
              Use a testnet address you control for the demo.
            </p>
          </div>

          <div>
            <label className="block text-sm mb-1">Amount (SUI)</label>
            <input
              type="number"
              className="w-full px-3 py-2 rounded-md bg-slate-800 border border-slate-700 text-xs"
              value={amountSui}
              onChange={(e) => setAmountSui(e.target.value)}
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="text-sm text-red-400 border border-red-500/40 bg-red-500/10 px-3 py-2 rounded-md">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleStart}
            disabled={isGlobalLoading || !account}
            className="flex-1 py-2 rounded-md bg-emerald-500 hover:bg-emerald-600 text-sm font-semibold disabled:opacity-50"
          >
            1️⃣ Start (Intent + Location)
          </button>
          <button
            onClick={handlePayAndConfirm}
            disabled={isGlobalLoading || !account}
            className="flex-1 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-sm font-semibold disabled:opacity-50"
          >
            2️⃣ Pay & Confirm (Wallet Tx)
          </button>
        </div>

        {/* Results */}
        <div className="space-y-3 text-sm">
          <div>
            <h2 className="font-semibold mb-1">Start Result</h2>
            <pre className="bg-slate-950/60 border border-slate-800 rounded-md p-3 text-xs overflow-x-auto">
              {startResult
                ? JSON.stringify(startResult, null, 2)
                : "Not called yet."}
            </pre>
          </div>

          <div>
            <h2 className="font-semibold mb-1">Last txDigest</h2>
            <pre className="bg-slate-950/60 border border-slate-800 rounded-md p-3 text-xs overflow-x-auto">
              {txDigest || "No transaction executed yet."}
            </pre>
          </div>

          <div>
            <h2 className="font-semibold mb-1">Confirm Result</h2>
            <pre className="bg-slate-950/60 border border-slate-800 rounded-md p-3 text-xs overflow-x-auto">
              {confirmResult
                ? JSON.stringify(confirmResult, null, 2)
                : "Not called yet."}
            </pre>
          </div>
        </div>
      </div>
    </main>
  );
}
