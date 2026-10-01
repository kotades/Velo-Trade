import React, { useState, useEffect } from 'react';
import { MasterTrader, useGhostTraders } from '../../hooks/useGhostTraders';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';

// Mock data is no longer needed as we fetch from Firestore

interface CopyTradingHubProps {
  onBack: () => void;
}

const CopyTradingHub: React.FC<CopyTradingHubProps> = ({ onBack }) => {
  const { traders, userCopies, toggleCopy, loading } = useGhostTraders();
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState<'all' | 'Low' | 'Medium' | 'High'>('all');
  const [riskMultiplier, setRiskMultiplier] = useState(10);
  const [showCopies, setShowCopies] = useState(false);
  const [selectedTrader, setSelectedTrader] = useState<MasterTrader | null>(null);
  const [recentTrades, setRecentTrades] = useState<any[]>([]);
  const [loadingTrades, setLoadingTrades] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState<string | null>(null); // traderId

  useEffect(() => {
    if (!selectedTrader) {
      setRecentTrades([]);
      return;
    }

    setLoadingTrades(true);
    const q = query(
      collection(db, 'masterTraders', selectedTrader.id, 'trades'),
      orderBy('timestamp', 'desc'),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const trades = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecentTrades(trades);
      setLoadingTrades(false);
    });

    return () => unsubscribe();
  }, [selectedTrader]);

  const filtered = traders.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase());
    const matchRisk = riskFilter === 'all' || t.riskLevel === riskFilter;
    return matchSearch && matchRisk;
  });

  const activeCopies = traders.filter(t => userCopies.some(c => c.traderId === t.id));

  return (
    <div className="flex-1 flex flex-col bg-zinc-950 overflow-hidden">
      {/* Header */}
      <div className="h-14 md:h-16 border-b border-zinc-900 flex items-center justify-between px-4 md:px-6 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={selectedTrader ? () => setSelectedTrader(null) : onBack} 
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-900 text-zinc-500 hover:text-white transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h2 className="text-sm font-black text-white uppercase tracking-widest italic">
            {selectedTrader ? selectedTrader.name : 'Copy Trading'}
          </h2>
        </div>
        {!selectedTrader && (
          <button
            onClick={() => setShowCopies(!showCopies)}
            className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all ${showCopies ? 'bg-cyan-500/10 text-cyan-400' : 'bg-zinc-900 text-zinc-500 hover:text-white'}`}
          >
            Following ({activeCopies.length})
          </button>
        )}
      </div>

      {selectedTrader ? (
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-2xl mx-auto">
            {/* Detailed Profile */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-6 mb-6">
                <div className="w-20 h-20 rounded-full bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center text-4xl">
                  {selectedTrader.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-xl font-black text-white">{selectedTrader.name}</h3>
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                      selectedTrader.riskLevel === 'Low' ? 'bg-emerald-500/10 text-emerald-400' :
                      selectedTrader.riskLevel === 'Medium' ? 'bg-amber-500/10 text-amber-400' :
                      'bg-rose-500/10 text-rose-400'
                    }`}>
                      {selectedTrader.riskLevel} Risk
                    </span>
                  </div>
                  <p className="text-sm text-zinc-400 leading-relaxed">{selectedTrader.bio}</p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-zinc-950/50 p-3 rounded-xl border border-zinc-800/50">
                  <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest block mb-1">Total ROI</span>
                  <span className="text-lg font-black text-emerald-400">+{selectedTrader.roi.toFixed(1)}%</span>
                </div>
                <div className="bg-zinc-950/50 p-3 rounded-xl border border-zinc-800/50">
                  <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest block mb-1">Win Rate</span>
                  <span className="text-lg font-black text-white">{selectedTrader.winRate}%</span>
                </div>
                <div className="bg-zinc-950/50 p-3 rounded-xl border border-zinc-800/50">
                  <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest block mb-1">Followers</span>
                  <span className="text-lg font-black text-white">{selectedTrader.followers.toLocaleString()}</span>
                </div>
                <div className="bg-zinc-950/50 p-3 rounded-xl border border-zinc-800/50">
                  <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest block mb-1">Trades</span>
                  <span className="text-lg font-black text-white">{selectedTrader.totalTrades.toLocaleString()}</span>
                </div>
              </div>

              <button 
                onClick={() => {
                  if (userCopies.some(c => c.traderId === selectedTrader.id)) {
                    toggleCopy(selectedTrader.id);
                  } else {
                    setShowAuthModal(selectedTrader.id);
                  }
                }}
                className={`w-full py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                userCopies.some(c => c.traderId === selectedTrader.id)
                  ? 'bg-zinc-800 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10'
                  : 'velo-gradient text-white hover:shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:scale-[1.01] active:scale-95'
              }`}>
                {userCopies.some(c => c.traderId === selectedTrader.id) ? 'Stop Copying' : 'Copy This Trader'}
              </button>
            </div>

            {/* Recent Trades Table */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden">
              <div className="h-12 border-b border-zinc-800 flex items-center px-5 flex justify-between">
                <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Recent Activity</h4>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              {loadingTrades ? (
                <div className="p-10 text-center">
                  <div className="w-6 h-6 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mx-auto mb-3" />
                  <span className="text-[10px] text-zinc-600 uppercase font-black">Syncing algorithm...</span>
                </div>
              ) : recentTrades.length === 0 ? (
                <div className="p-10 text-center text-zinc-600">
                  <span className="text-xs italic">Analyzing market conditions...</span>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-zinc-800/50">
                        <th className="px-5 py-3 text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Pair</th>
                        <th className="px-5 py-3 text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Type</th>
                        <th className="px-5 py-3 text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Result</th>
                        <th className="px-5 py-3 text-[9px] font-bold text-zinc-600 uppercase tracking-widest text-right">Profit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/30">
                      {recentTrades.map((t, idx) => (
                        <tr key={idx} className="hover:bg-zinc-800/20 transition-colors">
                          <td className="px-5 py-3 text-[10px] font-bold text-white uppercase">{t.pair}</td>
                          <td className={`px-5 py-3 text-[9px] font-black uppercase tracking-widest ${t.type === 'buy' ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {t.type}
                          </td>
                          <td className="px-5 py-3">
                            <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase ${t.result === 'win' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                              {t.result}
                            </span>
                          </td>
                          <td className={`px-5 py-3 text-[10px] font-black text-right ${t.result === 'win' ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {t.result === 'win' ? '+' : '-'}${t.profit.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Risk Multiplier */}
          <div className="px-4 md:px-6 py-3 border-b border-zinc-900 bg-zinc-900/30 shrink-0">
            <div className="flex items-center justify-between max-w-2xl mx-auto">
              <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Risk Multiplier</span>
              <div className="flex items-center gap-3">
                <input
                  type="range" min="1" max="100" value={riskMultiplier}
                  onChange={e => setRiskMultiplier(Number(e.target.value))}
                  className="w-32 md:w-48 accent-cyan-500"
                />
                <span className="text-xs font-black text-white w-12 text-right">{riskMultiplier}%</span>
              </div>
            </div>
            <p className="text-[9px] text-zinc-600 text-center mt-1 max-w-2xl mx-auto">
              If a master trades $100, you trade ${(100 * riskMultiplier / 100).toFixed(0)}
            </p>
          </div>

          {/* Search & Filter */}
          <div className="px-4 md:px-6 py-3 border-b border-zinc-900 flex items-center gap-3 shrink-0">
            <div className="relative flex-1 max-w-sm">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search traders..."
                className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 transition-all"
              />
            </div>
            <div className="flex gap-1">
              {(['all', 'Low', 'Medium', 'High'] as const).map(r => (
                <button key={r} onClick={() => setRiskFilter(r)}
                  className={`px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                    riskFilter === r ? 'bg-zinc-800 text-cyan-400' : 'text-zinc-600 hover:text-zinc-400'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Trader Grid */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full opacity-50">
                <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Syncing Master Traders</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
                {(showCopies ? activeCopies : filtered).map(trader => {
                  const isFollowing = userCopies.some(c => c.traderId === trader.id);
                  return (
                    <div 
                      key={trader.id} 
                      onClick={() => setSelectedTrader(trader)}
                      className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-all group cursor-pointer"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                          {trader.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-black text-white truncate">{trader.name}</h4>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                            trader.riskLevel === 'Low' ? 'bg-emerald-500/10 text-emerald-400' :
                            trader.riskLevel === 'Medium' ? 'bg-amber-500/10 text-amber-400' :
                            'bg-rose-500/10 text-rose-400'
                          }`}>
                            {trader.riskLevel} Risk
                          </span>
                        </div>
                      </div>
                      <p className="text-[10px] text-zinc-600 mb-4 leading-relaxed line-clamp-2">{trader.bio}</p>
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div>
                          <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest block">ROI</span>
                          <span className="text-sm font-black text-emerald-400">+{trader.roi.toFixed(1)}%</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest block">Win Rate</span>
                          <span className="text-sm font-black text-white">{trader.winRate}%</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest block">Followers</span>
                          <span className="text-sm font-black text-white">{trader.followers.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest block">Trades</span>
                          <span className="text-sm font-black text-white">{trader.totalTrades.toLocaleString()}</span>
                        </div>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isFollowing) {
                            toggleCopy(trader.id);
                          } else {
                            setShowAuthModal(trader.id);
                          }
                        }}
                        className={`w-full py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        isFollowing
                          ? 'bg-zinc-800 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10'
                          : 'velo-gradient text-white hover:scale-[1.02] active:scale-95'
                      }`}>
                        {isFollowing ? 'Unfollow' : 'Copy Trader'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {/* Authorization & Warning Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowAuthModal(null)} />
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8 max-w-md w-full relative animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mb-6 mx-auto">
              <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-black text-white text-center mb-2 uppercase tracking-tight">Risk Disclosure & Authorization</h3>
            <p className="text-xs text-zinc-400 text-center mb-6 leading-relaxed">
              You are about to subscribe to a <span className="text-white font-bold">Ghost Trader Simulation</span>. 
              These are algorithmic profiles used for platform study and demo purposes. 
              While they follow deterministic logic, results are <span className="text-amber-400 font-bold italic underline">not guaranteed</span> 
              and carry the same risks as real trading.
            </p>
            <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800/50 mb-6 font-mono text-[10px] space-y-2">
              <div className="flex justify-between">
                <span className="text-zinc-600">Risk Level:</span>
                <span className="text-amber-500 font-bold">Variable / High</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-600">Execution:</span>
                <span className="text-white font-bold">Automated / Immediate</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-600">Account:</span>
                <span className="text-indigo-400 font-bold">Demo Account Sync</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowAuthModal(null)}
                className="flex-1 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-zinc-800 text-zinc-400 hover:text-white transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  toggleCopy(showAuthModal, riskMultiplier / 100);
                  setShowAuthModal(null);
                }}
                className="flex-1 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest velo-gradient text-white shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
              >
                I Authorize & Follow
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CopyTradingHub;
