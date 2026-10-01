import React, { useState } from 'react';
import { db } from '../../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { X } from 'lucide-react';

interface GodModeEditorProps {
  user: any;
  onClose: () => void;
}

const GodModeEditor: React.FC<GodModeEditorProps> = ({ user, onClose }) => {
  const [formData, setFormData] = useState({
    displayName: user.displayName || '',
    demoBalance: user.demoBalance || 0,
    realBalance: user.realBalance || 0,
    tier: user.tier || 'Bronze',
    roi: user.roi || 0,
    winRate: user.winRate || 0,
    trades: user.trades || 0,
    profit: user.profit || 0
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateDoc(doc(db, 'users', user.id), {
        ...formData,
        demoBalance: Number(formData.demoBalance),
        realBalance: Number(formData.realBalance),
        roi: Number(formData.roi),
        winRate: Number(formData.winRate),
        trades: Number(formData.trades),
        profit: Number(formData.profit)
      });
      onClose();
    } catch (err) {
      alert('God Mode Error: Failed to alter reality. ' + err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-[32px] overflow-hidden shadow-[0_0_100px_rgba(124,58,237,0.15)]">
        <div className="p-8 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-white uppercase tracking-tighter">Edit User: <span className="text-cyan-400">{user.displayName}</span></h3>
            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-1">UID: {user.id}</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white transition-all outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Display Name</label>
            <input 
              type="text"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
              value={formData.displayName}
              onChange={(e) => setFormData({...formData, displayName: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Account Tier</label>
            <select 
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 appearance-none"
              value={formData.tier}
              onChange={(e) => setFormData({...formData, tier: e.target.value})}
            >
              <option value="Bronze">Bronze</option>
              <option value="Silver">Silver</option>
              <option value="Gold">Gold</option>
              <option value="Platinum">Platinum</option>
              <option value="VIP">VIP (Legendary)</option>
            </select>
          </div>

          <div className="h-px bg-zinc-800 md:col-span-2 my-2" />

          <div className="space-y-2">
            <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest ml-1">Demo Balance ($)</label>
            <input 
              type="number"
              className="w-full bg-zinc-900 border border-emerald-900/30 rounded-xl px-5 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
              value={formData.demoBalance}
              onChange={(e) => setFormData({...formData, demoBalance: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-rose-500 uppercase tracking-widest ml-1">Real Balance ($)</label>
            <input 
              type="number"
              className="w-full bg-zinc-900 border border-rose-900/30 rounded-xl px-5 py-3 text-sm text-white focus:outline-none focus:border-rose-500"
              value={formData.realBalance}
              onChange={(e) => setFormData({...formData, realBalance: e.target.value})}
            />
          </div>

          <div className="h-px bg-zinc-800 md:col-span-2 my-2" />

          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">ROI (%)</label>
            <input 
              type="number"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
              value={formData.roi}
              onChange={(e) => setFormData({...formData, roi: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Win Rate (%)</label>
            <input 
              type="number"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
              value={formData.winRate}
              onChange={(e) => setFormData({...formData, winRate: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Total Trades</label>
            <input 
              type="number"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
              value={formData.trades}
              onChange={(e) => setFormData({...formData, trades: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Total Profit ($)</label>
            <input 
              type="number"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
              value={formData.profit}
              onChange={(e) => setFormData({...formData, profit: e.target.value})}
            />
          </div>
        </div>

        <div className="p-8 border-t border-zinc-800 flex gap-4">
          <button 
            onClick={onClose}
            className="flex-1 py-4 rounded-2xl bg-zinc-900 text-zinc-500 font-black uppercase text-xs hover:text-white transition-all border border-zinc-800"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className={`flex-1 py-4 rounded-2xl velo-gradient text-white font-black uppercase text-xs shadow-xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all ${isSaving ? 'opacity-50' : ''}`}
          >
            {isSaving ? 'Altering Reality...' : 'Commit Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GodModeEditor;
