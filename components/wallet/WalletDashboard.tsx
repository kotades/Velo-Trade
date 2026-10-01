import React, { useState } from 'react';
import { 
  BarChart3, 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  ArrowLeftRight, 
  History, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronLeft, 
  Copy, 
  Check, 
  ShieldCheck 
} from 'lucide-react';

type WalletTab = 'overview' | 'deposit' | 'withdraw' | 'transfer' | 'history';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'transfer';
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  address?: string;
}

interface WalletDashboardProps {
  onBack: () => void;
  initialTab?: WalletTab;
  userData?: any;
}

const WalletDashboard: React.FC<WalletDashboardProps> = ({ onBack, initialTab = 'overview', userData }) => {
  const [activeTab, setActiveTab] = useState<WalletTab>(initialTab);
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferDirection, setTransferDirection] = useState<'main-to-trade' | 'trade-to-main'>('main-to-trade');

  // Balances start at 0.00 (or user's real balance from database)
  const [mainBalance, setMainBalance] = useState<number>(userData?.realBalance ?? 0.00);
  const [tradingBalance, setTradingBalance] = useState<number>(0.00);
  const totalBalance = mainBalance + tradingBalance;

  // Custom user feedback states
  const [walletError, setWalletError] = useState<string>('');
  const [walletSuccess, setWalletSuccess] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Transactions list (stripped of demo data)
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const tabs: { id: WalletTab; label: string; icon: React.ComponentType<{ className?: string }>; description: string }[] = [
    { id: 'overview', label: 'Overview', icon: BarChart3, description: 'Asset Distribution & Liquidity' },
    { id: 'deposit', label: 'Deposit', icon: ArrowDownToLine, description: 'TRC-20 Fast Gateway • Zero Fee' },
    { id: 'withdraw', label: 'Withdraw', icon: ArrowUpFromLine, description: 'Secure External Payout' },
    { id: 'transfer', label: 'Transfer', icon: ArrowLeftRight, description: 'Instant Internal Liquidity Reallocation' },
    { id: 'history', label: 'History', icon: History, description: 'Audited Capital Ledger' },
  ];

  const handleTabChange = (tab: WalletTab) => {
    setActiveTab(tab);
    setWalletError('');
    setWalletSuccess('');
  };

  const handleCopyAddress = () => {
    const address = 'TXd9f3a2b1c4e5f6a7b8c9d0e1f2a3b4c5';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(address);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    setWalletError('');
    setWalletSuccess('');

    if (!withdrawAddress.trim()) {
      setWalletError('Please enter a destination wallet address.');
      return;
    }

    const amount = parseFloat(withdrawAmount);
    if (!withdrawAmount.trim() || isNaN(amount) || amount <= 0) {
      setWalletError('Please enter a valid withdrawal amount greater than $0.00.');
      return;
    }

    if (amount < 10) {
      setWalletError('Minimum withdrawal amount is $10.00 USDT.');
      return;
    }

    if (amount > mainBalance) {
      setWalletError(`Insufficient funds. Your available Main Wallet balance is $${mainBalance.toFixed(2)}.`);
      return;
    }

    // Deduct and create pending transaction
    setMainBalance(prev => prev - amount);
    const newTx: Transaction = {
      id: `TX-${Date.now().toString(36).toUpperCase()}`,
      type: 'withdrawal',
      amount,
      currency: 'USDT',
      status: 'pending',
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      address: `${withdrawAddress.slice(0, 6)}...${withdrawAddress.slice(-4)}`
    };
    setTransactions(prev => [newTx, ...prev]);
    setWithdrawAmount('');
    setWithdrawAddress('');
    setWalletSuccess(`Withdrawal request of $${amount.toFixed(2)} USDT submitted for processing.`);
  };

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    setWalletError('');
    setWalletSuccess('');

    const amount = parseFloat(transferAmount);
    if (!transferAmount.trim() || isNaN(amount) || amount <= 0) {
      setWalletError('Please enter a transfer amount greater than $0.00.');
      return;
    }

    if (transferDirection === 'main-to-trade') {
      if (amount > mainBalance) {
        setWalletError(`Insufficient Main Wallet balance ($${mainBalance.toFixed(2)}).`);
        return;
      }
      setMainBalance(prev => prev - amount);
      setTradingBalance(prev => prev + amount);
    } else {
      if (amount > tradingBalance) {
        setWalletError(`Insufficient Trading Wallet balance ($${tradingBalance.toFixed(2)}).`);
        return;
      }
      setTradingBalance(prev => prev - amount);
      setMainBalance(prev => prev + amount);
    }

    const newTx: Transaction = {
      id: `TX-${Date.now().toString(36).toUpperCase()}`,
      type: 'transfer',
      amount,
      currency: 'USDT',
      status: 'completed',
      date: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };
    setTransactions(prev => [newTx, ...prev]);
    setTransferAmount('');
    setWalletSuccess(`Successfully transferred $${amount.toFixed(2)} USDT to ${transferDirection === 'main-to-trade' ? 'Trading Wallet' : 'Main Wallet'}.`);
  };

  return (
    <div className="flex-1 flex flex-col bg-zinc-950 overflow-hidden">
      {/* Header */}
      <div className="h-14 md:h-16 border-b border-zinc-900 flex items-center px-4 md:px-6 gap-4 shrink-0">
        <button 
          onClick={onBack} 
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-900 text-zinc-500 hover:text-white transition-all outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
          title="Back to trading"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-sm font-black text-white uppercase tracking-widest italic leading-none">Wallet & Balances</h2>
          <span className="text-[10px] text-zinc-500 font-medium">Real-time Multi-Currency Settlement & Ledger</span>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="flex border-b border-zinc-900 px-2 md:px-4 gap-1 overflow-x-auto shrink-0" role="tablist">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-2 px-3 md:px-4 py-3 text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all border-b-2 whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
                activeTab === tab.id ? 'text-cyan-400 border-cyan-400' : 'text-zinc-600 border-transparent hover:text-zinc-400'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-900">
              <div>
                <h3 className="text-xs font-black text-white uppercase tracking-widest">Portfolio Overview</h3>
                <p className="text-[10px] text-zinc-500">Aggregated balances across all active sub-wallets</p>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-[9px] font-black uppercase">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Audited Ledger</span>
              </div>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Total Balance</span>
              <p className="text-3xl md:text-4xl font-black text-white mt-2">${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Main Wallet</span>
                  <span className="text-[9px] text-zinc-600 font-bold uppercase">Funding</span>
                </div>
                <p className="text-xl font-black text-white mt-1">${mainBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <div className="h-1.5 bg-zinc-800 rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: totalBalance > 0 ? `${(mainBalance / totalBalance) * 100}%` : '0%' }} />
                </div>
              </div>
              <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Trading Wallet</span>
                  <span className="text-[9px] text-cyan-500 font-bold uppercase">Margin Active</span>
                </div>
                <p className="text-xl font-black text-white mt-1">${tradingBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <div className="h-1.5 bg-zinc-800 rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-cyan-500 rounded-full transition-all" style={{ width: totalBalance > 0 ? `${(tradingBalance / totalBalance) * 100}%` : '0%' }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Deposit */}
        {activeTab === 'deposit' && (
          <div className="max-w-md mx-auto space-y-6">
            <div className="pb-2 border-b border-zinc-900 text-center">
              <h3 className="text-xs font-black text-white uppercase tracking-widest">Fund Account</h3>
              <p className="text-[10px] text-zinc-500">Instant on-chain settlement via TRC-20 protocol</p>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 text-center">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Deposit Address (USDT - TRC20)</span>
              <div className="w-48 h-48 bg-white rounded-2xl mx-auto mt-4 flex items-center justify-center p-3 shadow-lg">
                <div className="grid grid-cols-8 gap-0.5 w-36 h-36">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div key={i} className={`w-full aspect-square ${(i * 7 + 13) % 3 === 0 ? 'bg-black' : 'bg-white'}`} />
                  ))}
                </div>
              </div>
              <div className="mt-4 bg-zinc-800/60 rounded-xl px-4 py-3 flex items-center justify-between gap-2 border border-zinc-700/40">
                <code className="text-xs text-zinc-300 font-mono truncate">TXd9f3a2b1c4e5...7k8m9n0p</code>
                <button 
                  onClick={handleCopyAddress}
                  className="flex items-center gap-1 text-[9px] font-black uppercase text-cyan-400 hover:text-cyan-300 shrink-0 px-2 py-1 rounded bg-cyan-500/10 transition-all"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-[10px] text-zinc-500 mt-3">Only send USDT (TRC-20) to this address. Min deposit: $10.</p>
            </div>
          </div>
        )}

        {/* Withdraw */}
        {activeTab === 'withdraw' && (
          <div className="max-w-md mx-auto space-y-4">
            <div className="pb-2 border-b border-zinc-900 text-center">
              <h3 className="text-xs font-black text-white uppercase tracking-widest">Withdraw Funds</h3>
              <p className="text-[10px] text-zinc-500">Automated clearance to verified external wallet with zero platform fee</p>
            </div>

            <form onSubmit={handleWithdraw} className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-4">
              {walletError && (
                <div role="alert" className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400 font-medium flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{walletError}</span>
                </div>
              )}
              {walletSuccess && (
                <div role="status" className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-400 font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{walletSuccess}</span>
                </div>
              )}
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Wallet Address</label>
                <input
                  type="text" 
                  value={withdrawAddress} 
                  onChange={e => { setWithdrawAddress(e.target.value); setWalletError(''); }}
                  placeholder="Enter external wallet address"
                  className="w-full bg-zinc-800/60 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500/50 transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Amount</label>
                <div className="relative">
                  <input
                    type="text" 
                    value={withdrawAmount} 
                    onChange={e => { setWithdrawAmount(e.target.value); setWalletError(''); }}
                    placeholder="0.00"
                    className="w-full bg-zinc-800/60 border border-zinc-700 rounded-xl px-4 py-3 pr-20 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500/50 transition-all"
                  />
                  <button 
                    type="button"
                    onClick={() => setWithdrawAmount(mainBalance.toFixed(2))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-black uppercase text-cyan-400 hover:text-cyan-300"
                  >
                    MAX
                  </button>
                </div>
                <span className="text-[10px] text-zinc-500 mt-1 block">Available: ${mainBalance.toFixed(2)}</span>
              </div>
              <button 
                type="submit"
                className="w-full py-3.5 velo-gradient rounded-xl text-xs font-black text-white uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
              >
                Withdraw
              </button>
            </form>
          </div>
        )}

        {/* Transfer */}
        {activeTab === 'transfer' && (
          <div className="max-w-md mx-auto space-y-4">
            <div className="pb-2 border-b border-zinc-900 text-center">
              <h3 className="text-xs font-black text-white uppercase tracking-widest">Internal Transfer</h3>
              <p className="text-[10px] text-zinc-500">Zero-fee instant liquidity move between funding and trading wallets</p>
            </div>

            <form onSubmit={handleTransfer} className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-5">
              {walletError && (
                <div role="alert" className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400 font-medium flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{walletError}</span>
                </div>
              )}
              {walletSuccess && (
                <div role="status" className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-400 font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{walletSuccess}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <div className="flex-1 text-center">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">
                    {transferDirection === 'main-to-trade' ? 'Main Wallet' : 'Trading Wallet'}
                  </span>
                  <span className="text-lg font-black text-white">
                    ${transferDirection === 'main-to-trade' ? mainBalance.toFixed(2) : tradingBalance.toFixed(2)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setTransferDirection(d => d === 'main-to-trade' ? 'trade-to-main' : 'main-to-trade');
                    setWalletError('');
                  }}
                  className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-cyan-400 hover:bg-zinc-700 transition-all outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                  title="Switch transfer direction"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                </button>
                <div className="flex-1 text-center">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">
                    {transferDirection === 'main-to-trade' ? 'Trading Wallet' : 'Main Wallet'}
                  </span>
                  <span className="text-lg font-black text-white">
                    ${transferDirection === 'main-to-trade' ? tradingBalance.toFixed(2) : mainBalance.toFixed(2)}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Amount</label>
                <input
                  type="text" 
                  value={transferAmount} 
                  onChange={e => { setTransferAmount(e.target.value); setWalletError(''); }}
                  placeholder="0.00"
                  className="w-full bg-zinc-800/60 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500/50 transition-all"
                />
              </div>
              <button 
                type="submit"
                className="w-full py-3.5 velo-gradient rounded-xl text-xs font-black text-white uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
              >
                Transfer
              </button>
            </form>
          </div>
        )}

        {/* History */}
        {activeTab === 'history' && (
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="pb-2 border-b border-zinc-900">
              <h3 className="text-xs font-black text-white uppercase tracking-widest">Transaction History</h3>
              <p className="text-[10px] text-zinc-500">Immutable ledger recording all account balance modifications</p>
            </div>

            {transactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-zinc-800/60 rounded-2xl bg-zinc-900/30">
                <div className="w-14 h-14 rounded-2xl bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center mb-4 text-cyan-400">
                  <History className="w-7 h-7" />
                </div>
                <h3 className="text-sm font-black text-white uppercase tracking-widest italic mb-1">
                  No Transactions Yet
                </h3>
                <p className="text-xs text-zinc-500 max-w-sm">
                  Your deposits, withdrawals, and transfers will appear here in real time.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[500px]">
                  <thead>
                    <tr className="border-b border-zinc-800">
                      {['Type', 'Amount', 'Status', 'Date', 'Address'].map(h => (
                        <th key={h} className="px-3 py-2.5 text-left text-[9px] font-black text-zinc-500 uppercase tracking-widest">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map(tx => (
                      <tr key={tx.id} className="border-b border-zinc-900/30 hover:bg-zinc-900/30 transition-all">
                        <td className="px-3 py-3">
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded capitalize ${
                            tx.type === 'deposit' ? 'bg-emerald-500/10 text-emerald-400' :
                            tx.type === 'withdrawal' ? 'bg-rose-500/10 text-rose-400' :
                            'bg-cyan-500/10 text-cyan-400'
                          }`}>
                            {tx.type}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-xs font-black text-white">${tx.amount.toFixed(2)} {tx.currency}</td>
                        <td className="px-3 py-3">
                          <span className={`text-[10px] font-bold capitalize ${
                            tx.status === 'completed' ? 'text-emerald-400' :
                            tx.status === 'pending' ? 'text-amber-400' :
                            'text-rose-400'
                          }`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-[10px] text-zinc-500">{tx.date}</td>
                        <td className="px-3 py-3 text-[10px] text-zinc-500 font-mono">{tx.address || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletDashboard;
