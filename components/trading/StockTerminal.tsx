import React, { useState } from "react";
import { TOP_STOCKS, StockAsset } from "../../data/stocks";
import { Search, TrendingUp, TrendingDown, ArrowRightLeft, CheckCircle2, ShieldCheck, X, Building, BarChart2, Layers } from "lucide-react";

interface StockOrder {
  id: string;
  ticker_symbol: string;
  company_name: string;
  company_logo_url: string;
  side: "BUY" | "SELL";
  shares: number;
  price_per_share: number;
  total_cost: number;
  timestamp: number;
}

interface StockTerminalProps {
  onBack: () => void;
  tradingBalance: number;
  onDeductBalance?: (amount: number) => void;
}

const StockTerminal: React.FC<StockTerminalProps> = ({ onBack, tradingBalance, onDeductBalance }) => {
  const [activeTab, setActiveTab] = useState<"market" | "ledger">("market");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedStock, setSelectedStock] = useState<StockAsset | null>(null);
  const [orderSide, setOrderSide] = useState<"BUY" | "SELL">("BUY");
  const [sharesInput, setSharesInput] = useState<string>("10");
  const [executionModule, setExecutionModule] = useState<string>("ai_fill");
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [orderHistory, setOrderHistory] = useState<StockOrder[]>([]);

  const categories = ["All", "Tech", "Semiconductor", "Finance", "Consumer", "Healthcare", "Automotive", "Energy"];

  const filteredStocks = TOP_STOCKS.filter(stock => {
    const matchesSearch = stock.ticker_symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          stock.company_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === "All" || stock.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const parsedShares = parseFloat(sharesInput) || 0;
  const estimatedCost = selectedStock ? parsedShares * selectedStock.current_price : 0;

  const handleOpenTrade = (stock: StockAsset) => {
    setSelectedStock(stock);
    setSharesInput("10");
    setOrderSide("BUY");
    setIsTradeModalOpen(true);
  };

  const handleDispatchOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStock || parsedShares <= 0) return;

    if (orderSide === "BUY" && onDeductBalance && tradingBalance < estimatedCost) {
      setToastMessage("Insufficient trading balance for this order");
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    if (orderSide === "BUY" && onDeductBalance) {
      onDeductBalance(estimatedCost);
    }

    const newOrder: StockOrder = {
      id: `ord-${Date.now()}`,
      ticker_symbol: selectedStock.ticker_symbol,
      company_name: selectedStock.company_name,
      company_logo_url: selectedStock.company_logo_url,
      side: orderSide,
      shares: parsedShares,
      price_per_share: selectedStock.current_price,
      total_cost: estimatedCost,
      timestamp: Date.now()
    };

    setOrderHistory(prev => [newOrder, ...prev]);
    setIsTradeModalOpen(false);
    setToastMessage(`Executed ${orderSide} ${parsedShares} shares of ${selectedStock.ticker_symbol}`);
    setTimeout(() => setToastMessage(null), 3500);
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
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg md:text-xl font-black uppercase tracking-tight">Equities Terminal</h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                Live 500+ Assets
              </span>
            </div>
            <p className="text-xs text-zinc-500 font-medium">Institutional-grade US stocks with 0% commission</p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 bg-zinc-900/80 p-1 rounded-2xl border border-zinc-800 self-start md:self-auto">
          <button
            onClick={() => setActiveTab("market")}
            className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              activeTab === "market"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Market
          </button>
          <button
            onClick={() => setActiveTab("ledger")}
            className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeTab === "ledger"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <span>Ledger</span>
            <span className="w-4 h-4 rounded-full bg-zinc-800 text-[9px] flex items-center justify-center font-mono">
              {orderHistory.length}
            </span>
          </button>
        </div>
      </div>

      <div className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-6">
        {activeTab === "market" ? (
          <>
            {/* Search and Filters */}
            <div className="space-y-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search company name or ticker (e.g. NVDA, Apple, Tesla, Palantir)..."
                  className="w-full bg-zinc-950/80 border border-zinc-800/80 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium text-white placeholder-zinc-500 outline-none focus:border-indigo-500 transition-all"
                />
              </div>

              {/* Categories Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? "bg-white text-zinc-950 font-black shadow-lg"
                        : "bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Stocks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {filteredStocks.map(stock => {
                const isPositive = stock.price_change_24h >= 0;
                return (
                  <div
                    key={stock.id}
                    onClick={() => handleOpenTrade(stock)}
                    className="p-5 rounded-3xl bg-zinc-950/60 border border-zinc-800/80 hover:border-indigo-500/50 hover:bg-zinc-900/30 transition-all duration-300 cursor-pointer group flex flex-col justify-between shadow-xl relative overflow-hidden"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-white p-2 flex items-center justify-center border border-white/10 shrink-0 shadow-md group-hover:scale-105 transition-transform">
                            <img
                              src={stock.company_logo_url}
                              alt={stock.company_name}
                              className="max-w-full max-h-full object-contain"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-base font-black uppercase tracking-tight text-white group-hover:text-indigo-400 transition-colors">
                                {stock.ticker_symbol}
                              </h3>
                              <span className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase bg-zinc-800 text-zinc-400">
                                {stock.exchange}
                              </span>
                            </div>
                            <p className="text-xs text-zinc-400 font-medium truncate max-w-[160px]">
                              {stock.company_name}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-base font-black font-mono text-white">
                            ${stock.current_price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </p>
                          <div className={`inline-flex items-center gap-0.5 text-xs font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            <span>{isPositive ? '+' : ''}{stock.price_change_24h.toFixed(2)}%</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-[11px] text-zinc-500 line-clamp-2 leading-relaxed mb-4">
                        {stock.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-zinc-900 flex items-center justify-between text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                      <span>Cap: {stock.market_cap}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenTrade(stock);
                        }}
                        className="px-4 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-black hover:bg-indigo-500 hover:text-white transition-all"
                      >
                        Trade Share
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          /* Ledger Tab */
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2">
              <h3 className="text-sm font-black uppercase tracking-wider text-zinc-400">Equities Execution Ledger</h3>
              <span className="text-xs text-zinc-500 font-mono">Total Records: {orderHistory.length}</span>
            </div>

            <div className="rounded-3xl bg-zinc-950/80 border border-zinc-800/80 overflow-hidden shadow-2xl">
              {orderHistory.length === 0 ? (
                <div className="p-12 text-center flex flex-col items-center justify-center">
                  <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4 text-zinc-500">
                    <Layers className="w-7 h-7 text-zinc-400" />
                  </div>
                  <h4 className="text-sm font-black uppercase tracking-widest text-white mb-1">No Stock Orders Yet</h4>
                  <p className="text-xs text-zinc-500 max-w-sm mb-6">Your institutional stock executions and fills will be displayed here in real time.</p>
                  <button
                    onClick={() => setActiveTab("market")}
                    className="px-6 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-bold uppercase tracking-wider text-cyan-400 hover:text-white hover:bg-zinc-800 transition-all"
                  >
                    Browse Equities Market
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-900/60 text-[10px] font-black uppercase tracking-widest text-zinc-500 border-b border-zinc-800">
                      <tr>
                        <th className="p-4 md:p-5">Asset</th>
                        <th className="p-4 md:p-5">Side</th>
                        <th className="p-4 md:p-5">Shares</th>
                        <th className="p-4 md:p-5">Execution Price</th>
                        <th className="p-4 md:p-5">Total Cost</th>
                        <th className="p-4 md:p-5 text-right">Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900">
                      {orderHistory.map(order => (
                        <tr key={order.id} className="hover:bg-zinc-900/30 transition-colors">
                          <td className="p-4 md:p-5 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-white p-1 flex items-center justify-center shrink-0 border border-white/10">
                              <img src={order.company_logo_url} alt={order.ticker_symbol} className="max-h-full object-contain" />
                            </div>
                            <div>
                              <span className="font-black text-white uppercase">{order.ticker_symbol}</span>
                              <p className="text-[10px] text-zinc-500 truncate max-w-[120px]">{order.company_name}</p>
                            </div>
                          </td>
                          <td className="p-4 md:p-5 font-black">
                            <span className={`px-2 py-0.5 rounded text-[10px] ${order.side === 'BUY' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                              {order.side}
                            </span>
                          </td>
                          <td className="p-4 md:p-5 font-mono font-bold text-white">
                            {order.shares}
                          </td>
                          <td className="p-4 md:p-5 font-mono text-zinc-300">
                            ${order.price_per_share.toFixed(2)}
                          </td>
                          <td className="p-4 md:p-5 font-mono font-black text-white">
                            ${order.total_cost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="p-4 md:p-5 text-right font-mono text-zinc-500 text-[10px]">
                            {new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Trade Modal */}
      {isTradeModalOpen && selectedStock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden text-white">
            {/* Close */}
            <button
              onClick={() => setIsTradeModalOpen(false)}
              className="w-8 h-8 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center absolute top-6 right-6 transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Asset header */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-zinc-900 pr-10">
              <div className="w-14 h-14 rounded-2xl bg-white p-2.5 flex items-center justify-center shrink-0 border border-white/10 shadow-lg">
                <img src={selectedStock.company_logo_url} alt={selectedStock.company_name} className="max-w-full max-h-full object-contain" />
              </div>
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight text-white">{selectedStock.company_name}</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs font-black text-indigo-400 font-mono">{selectedStock.ticker_symbol}</span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-sm font-black font-mono text-white">${selectedStock.current_price.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleDispatchOrder} className="space-y-6">
              {/* Order Side Toggle */}
              <div>
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-2">Order Direction</label>
                <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-zinc-900/90 border border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setOrderSide("BUY")}
                    className={`py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                      orderSide === "BUY"
                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                        : "text-zinc-500 hover:text-white"
                    }`}
                  >
                    BUY (LONG)
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderSide("SELL")}
                    className={`py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                      orderSide === "SELL"
                        ? "bg-rose-500 text-white shadow-lg shadow-rose-500/25"
                        : "text-zinc-500 hover:text-white"
                    }`}
                  >
                    SELL (SHORT)
                  </button>
                </div>
              </div>

              {/* Execution Engine */}
              <div>
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-2">Execution Logic Engine</label>
                <select
                  value={executionModule}
                  onChange={(e) => setExecutionModule(e.target.value)}
                  className="w-full bg-zinc-900/90 border border-zinc-800 rounded-2xl py-3.5 px-4 text-xs font-bold text-white outline-none focus:border-indigo-500 transition-all"
                >
                  <option value="ai_fill">AI Optimal Smart Route (Zero Slippage)</option>
                  <option value="market_instant">Instant Institutional Market Fill</option>
                  <option value="dark_pool_sweep">Dark Pool Algorithmic VWAP</option>
                </select>
              </div>

              {/* Shares Stepper / Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                  <span>Quantity (Shares)</span>
                  <span className="text-zinc-500">Trading Balance: ${tradingBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    min="1"
                    value={sharesInput}
                    onChange={(e) => setSharesInput(e.target.value)}
                    className="w-full bg-zinc-900/90 border border-zinc-800 rounded-2xl py-3.5 px-4 text-xl font-mono font-bold text-white outline-none focus:border-indigo-500 transition-all"
                    required
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-zinc-500 uppercase">SHARES</span>
                </div>

                {/* Quick Share Chips */}
                <div className="flex gap-2 pt-1">
                  {[5, 10, 25, 50, 100].map(cnt => (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => setSharesInput(cnt.toString())}
                      className="flex-1 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-[10px] font-bold text-zinc-400 hover:text-white hover:border-zinc-700 transition-all"
                    >
                      {cnt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cost summary card */}
              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Estimated Total Cost</p>
                  <p className="text-xs text-zinc-500">$0 Commission • 0% Broker Fee</p>
                </div>
                <p className="text-xl font-black font-mono text-white">
                  ${estimatedCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all ${
                  orderSide === 'BUY'
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20'
                    : 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20'
                }`}
              >
                DISPATCH {orderSide} ORDER
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockTerminal;
