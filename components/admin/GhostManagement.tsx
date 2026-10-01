import React, { useState } from 'react';
import { useGhostTraders, triggerManualTrade, MasterTrader } from '../../hooks/useGhostTraders';
import { useMarketData } from '../../hooks/useMarketData';
import { Zap } from 'lucide-react';

const GhostManagement: React.FC = () => {
  const { traders, loading } = useGhostTraders();
  const { ticker } = useMarketData('BTCUSDT');
  const [triggering, setTriggering] = useState<string | null>(null);

  const handleTrigger = async (trader: MasterTrader) => {
    setTriggering(trader.id);
    try {
      await triggerManualTrade(trader, ticker);
      // Flash success state or similar
    } catch (error) {
      console.error('Failed to trigger trade:', error);
    } finally {
      setTimeout(() => setTriggering(null), 1000);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-6 overflow-hidden">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Ghost Management</h2>
          <p className="text-zinc-500 text-xs uppercase tracking-widest mt-1">Simulated Trader Overrides & Monitoring</p>
        </div>
        <div className="px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-xl flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Global Simulation: Active</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {traders.map((trader) => (
            <div 
              key={trader.id}
              className="bg-zinc-950 border border-zinc-900 rounded-2xl p-5 flex flex-col gap-4 hover:border-zinc-800 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img 
                    src={trader.avatar} 
                    alt={trader.name} 
                    className="w-14 h-14 rounded-xl border border-zinc-800 object-cover"
                  />
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-zinc-950 flex items-center justify-center text-[8px] ${
                    trader.riskLevel === 'Low' ? 'bg-emerald-500' : trader.riskLevel === 'Medium' ? 'bg-amber-500' : 'bg-rose-500'
                  }`}>
                    {trader.riskLevel[0]}
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-black uppercase tracking-widest text-sm">{trader.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">{trader.strategy.preferredPairs[0]} Specialist</span>
                    <span className="w-1 h-1 rounded-full bg-zinc-800" />
                    <span className="text-[10px] text-cyan-400 font-black tracking-widest">{trader.roi}% ROI</span>
                  </div>
                </div>
                <button
                  onClick={() => handleTrigger(trader)}
                  disabled={triggering === trader.id}
                  className={`flex items-center gap-1.5 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    triggering === trader.id 
                      ? 'bg-emerald-500 text-white scale-95' 
                      : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800'
                  }`}
                >
                  <Zap className={`w-3.5 h-3.5 ${triggering === trader.id ? 'animate-bounce text-white' : 'text-amber-400'}`} />
                  <span>{triggering === trader.id ? 'Executing' : 'Trigger Trade'}</span>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-zinc-900/30 rounded-xl border border-zinc-900/50">
                  <div className="text-[8px] text-zinc-600 uppercase font-black tracking-widest mb-1">Win Rate</div>
                  <div className="text-xs font-black text-white tracking-widest">{trader.winRate}%</div>
                </div>
                <div className="p-3 bg-zinc-900/30 rounded-xl border border-zinc-900/50">
                  <div className="text-[8px] text-zinc-600 uppercase font-black tracking-widest mb-1">Followers</div>
                  <div className="text-xs font-black text-white tracking-widest">{trader.followers}</div>
                </div>
                <div className="p-3 bg-zinc-900/30 rounded-xl border border-zinc-900/50">
                  <div className="text-[8px] text-zinc-600 uppercase font-black tracking-widest mb-1">Frequency</div>
                  <div className="text-xs font-black text-white tracking-widest">{trader.strategy.frequency}/day</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GhostManagement;
