import React, { useState } from "react";
import { PREDICTION_MARKETS, PredictionMarket, PredictionPosition } from "../../data/predictions";
import { Scale, CheckCircle2, TrendingUp, X, Sparkles, AlertCircle, DollarSign, Wallet, Clock } from "lucide-react";

interface PredictionTerminalProps {
  onBack: () => void;
  tradingBalance: number;
  onDeductBalance?: (amount: number) => void;
}

const PredictionTerminal: React.FC<PredictionTerminalProps> = ({ onBack, tradingBalance, onDeductBalance }) => {
  const [activeTab, setActiveTab] = useState<"markets" | "portfolio">("markets");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedMarket, setSelectedMarket] = useState<PredictionMarket | null>(null);
  const [selectedOutcome, setSelectedOutcome] = useState<string>("Yes");
  const [betAmountInput, setBetAmountInput] = useState<string>("50");
  const [isBetModalOpen, setIsBetModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [positions, setPositions] = useState<PredictionPosition[]>([
    {
      id: "pos-1",
      marketId: 1,
      question: "Bitcoin breaks $120,000 before End of Q4 2026?",
      outcome: "Yes",
      amountUsd: 100,
      shares: 156.25,
      avgPrice: 0.64,
      currentPrice: 0.68,
      isOpen: true,
      timestamp: Date.now() - 3600000 * 12
    },
    {
      id: "pos-2",
      marketId: 3,
      question: "US Federal Reserve cuts benchmark interest rate at next FOMC?",
      outcome: "Yes",
      amountUsd: 150,
      shares: 176.47,
      avgPrice: 0.85,
      currentPrice: 0.89,
      isOpen: true,
      timestamp: Date.now() - 3600000 * 48
    }
  ]);

  const categories = ["All", "Crypto", "Tech", "Macro", "Politics"];

  const filteredMarkets = PREDICTION_MARKETS.filter(m => {
    return selectedCategory === "All" || m.category === selectedCategory;
  });

  const parsedAmount = parseFloat(betAmountInput) || 0;
  const outcomeIndex = selectedMarket ? selectedMarket.outcomes.indexOf(selectedOutcome) : 0;
  const pricePerShare = (selectedMarket && outcomeIndex !== -1) ? selectedMarket.outcome_prices[outcomeIndex] : 0.50;
  const estimatedShares = pricePerShare > 0 ? parsedAmount / pricePerShare : 0;
  const potentialPayout = estimatedShares * 1.0; // Each winning share pays $1.00

  const handleOpenBetModal = (market: PredictionMarket, outcome: string) => {
    setSelectedMarket(market);
    setSelectedOutcome(outcome);
    setBetAmountInput("50");
    setIsBetModalOpen(true);
  };

  const handleConfirmBet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMarket || parsedAmount <= 0) return;

    if (onDeductBalance && tradingBalance < parsedAmount) {
      setToastMessage("Insufficient trading balance for this prediction");
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    if (onDeductBalance) {
      onDeductBalance(parsedAmount);
    }

    const newPosition: PredictionPosition = {
      id: `pos-${Date.now()}`,
      marketId: selectedMarket.id,
      question: selectedMarket.question,
      outcome: selectedOutcome,
      amountUsd: parsedAmount,
      shares: parseFloat(estimatedShares.toFixed(2)),
      avgPrice: pricePerShare,
      currentPrice: pricePerShare,
      isOpen: true,
      timestamp: Date.now()
    };

    setPositions(prev => [newPosition, ...prev]);
    setIsBetModalOpen(false);
    setToastMessage(`Prediction placed: $${parsedAmount} on ${selectedOutcome} (${selectedMarket.category})`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleClosePosition = (posId: string) => {
    setPositions(prev => prev.map(p => {
      if (p.id === posId) {
        return { ...p, isOpen: false };
      }
      return p;
    }));
    setToastMessage("Position settled and profits realized");
    setTimeout(() => setToastMessage(null), 3000);
  };

  const activePositions = positions.filter(p => p.isOpen);
  const closedPositions = positions.filter(p => !p.isOpen);

  return (
    <div className="flex-1 flex flex-col bg-[hsl(var(--color-bg))] overflow-y-auto pb-28 md:pb-8 text-white relative select-none">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
          <div className="px-5 py-3 rounded-full bg-zinc-900/95 border border-indigo-500/40 shadow-2xl flex items-center gap-2.5 text-xs font-bold text-white">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Top Banner & Header */}
      <div className="border-b border-zinc-900 bg-zinc-950/60 backdrop-blur-xl px-4 md:px-8 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg md:text-xl font-black uppercase tracking-tight">Prediction Terminal</h2>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-wider">
                Polymarket Protocol
              </span>
            </div>
            <p className="text-xs text-zinc-500 font-medium">Trade on real-world events, crypto milestones, and elections</p>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-2 bg-zinc-900/80 p-1 rounded-2xl border border-zinc-800 self-start md:self-auto">
          <button
            onClick={() => setActiveTab("markets")}
            className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              activeTab === "markets"
                ? "bg-cyan-600 text-white shadow-lg shadow-cyan-600/30"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Live Events
          </button>
          <button
            onClick={() => setActiveTab("portfolio")}
            className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeTab === "portfolio"
                ? "bg-cyan-600 text-white shadow-lg shadow-cyan-600/30"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <span>Positions</span>
            <span className="w-4 h-4 rounded-full bg-zinc-800 text-[9px] flex items-center justify-center font-mono">
              {activePositions.length}
            </span>
          </button>
        </div>
      </div>

      <div className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-6">
        {activeTab === "markets" ? (
          <>
            {/* Category filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? "bg-cyan-500 text-zinc-950 font-black shadow-lg shadow-cyan-500/25"
                      : "bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Markets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {filteredMarkets.map(market => {
                const yesPrice = market.outcome_prices[0] * 100;
                const noPrice = market.outcome_prices[1] * 100;

                return (
                  <div
                    key={market.id}
                    className="p-6 rounded-3xl bg-zinc-950/60 border border-zinc-800/80 hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between shadow-xl space-y-6"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-[10px] font-black uppercase text-cyan-400 tracking-wider">
                          {market.category}
                        </span>
                        <div className="flex items-center gap-3 text-[10px] text-zinc-500 font-bold uppercase">
                          <span>Vol: {market.volume_24h}</span>
                          <span>•</span>
                          <span>Liq: {market.liquidity}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        {market.image_url && (
                          <div className="w-12 h-12 rounded-2xl bg-white p-2 shrink-0 border border-white/10 flex items-center justify-center">
                            <img src={market.image_url} alt="" className="max-w-full max-h-full object-contain" />
                          </div>
                        )}
                        <div>
                          <h3 className="text-base font-black leading-snug text-white hover:text-cyan-400 transition-colors">
                            {market.question}
                          </h3>
                          <p className="text-[10px] text-zinc-500 font-mono mt-1">Resolution: {market.endDate}</p>
                        </div>
                      </div>
                    </div>

                    {/* Outcome buttons */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <button
                        onClick={() => handleOpenBetModal(market, "Yes")}
                        className="py-3 px-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500 hover:text-white transition-all group flex items-center justify-between"
                      >
                        <span className="text-xs font-black uppercase tracking-wider text-emerald-400 group-hover:text-white">
                          YES
                        </span>
                        <span className="text-sm font-black font-mono text-emerald-400 group-hover:text-white">
                          {yesPrice.toFixed(0)}¢
                        </span>
                      </button>

                      <button
                        onClick={() => handleOpenBetModal(market, "No")}
                        className="py-3 px-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500 hover:text-white transition-all group flex items-center justify-between"
                      >
                        <span className="text-xs font-black uppercase tracking-wider text-rose-400 group-hover:text-white">
                          NO
                        </span>
                        <span className="text-sm font-black font-mono text-rose-400 group-hover:text-white">
                          {noPrice.toFixed(0)}¢
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          /* Portfolio tab */
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-zinc-400 mb-3">Active Prediction Contracts</h3>
              {activePositions.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-zinc-950/60 border border-zinc-900 text-zinc-500 text-xs">
                  No active predictions yet. Browse live events to take an outcome position.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activePositions.map(pos => {
                    const pnl = (pos.currentPrice - pos.avgPrice) * pos.shares;
                    const pnlPct = ((pos.currentPrice - pos.avgPrice) / pos.avgPrice) * 100;
                    const isProfitable = pnl >= 0;

                    return (
                      <div key={pos.id} className="p-6 rounded-3xl bg-zinc-950/80 border border-zinc-800 space-y-4 shadow-xl">
                        <div className="flex items-start justify-between">
                          <h4 className="text-sm font-black text-white leading-tight max-w-[280px]">
                            {pos.question}
                          </h4>
                          <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase ${
                            pos.outcome === "Yes" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          }`}>
                            POSITION: {pos.outcome}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-3 p-3 rounded-2xl bg-zinc-900/50 border border-zinc-800/60">
                          <div>
                            <p className="text-[9px] text-zinc-500 font-bold uppercase">Invested</p>
                            <p className="text-xs font-black text-white font-mono">${pos.amountUsd.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-[9px] text-zinc-500 font-bold uppercase">Shares</p>
                            <p className="text-xs font-black text-white font-mono">{pos.shares.toFixed(1)}</p>
                          </div>
                          <div>
                            <p className="text-[9px] text-zinc-500 font-bold uppercase">Unrealized PnL</p>
                            <p className={`text-xs font-black font-mono ${isProfitable ? "text-emerald-400" : "text-rose-400"}`}>
                              {isProfitable ? "+" : ""}${pnl.toFixed(2)} ({pnlPct.toFixed(1)}%)
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleClosePosition(pos.id)}
                          className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-black uppercase text-zinc-300 hover:text-white transition-all"
                        >
                          Settle / Liquidate Position
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {closedPositions.length > 0 && (
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-zinc-500 mb-3">Settled / Closed Trades</h3>
                <div className="space-y-3">
                  {closedPositions.map(pos => (
                    <div key={pos.id} className="p-4 rounded-2xl bg-zinc-950/40 border border-zinc-900 flex items-center justify-between text-xs opacity-75">
                      <div>
                        <p className="font-bold text-zinc-300">{pos.question}</p>
                        <p className="text-[10px] text-zinc-500 font-mono">Outcome: {pos.outcome} • Invested: ${pos.amountUsd}</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-zinc-900 text-[10px] font-bold text-zinc-400">
                        SETTLED
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bet Modal */}
      {isBetModalOpen && selectedMarket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden text-white">
            <button
              onClick={() => setIsBetModalOpen(false)}
              className="w-8 h-8 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center absolute top-6 right-6 transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-wider inline-block mb-3">
              {selectedMarket.category}
            </span>

            <h3 className="text-lg font-black leading-snug text-white mb-6 pr-8">
              {selectedMarket.question}
            </h3>

            <form onSubmit={handleConfirmBet} className="space-y-6">
              {/* Outcome picker */}
              <div>
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-2">Selected Outcome</label>
                <div className="grid grid-cols-2 gap-3">
                  {selectedMarket.outcomes.map((o, idx) => {
                    const price = selectedMarket.outcome_prices[idx] * 100;
                    const isSelected = selectedOutcome === o;
                    return (
                      <button
                        key={o}
                        type="button"
                        onClick={() => setSelectedOutcome(o)}
                        className={`py-3.5 px-4 rounded-2xl border text-sm font-black uppercase tracking-wider flex items-center justify-between transition-all ${
                          isSelected
                            ? "bg-cyan-500 text-zinc-950 border-cyan-400 shadow-xl shadow-cyan-500/25"
                            : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
                        }`}
                      >
                        <span>{o}</span>
                        <span className="font-mono text-xs">{price.toFixed(0)}¢</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Amount input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                  <span>Investment Amount (USD)</span>
                  <span className="text-zinc-500">Trading Balance: ${tradingBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    min="1"
                    value={betAmountInput}
                    onChange={(e) => setBetAmountInput(e.target.value)}
                    className="w-full bg-zinc-900/90 border border-zinc-800 rounded-2xl py-3.5 pl-10 pr-4 text-xl font-mono font-bold text-white outline-none focus:border-cyan-500 transition-all"
                    required
                  />
                  <DollarSign className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                </div>

                {/* Quick Chips */}
                <div className="flex gap-2 pt-1">
                  {[10, 25, 50, 100, 250].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setBetAmountInput(val.toString())}
                      className="flex-1 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-[10px] font-bold text-zinc-400 hover:text-white hover:border-zinc-700 transition-all"
                    >
                      ${val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary Payout */}
              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Estimated Contracts:</span>
                  <span className="font-mono font-bold text-white">{estimatedShares.toFixed(2)} shares</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Potential Payout:</span>
                  <span className="font-mono font-black text-emerald-400">${potentialPayout.toFixed(2)} USD</span>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-cyan-500/20 active:scale-95 transition-all"
              >
                PLACE {selectedOutcome.toUpperCase()} PREDICTION
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictionTerminal;
