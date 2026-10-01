import React from 'react';
import { View } from '../../App';
import { useAuth } from '../../context/AuthContext';
import { Trophy, TrendingUp, Users, ChevronRight } from 'lucide-react';

interface ProfilePageProps {
  onBack: () => void;
  navigateTo: (view: View) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onBack, navigateTo }) => {
  const { user, userData, isAdmin } = useAuth();
  
  const displayData = {
    name: userData?.displayName || user?.displayName || 'Velo Trader',
    email: user?.email || 'N/A',
    tier: userData?.tier || 'Bronze',
    joinDate: userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'March 2024',
    stats: {
      totalProfit: userData?.profit || 0,
      winRate: userData?.winRate || 0,
      trades: userData?.trades || 0,
      roi: userData?.roi || 0
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-zinc-950 overflow-hidden">
      {/* Header */}
      <div className="h-14 md:h-16 border-b border-zinc-900 flex items-center px-4 md:px-6 gap-4 shrink-0">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-900 text-zinc-500 hover:text-white transition-all">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h2 className="text-sm font-black text-white uppercase tracking-widest italic">User Profile</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-3xl mx-auto space-y-8">
          
          {/* Identity Card */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
            <div className="relative bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
              <div className="w-24 h-24 rounded-2xl velo-gradient flex items-center justify-center text-white text-4xl font-black shadow-2xl">
                {displayData.name.charAt(0)}
              </div>
              <div className="text-center md:text-left flex-1">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                  <h3 className="text-xl md:text-2xl font-black text-white tracking-tighter italic">{displayData.name}</h3>
                  <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-cyan-500/20 self-center md:self-auto">
                    {displayData.tier}
                  </span>
                </div>
                <p className="text-zinc-500 text-xs font-medium">{displayData.email}</p>
                <div className="mt-4 flex items-center justify-center md:justify-start gap-6">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest leading-none mb-1">Joined</span>
                    <span className="text-xs font-bold text-white">{displayData.joinDate}</span>
                  </div>
                  <div className="w-px h-6 bg-zinc-800" />
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest leading-none mb-1">Status</span>
                    <span className="text-xs font-bold text-emerald-400">Verified</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button className="px-6 py-2.5 bg-white text-black font-black text-[10px] uppercase tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/5 whitespace-nowrap">
                  Edit Profile
                </button>
                {isAdmin && (
                  <button 
                    onClick={() => navigateTo('admin')}
                    className="px-6 py-2.5 bg-cyan-500 text-black font-black text-[10px] uppercase tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-cyan-500/20 whitespace-nowrap"
                  >
                    God Mode: Admin Portal
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Performance Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Profit', value: `+$${displayData.stats.totalProfit.toFixed(2)}`, trend: '+12%', color: 'text-emerald-400' },
              { label: 'Avg ROI', value: `${displayData.stats.roi}%`, trend: '+2.1%', color: 'text-cyan-400' },
              { label: 'Win Rate', value: `${displayData.stats.winRate}%`, trend: 'Steady', color: 'text-indigo-400' },
              { label: 'Total Trades', value: displayData.stats.trades, trend: 'Last 30d', color: 'text-white' },
            ].map((stat, i) => (
              <div key={i} className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-all">
                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block mb-1">{stat.label}</span>
                <span className={`text-xl font-black italic block mb-2 ${stat.color}`}>{stat.value}</span>
                <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">{stat.trend}</span>
              </div>
            ))}
          </div>

          {/* Recent Activity Placeholder */}
          <section>
            <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-4">Recent Milestones</h3>
            <div className="space-y-3">
              {[
                { title: 'Reached VIP Tier 1', date: '2 days ago', icon: Trophy, color: 'bg-amber-500/10 text-amber-500' },
                { title: 'Portfolio ROI hit +10%', date: '1 week ago', icon: TrendingUp, color: 'bg-emerald-500/10 text-emerald-500' },
                { title: 'Followed first Master Trader', date: '2 weeks ago', icon: Users, color: 'bg-indigo-500/10 text-indigo-500' },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-center gap-4 p-4 bg-zinc-900/40 border border-zinc-800 rounded-2xl hover:bg-zinc-900/60 transition-all cursor-default group">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color} border border-white/5`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xs font-black text-white uppercase tracking-widest">{item.title}</h4>
                      <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mt-0.5">{item.date}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-800 group-hover:text-zinc-600 transition-colors" />
                  </div>
                );
              })}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
