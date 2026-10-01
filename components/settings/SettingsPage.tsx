import React, { useState } from 'react';
import { ChevronLeft, KeyRound, Smartphone } from 'lucide-react';

interface SettingsPageProps {
  onBack: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onBack }) => {
  const [is2faEnabled, setIs2faEnabled] = useState(false);
  const [currency, setCurrency] = useState('USD');
  const [notifications, setNotifications] = useState({
    trades: true,
    price: false,
    social: true
  });

  return (
    <div className="flex-1 flex flex-col bg-zinc-950 overflow-hidden">
      {/* Header */}
      <div className="h-14 md:h-16 border-b border-zinc-900 flex items-center px-4 md:px-6 gap-4 shrink-0">
        <button onClick={onBack} aria-label="Back to trading" className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-900 text-zinc-500 hover:text-white transition-all outline-none focus-visible:ring-2 focus-visible:ring-cyan-500">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-sm font-black text-white uppercase tracking-widest italic leading-none">Platform Settings</h2>
          <span className="text-[10px] text-zinc-500 font-medium">Security, preferences & external exchange bridges</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-2xl mx-auto space-y-8">
          
          {/* Preferences Section */}
          <section>
            <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-4">Platform Preferences</h3>
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl divide-y divide-zinc-800">
              <div className="p-6 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-white uppercase tracking-widest mb-1">Primary Currency</h4>
                  <p className="text-[10px] text-zinc-500">Base currency for calculations and displays.</p>
                </div>
                <select 
                  value={currency} 
                  onChange={e => setCurrency(e.target.value)}
                  className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-[10px] font-black text-white uppercase tracking-widest focus:outline-none"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
              <div className="p-6 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-white uppercase tracking-widest mb-1">Theme Mode</h4>
                  <p className="text-[10px] text-zinc-500">Customize the visual interface.</p>
                </div>
                <div className="flex bg-zinc-800 p-1 rounded-lg">
                  <button className="px-3 py-1 bg-zinc-700 text-white text-[9px] font-black uppercase tracking-widest rounded-md">Dark</button>
                  <button className="px-3 py-1 text-zinc-500 text-[9px] font-black uppercase tracking-widest rounded-md">OLED</button>
                </div>
              </div>
            </div>
          </section>

          {/* Notifications Section */}
          <section>
            <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-4">Notifications</h3>
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl divide-y divide-zinc-800">
              {[
                { key: 'trades' as const, label: 'Trade Executions', desc: 'Alerts for buy/sell fills and position closures.' },
                { key: 'price' as const, label: 'Price Alerts', desc: 'Custom volatility and milestone triggers.' },
                { key: 'social' as const, label: 'Social Updates', desc: 'Copy-trading activity and master trader signals.' },
              ].map(item => (
                <div key={item.key} className="p-6 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-widest mb-1">{item.label}</h4>
                    <p className="text-[10px] text-zinc-500">{item.desc}</p>
                  </div>
                  <button 
                    onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                    className={`w-10 h-5 rounded-full transition-all relative ${notifications[item.key] ? 'bg-indigo-500' : 'bg-zinc-700'}`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${notifications[item.key] ? 'left-5.5' : 'left-0.5'}`} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Security Section (existing) */}
          <section>
            <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-4">Security</h3>
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl divide-y divide-zinc-800">
              <div className="p-6 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-white uppercase tracking-widest mb-1">Two-Factor Authentication</h4>
                  <p className="text-[10px] text-zinc-500">Add an extra layer of security to your account.</p>
                </div>
                <button 
                  onClick={() => setIs2faEnabled(!is2faEnabled)}
                  className={`w-10 h-5 rounded-full transition-all relative ${is2faEnabled ? 'bg-emerald-500' : 'bg-zinc-700'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${is2faEnabled ? 'left-5.5' : 'left-0.5'}`} />
                </button>
              </div>
              <div className="p-6 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-white uppercase tracking-widest mb-1">Password Control</h4>
                  <p className="text-[10px] text-zinc-500">Keep your access secure with a strong password.</p>
                </div>
                <button className="px-4 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-[9px] font-black text-white uppercase tracking-widest hover:bg-zinc-700 transition-all">Change</button>
              </div>
            </div>
          </section>

          {/* API & Integration (Existing) */}
          <section>
            <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-4">Integrations</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 opacity-60 grayscale-[0.5] relative overflow-hidden group">
                <div className="absolute top-3 right-3 px-2 py-0.5 bg-indigo-500/20 text-indigo-400 text-[8px] font-black uppercase tracking-widest rounded">Coming Soon</div>
                <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center mb-3">
                  <KeyRound className="w-5 h-5 text-indigo-400" />
                </div>
                <h4 className="text-xs font-black text-white uppercase tracking-widest mb-1">Binance API</h4>
                <p className="text-[10px] text-zinc-600 leading-relaxed">Connect your Binance account for automated trading.</p>
              </div>
              <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 opacity-60 grayscale-[0.5] relative overflow-hidden group">
                <div className="absolute top-3 right-3 px-2 py-0.5 bg-indigo-500/20 text-indigo-400 text-[8px] font-black uppercase tracking-widest rounded">Coming Soon</div>
                <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center mb-3">
                  <Smartphone className="w-5 h-5 text-indigo-400" />
                </div>
                <h4 className="text-xs font-black text-white uppercase tracking-widest mb-1">Telegram Link</h4>
                <p className="text-[10px] text-zinc-600 leading-relaxed">Get instant alerts via our Telegram bot.</p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
