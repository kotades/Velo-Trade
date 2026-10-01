import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import GodModeEditor from './GodModeEditor';
import { Search } from 'lucide-react';

interface FirestoreUser {
  id: string;
  email: string;
  displayName: string;
  demoBalance: number;
  realBalance: number;
  tier: string;
  createdAt: string;
  [key: string]: any;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<FirestoreUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<FirestoreUser | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'users'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FirestoreUser[];
      setUsers(usersList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user? This cannot be undone.')) {
      try {
        await deleteDoc(doc(db, 'users', userId));
      } catch (err) {
        alert('Failed to delete user: ' + err);
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">User Management</h2>
          <p className="text-zinc-500 text-sm">Managing {users.length} registered accounts in God Mode.</p>
        </div>
        
        <div className="relative">
          <input 
            type="text"
            placeholder="Search by email, name or UID..."
            className="w-80 bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-3 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-cyan-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none">
            <Search className="w-4 h-4" />
          </div>
        </div>
      </div>

      <div className="flex-1 bg-zinc-900/40 border border-zinc-800 rounded-3xl overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/50">
                <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">User / UID</th>
                <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Demo Balance</th>
                <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Real Balance</th>
                <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Tier</th>
                <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Joined</th>
                <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-zinc-600 font-bold uppercase tracking-widest animate-pulse">
                    Accessing Data Stream...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-zinc-600 font-bold uppercase tracking-widest">
                    No users found matching your query.
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-zinc-800/30 transition-all group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white leading-none">{user.displayName}</span>
                        <span className="text-[10px] text-zinc-500 font-medium mt-1">{user.email}</span>
                        <code className="text-[9px] text-cyan-500/50 font-mono mt-1 group-hover:text-cyan-500 transition-all">{user.id}</code>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-black text-emerald-400 text-sm">
                      ${user.demoBalance?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 font-black text-rose-400 text-sm">
                      ${user.realBalance?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                        user.tier === 'Bronze' ? 'bg-amber-900/20 text-amber-500 border border-amber-900/30' :
                        user.tier === 'Silver' ? 'bg-zinc-400/10 text-zinc-400 border border-zinc-400/20' :
                        'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                      }`}>
                        {user.tier || 'New'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[10px] text-zinc-500 font-medium">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button 
                          onClick={() => setSelectedUser(user)}
                          className="p-2 bg-indigo-600/10 text-indigo-400 rounded-lg hover:bg-indigo-600 hover:text-white transition-all text-xs font-black uppercase"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 bg-rose-600/10 text-rose-400 rounded-lg hover:bg-rose-600 hover:text-white transition-all text-xs font-black uppercase"
                        >
                          Del
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedUser && (
        <GodModeEditor 
          user={selectedUser} 
          onClose={() => setSelectedUser(null)} 
        />
      )}
    </div>
  );
};

export default UserManagement;
