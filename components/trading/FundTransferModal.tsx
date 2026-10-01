import React, { useState } from "react";
import { X, ArrowRightLeft, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";

interface FundTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  mainBalance: number;
  tradingBalance: number;
  onTransfer: (from: "main" | "trading", to: "main" | "trading", amount: number) => void;
}

const FundTransferModal: React.FC<FundTransferModalProps> = ({
  isOpen,
  onClose,
  mainBalance,
  tradingBalance,
  onTransfer
}) => {
  const [direction, setDirection] = useState<"main_to_trading" | "trading_to_main">("main_to_trading");
  const [amount, setAmount] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const isMainToTrading = direction === "main_to_trading";
  const sourceBalance = isMainToTrading ? mainBalance : tradingBalance;
  const targetBalance = isMainToTrading ? tradingBalance : mainBalance;

  const handleSwapDirection = () => {
    setDirection(prev => prev === "main_to_trading" ? "trading_to_main" : "main_to_trading");
    setAmount("");
    setError(null);
    setSuccessMsg(null);
  };

  const handleSetAmount = (val: number) => {
    const clamped = Math.min(val, sourceBalance);
    setAmount(clamped.toString());
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const parsedAmount = parseFloat(amount);

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Please enter a valid transfer amount");
      return;
    }

    if (parsedAmount > sourceBalance) {
      setError("Transfer amount exceeds available balance");
      return;
    }

    if (isMainToTrading) {
      onTransfer("main", "trading", parsedAmount);
    } else {
      onTransfer("trading", "main", parsedAmount);
    }

    setSuccessMsg(`Successfully migrated $${parsedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
    setTimeout(() => {
      setSuccessMsg(null);
      setAmount("");
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="w-full max-w-md bg-zinc-950/95 border border-zinc-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden text-white"
        role="dialog"
        aria-modal="true"
        aria-labelledby="fund-transfer-title"
      >
        {/* Glow ambient background */}
        <div className="absolute -top-16 -right-16 w-44 h-44 bg-[hsl(var(--primary-500)/0.15)] rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between pb-4 border-b border-zinc-900 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h3 id="fund-transfer-title" className="text-base font-black uppercase tracking-tight">Fund Migration</h3>
              <p className="text-[11px] text-zinc-500 font-medium">Instant zero-fee internal rebalance</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {successMsg ? (
          <div className="py-10 text-center space-y-3">
            <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="text-lg font-black text-white">Transfer Complete</h4>
            <p className="text-xs text-zinc-400 font-medium">{successMsg}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Direction Cards */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-zinc-400 uppercase tracking-widest px-1">
                <span>From</span>
                <span className="text-zinc-500">Avail: ${sourceBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
                <div>
                  <p className="text-sm font-black text-white">
                    {isMainToTrading ? "Main Account (Funding)" : "Trading Account (Terminal)"}
                  </p>
                  <p className="text-[10px] text-zinc-500 font-mono">
                    Balance: ${sourceBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSwapDirection}
                  title="Swap Direction"
                  className="w-9 h-9 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center transition-all"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] font-bold text-zinc-400 uppercase tracking-widest px-1 pt-1">
                <span>To</span>
                <span className="text-zinc-500">Current: ${targetBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/80">
                <p className="text-sm font-black text-indigo-400">
                  {isMainToTrading ? "Trading Account (Terminal)" : "Main Account (Funding)"}
                </p>
                <p className="text-[10px] text-zinc-500 font-mono">
                  Target Balance: ${targetBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                </p>
              </div>
            </div>

            {/* Amount input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-zinc-400 uppercase tracking-wider px-1">
                <span>Amount to Migrate</span>
                <button 
                  type="button" 
                  onClick={() => handleSetAmount(sourceBalance)}
                  className="text-indigo-400 hover:text-indigo-300 text-xs font-black uppercase tracking-wider"
                >
                  Transfer Max
                </button>
              </div>
              <div className="relative">
                <input 
                  type="number"
                  step="any"
                  min="0"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setError(null);
                  }}
                  placeholder="0.00"
                  className="w-full bg-zinc-900/90 border border-zinc-800 rounded-2xl py-4 pl-4 pr-16 text-xl font-bold font-mono text-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  required
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 text-xs font-black">USD</span>
              </div>

              {/* Quick Amount Chips */}
              <div className="flex gap-2 pt-1">
                {[25, 50, 100, 250, 500].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleSetAmount(val)}
                    className="flex-1 py-1.5 rounded-lg bg-zinc-900/80 border border-zinc-800 text-[10px] font-black text-zinc-400 hover:text-white hover:border-zinc-700 transition-all"
                  >
                    ${val}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-indigo-500/20 active:scale-95 transition-all"
              >
                Confirm Migration
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-zinc-500 text-[10px]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Instant internal ledger transfer • No blockchain fees</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default FundTransferModal;
