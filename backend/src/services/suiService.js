// src/services/suiService.js
import fetch from "node-fetch"; // Node 18 kullanıyorsan global fetch de kullanabilirsin

const SUI_RPC_URL =
  process.env.SUI_RPC_URL || "https://fullnode.testnet.sui.io"; // ihtiyacına göre değiştir

/**
 * Sui txDigest'ten, bu tx içindeki toplam SUI (0x2::sui::SUI) miktarını bulmaya çalışır.
 * Basit bir yaklaşım: balanceChanges / events içindeki coin değişimlerini okuyup topluyoruz.
 *
 * Not: Bu fonksiyon, kullandığın RPC versiyonuna göre küçük field name tweak'i gerektirebilir.
 */
export async function getSuiAmountFromTxDigest(txDigest) {
  const body = {
    jsonrpc: "2.0",
    id: 1,
    method: "sui_getTransactionBlock",
    params: [
      txDigest,
      {
        showEffects: true,
        showEvents: true,
        showBalanceChanges: true,
      },
    ],
  };

  const res = await fetch(SUI_RPC_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`Sui RPC error: HTTP ${res.status}`);
  }

  const json = await res.json();

  if (!json.result) {
    throw new Error("Sui RPC response has no result");
  }

  const result = json.result;

  // --- 1) Balance changes üzerinden miktarı bulmaya çalış ---
  const balanceChanges = result.balanceChanges || []; // bazı client'larda effects.balanceChanges olabilir

  // SUI coinType: 0x2::sui::SUI
  const SUI_COIN_TYPE = "0x2::sui::SUI";

  let totalSui = 0;

  for (const change of balanceChanges) {
    if (change.coinType === SUI_COIN_TYPE && typeof change.amount === "string") {
      const val = Number(change.amount);
      if (!Number.isNaN(val)) {
        // burada istersen sadece pozitifleri say, istersen mutlak değer al
        totalSui += Math.abs(val);
      }
    }
  }

  if (totalSui <= 0) {
    // fallback: event'ler üzerinden bakmak istersen buraya ek logic koyabilirsin
    console.warn(
      "[getSuiAmountFromTxDigest] Could not find positive SUI amount, returning 0"
    );
  }

  return totalSui;
}
