import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  User,
  signOut as firebaseSignOut,
  signInAnonymously,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { 
  doc, 
  onSnapshot, 
  setDoc,
  updateDoc 
} from 'firebase/firestore';

import { Result, Ok, Err } from '../lib/result';

interface AuthContextType {
  user: User | null;
  userData: any | null;
  isAdmin: boolean;
  loading: boolean;
  signOut: () => Promise<Result<void, Error>>;
  applyOptimisticBalance: (amount: number, type: 'demo' | 'real') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [optimisticOffset, setOptimisticOffset] = useState({ demo: 0, real: 0 });

  useEffect(() => {
    // E2E Test Mock Authentication Bypass
    if (typeof window !== 'undefined' && window.localStorage.getItem('PLAYWRIGHT_TEST') === 'true') {
      if (auth.currentUser) {
        setUser(auth.currentUser);
        setUserData({
          email: 'e2e@velo-trade.com',
          displayName: 'E2E Trader',
          demoBalance: 10000,
          realBalance: 0,
          tier: 'Bronze',
          isAdmin: false
        });
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      signInAnonymously(auth).then(({ user: firebaseUser }) => {
        setUser(firebaseUser);
        setUserData({
          email: 'e2e@velo-trade.com',
          displayName: 'E2E Trader',
          demoBalance: 10000,
          realBalance: 0,
          tier: 'Bronze',
          isAdmin: false
        });
        setIsAdmin(false);
        setLoading(false);
      }).catch(err => {
        console.error("Auth mock login failed:", err);
        setLoading(false);
      });
      return;
    }

    // Explicitly guarantee browser local storage persistence
    setPersistence(auth, browserLocalPersistence).catch(err => {
      console.warn("Failed to set local persistence:", err);
    });

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        // Fetch additional user data from Firestore
        const userDocRef = doc(db, 'users', user.uid);
        const unsubscribeDoc = onSnapshot(userDocRef, async (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            
            // Auto-promote if master email and not admin yet
            if (user.email === 'inudoyin@gmail.com' && !data.isAdmin) {
              await updateDoc(userDocRef, { isAdmin: true });
              // onSnapshot will trigger again after update
            }
            
            setUserData(data);
            setIsAdmin(data.isAdmin === true);
            // Clear relevant offset when real data arrives
            setOptimisticOffset(prev => ({ ...prev })); 
          } else {
            // Initialize user data if it doesn't exist
            const initialData = {
              email: user.email,
              displayName: user.displayName || 'Velo Trader',
              demoBalance: 10000,
              realBalance: 0,
              tier: 'Bronze',
              createdAt: new Date().toISOString(),
              isAdmin: user.email === 'inudoyin@gmail.com' // Grant initial admin to master
            };
            setDoc(userDocRef, initialData);
            setUserData(initialData);
            setIsAdmin(initialData.isAdmin);
          }
          setLoading(false);
        });
        return () => unsubscribeDoc(); // Cleanup for onSnapshot
      } else {
        setUserData(null);
        setIsAdmin(false);
        setLoading(false);
      }
    });

    return () => unsubscribe(); // Cleanup for onAuthStateChanged
  }, []);

  const signOut = async (): Promise<Result<void, Error>> => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('velo_current_view');
      }
      await firebaseSignOut(auth);
      return Ok(undefined);
    } catch (error) {
      return Err(error as Error);
    }
  };

  const applyOptimisticBalance = (amount: number, type: 'demo' | 'real') => {
    setOptimisticOffset(prev => ({
      ...prev,
      [type]: prev[type] + amount
    }));
  };

  // Adjust display userData with optimistic offset
  const displayedUserData = userData ? {
    ...userData,
    demoBalance: (userData.demoBalance || 0) + optimisticOffset.demo,
    realBalance: (userData.realBalance || 0) + optimisticOffset.real
  } : null;

  return (
    <AuthContext.Provider value={{ 
      user, 
      userData: displayedUserData, 
      isAdmin, 
      loading, 
      signOut,
      applyOptimisticBalance
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
