import React, { useState } from "react";
import { STRATEGY_BOTS, StrategyBot } from "../../data/strategies";
import { Bot, Zap, TrendingUp, Cpu, ShieldCheck, CheckCircle2, X, DollarSign, Activity, AlertCircle, ArrowUpRight } from "lucide-react";

interface ActiveDeployment {
  id: string;
  botId: string;
  botName: string;
  allocatedUsd: number;
  estRoi: string;
  currentProfit: number;
  status: "Running" | "Paused";
  startedAt: number;
}

interface StrategyHubProps {
  onBack: () => void;
  tradingBalance: number;
  onDeductBalance?: (amount: number) => void;
}

const StrategyHub: React.FC<StrategyHubProps> = ({ onBack, tradingBalance, onDeductBalance }) => {
  const [selectedBot, setSelectedBot] = useState<StrategyBot | null>(null);
  const [allocationInput, setAllocationInput] = useState<string>("500");
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeDeployments, setActiveDeployments] = useState<ActiveDeployment[]>([
    {
      id: "dep-1",
      botId: "bot-neural-arb",
      botName: "Neural Cross-DEX Arbitrage",
      allocatedUsd: 1250,
      estRoi: "14% – 28%",
      currentProfit: 86.40,
      status: "Running",
      startedAt: Date.now() - 3600000 * 72
    }
  ]);

  const handleOpenDeploy = (bot: StrategyBot) => {
    setSelectedBot(bot);
    setAllocationInput(bot.minInvestment.toString());
    setIsDeployModalOpen(true);
  };

  const handleConfirmDeploy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBot) return;

    const amount = parseFloat(allocationInput) || 0;
    if (amount < selectedBot.minInvestment) {
      setToastMessage(`Minimum allocation for this bot is $${selectedBot.minInvestment}`);
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    if (onDeductBalance && tradingBalance < amount) {
      setToastMessage("Insufficient trading balance");
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    if (onDeductBalance) {
      onDeductBalance(amount);
    }

    const newDep: ActiveDeployment = {
      id: `dep-${Date.now()}`,
      botId: selectedBot.id,
      botName: selectedBot.name,
      allocatedUsd: amount,
      estRoi: selectedBot.estRoi,
      currentProfit: 0.00,
      status: "Running",
      startedAt: Date.now()
    };

    setActiveDeployments(prev => [newDep, ...prev]);
    setIsDeployModalOpen(false);
    setToastMessage(`Strategy activated: $${amount} allocated to ${selectedBot.name}`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const getBotIcon = (name: string) => {
    switch (name) {
      case "Zap": return <Zap className="w-6 h-6 text-yellow-400" />;
      case "TrendingUp": return <TrendingUp className="w-6 h-6 text-emerald-400" />;
      case "Cpu": return <Cpu className="w-6 h-6 text-indigo-400" />;
      case "ShieldCheck": return <ShieldCheck className="w-6 h-6 text-purple-400" />;
      default: return <Bot className="w-6 h-6 text-cyan-400" />;
    }
  };

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
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-yellow-500/20 to-indigo-500/20 border border-yellow-500/30 flex items-center justify-center text-yellow-400">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg md:text-xl font-black uppercase tracking-tight">Auto-Trading & Roth IRA</h2>
              <span className="px-2 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-[10px] font-black uppercase tracking-wider">
                Non-Taxable Yield
              </span>
            </div>
            <p className="text-xs text-zinc-500 font-medium">Algorithmic execution bots, cross-exchange arbitrage, and SIP plans</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-right">
            <p className="text-[9px] text-zinc-500 font-bold uppercase">Trading Balance</p>
            <p className="text-sm font-black font-mono text-emerald-400">${tradingBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Roth IRA Tax-Free Banner */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-yellow-500/10 via-zinc-950 to-indigo-500/10 border border-yellow-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-yellow-500/15 flex items-center justify-center text-yellow-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-yellow-300 uppercase tracking-tight">Roth IRA Non-Taxable Umbrella</h3>
              <p className="text-xs text-zinc-400 leading-relaxed mt-0.5">
                All capital gains generated by automated strategy bots are sheltered from tax liability under Roth IRA account status.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 self-start md:self-auto shrink-0 font-mono text-xs">
            <div className="text-center px-4 py-2 rounded-xl bg-black/40 border border-white/5">
              <span className="text-[10px] text-zinc-500 block uppercase">Tax Drag</span>
              <span className="font-black text-emerald-400">0.00%</span>
            </div>
            <div className="text-center px-4 py-2 rounded-xl bg-black/40 border border-white/5">
              <span className="text-[10px] text-zinc-500 block uppercase">Execution</span>
              <span className="font-black text-cyan-400">24/7 Autopilot</span>
            </div>
          </div>
        </div>

        {/* Active Deployments */}
        {activeDeployments.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                Active Strategy Deployments
              </h3>
              <span className="text-xs text-zinc-500 font-mono">{activeDeployments.length} Running</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeDeployments.map(dep => (
                <div key={dep.id} className="p-6 rounded-3xl bg-zinc-950/80 border border-zinc-800 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-black text-white">{dep.botName}</h4>
                      <p className="text-[10px] text-zinc-500 font-mono">Running since {new Date(dep.startedAt).toLocaleDateString()}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase flex items-center gap-1.5 border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {dep.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
                    <div>
                      <p className="text-[9px] text-zinc-500 font-bold uppercase">Allocated</p>
                      <p className="text-sm font-black font-mono text-white">${dep.allocatedUsd.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-zinc-500 font-bold uppercase">Target ROI</p>
                      <p className="text-sm font-black font-mono text-indigo-400">{dep.estRoi}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-zinc-500 font-bold uppercase">Current Net Yield</p>
                      <p className="text-sm font-black font-mono text-emerald-400">+${dep.currentProfit.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Strategy Bots Catalog */}
        <div className="space-y-4">
          <h3 className="text-sm font-black uppercase tracking-wider text-zinc-400">Available AI & Strategy Bots</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {STRATEGY_BOTS.map(bot => (
              <div
                key={bot.id}
                className="p-7 rounded-3xl bg-zinc-950/70 border border-zinc-800/80 hover:border-yellow-500/40 hover:bg-zinc-900/30 transition-all duration-300 flex flex-col justify-between shadow-2xl relative overflow-hidden group"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                        {getBotIcon(bot.iconName)}
                      </div>
                      <div>
                        <h4 className="text-base font-black text-white group-hover:text-yellow-400 transition-colors">
                          {bot.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">{bot.category}</span>
                          <span className="text-zinc-600">•</span>
                          <span className="text-[10px] font-bold text-yellow-400/90">{bot.tag}</span>
                        </div>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-zinc-900 border border-zinc-800 text-zinc-300">
                      Risk: {bot.riskLevel}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                    {bot.description}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 text-center font-mono">
                    <div>
                      <p className="text-[9px] text-zinc-500 font-bold uppercase mb-0.5">Est. ROI</p>
                      <p className="text-xs font-black text-emerald-400">{bot.estRoi}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-zinc-500 font-bold uppercase mb-0.5">Win Rate</p>
                      <p className="text-xs font-black text-white">{bot.winRate}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-zinc-500 font-bold uppercase mb-0.5">Min Capital</p>
                      <p className="text-xs font-black text-white">${bot.minInvestment}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenDeploy(bot)}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-zinc-950 font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-yellow-500/10 flex items-center justify-center gap-2 active:scale-95 transition-all"
                  >
                    <span>Deploy Strategy Bot</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Deployment Modal */}
      {isDeployModalOpen && selectedBot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden text-white">
            <button
              onClick={() => setIsDeployModalOpen(false)}
              className="w-8 h-8 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center absolute top-6 right-6 transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3.5 mb-6 pb-6 border-b border-zinc-900 pr-10">
              <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                {getBotIcon(selectedBot.iconName)}
              </div>
              <div>
                <h3 className="text-lg font-black text-white">{selectedBot.name}</h3>
                <p className="text-xs text-yellow-400 font-mono mt-0.5">Target Yield: {selectedBot.estRoi} • Zero Tax Drag</p>
              </div>
            </div>

            <form onSubmit={handleConfirmDeploy} className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                  <span>Allocation Capital (USD)</span>
                  <span className="text-zinc-500">Available: ${tradingBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    min={selectedBot.minInvestment}
                    value={allocationInput}
                    onChange={(e) => setAllocationInput(e.target.value)}
                    className="w-full bg-zinc-900/90 border border-zinc-800 rounded-2xl py-3.5 pl-10 pr-4 text-xl font-mono font-bold text-white outline-none focus:border-yellow-500 transition-all"
                    required
                  />
                  <DollarSign className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                </div>

                <div className="flex gap-2 pt-1">
                  {[selectedBot.minInvestment, 250, 500, 1000, 2500].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setAllocationInput(val.toString())}
                      className="flex-1 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-[10px] font-bold text-zinc-400 hover:text-white hover:border-zinc-700 transition-all"
                    >
                      ${val}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Execution Mode:</span>
                  <span className="font-bold text-white">Full-Auto 24/7 Rebalance</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Fee Structure:</span>
                  <span className="font-black text-emerald-400">0% Commission (Velo Pro Engine)</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-zinc-950 font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-yellow-500/20 active:scale-95 transition-all"
              >
                INITIALIZE BOT ALLOCATION
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StrategyHub;
