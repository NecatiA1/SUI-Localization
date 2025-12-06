import React from "react";
import useGlobalStore from "@/store/useGlobalStore";

export default function UserModal() {
  const { selectedUser, userTransactions, closeUserModal } = useGlobalStore();

  if (!selectedUser) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={closeUserModal}></div>
      <div className="relative bg-[#1e293b] border border-blue-500/30 w-full max-w-2xl rounded-xl shadow-[0_0_50px_rgba(59,130,246,0.2)] animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 border-b border-slate-700 shrink-0 relative">
          <button onClick={closeUserModal} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">✕</button>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-slate-700 flex items-center justify-center border-2 border-blue-500/50">
              <span className="text-2xl">👤</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white font-mono tracking-wide">{selectedUser.address}</h3>
              <div className="flex items-center gap-2 text-sm text-blue-400 mt-1">
                <span>Verified Wallet</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-400">
              <thead className="text-xs uppercase bg-slate-800/50 text-slate-300">
                <tr>
                  <th className="px-4 py-3 rounded-tl-lg">Hash</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3 rounded-tr-lg">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {/* Store'dan gelen userTransactions kullanılıyor */}
                {userTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-blue-300 cursor-pointer hover:underline">{tx.hash}</td>
                    <td className="px-4 py-3 font-medium text-white">{tx.amount}</td>
                    <td className="px-4 py-3 text-xs">{tx.time}</td>
                    <td className="px-4 py-3"><span className="text-xs bg-green-500/10 text-green-400 px-2 py-0.5 rounded border border-green-500/20">{tx.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}