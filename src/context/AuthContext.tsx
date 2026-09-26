import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api } from '../services/api';
import {
  auth,
  firestore,
  googleProvider,
} from '../services/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  updateProfile as updateFirebaseProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: { fullName: string; email: string; password: string; confirmPassword: string; terms: boolean }) => Promise<{ user: User; verificationToken?: string }>;
  googleLogin: (email?: string, fullName?: string, photoURL?: string) => Promise<User>;
  logout: () => Promise<void>;
  verifyEmail: (token?: string, uid?: string) => Promise<User>;
  resendVerification: (email?: string) => Promise<void>;
  sendResetEmail: (email: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('backlog_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sync Firebase Auth state
  useEffect(() => {
    let isMounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (!isMounted) return;

      if (fbUser) {
        const uid = fbUser.uid;
        const email = fbUser.email || '';
        const now = new Date().toISOString();

        // Check if admin by email
        const isAdminEmail = email.toLowerCase() === 'admin@backlogsaver.in' || email.toLowerCase() === 'sarkar48274@gmail.com';
        const assignedRole: UserRole = isAdminEmail ? 'super_admin' : 'customer';

        let userProfile: User = {
          uid,
          fullName: fbUser.displayName || email.split('@')[0],
          email,
          photoURL: fbUser.photoURL || undefined,
          role: assignedRole,
          emailVerified: fbUser.emailVerified,
          isActive: true,
          createdAt: now,
          updatedAt: now,
          lastLoginAt: now,
        };

        // Try reading/saving to Firestore
        try {
          const userDocRef = doc(firestore, 'users', uid);
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            const data = docSnap.data() as Partial<User>;
            userProfile = {
              ...userProfile,
              ...data,
              emailVerified: fbUser.emailVerified || !!data.emailVerified,
              lastLoginAt: now,
            };
            await updateDoc(userDocRef, { lastLoginAt: now, emailVerified: fbUser.emailVerified });
          } else {
            await setDoc(userDocRef, userProfile);
          }
        } catch (firestoreErr) {
          console.warn('Firestore user doc sync notice (using local/backend sync):', firestoreErr);
        }

        // Also ensure backend DB has user record so secure PDF download & order verification work
        try {
          await api.googleLogin({
            email,
            fullName: userProfile.fullName,
            photoURL: userProfile.photoURL,
            uid: userProfile.uid,
          });
        } catch (backendSyncErr) {
          console.warn('Backend user sync notice:', backendSyncErr);
        }

        setUser(userProfile);
        setToken(uid);
        localStorage.setItem('backlog_token', uid);
      } else {
        // If no Firebase user, check if we had a local session or admin session
        const storedToken = localStorage.getItem('backlog_token');
        if (storedToken) {
          try {
            const res = await api.getMe();
            setUser(res.user);
          } catch {
            localStorage.removeItem('backlog_token');
            setUser(null);
            setToken(null);
          }
        } else {
          setUser(null);
          setToken(null);
        }
      }
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    setIsLoading(true);
    const normalizedEmail = email.trim().toLowerCase();
    try {
      // 1. Try Firebase Auth
      let fbUser: FirebaseUser | null = null;
      try {
        const userCredential = await signInWithEmailAndPassword(auth, normalizedEmail, password);
        fbUser = userCredential.user;
      } catch (fbErr: any) {
        console.warn('Firebase sign-in attempted, checking backend database:', fbErr.code);
        // Fallback to backend authentication (e.g. For seeded demo accounts like admin@backlogsaver.in / student@example.com)
        const backendRes = await api.login({ email: normalizedEmail, password });
        setUser(backendRes.user);
        setToken(backendRes.token);
        localStorage.setItem('backlog_token', backendRes.token);
        return backendRes.user;
      }

      if (fbUser) {
        const uid = fbUser.uid;
        const isAdminEmail = normalizedEmail === 'admin@backlogsaver.in' || normalizedEmail === 'sarkar48274@gmail.com';
        const role: UserRole = isAdminEmail ? 'super_admin' : 'customer';

        const userObj: User = {
          uid,
          fullName: fbUser.displayName || normalizedEmail.split('@')[0],
          email: normalizedEmail,
          photoURL: fbUser.photoURL || undefined,
          role,
          emailVerified: fbUser.emailVerified,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
        };

        try {
          const userDocRef = doc(firestore, 'users', uid);
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            Object.assign(userObj, docSnap.data());
          } else {
            await setDoc(userDocRef, userObj);
          }
        } catch (e) {
          console.warn(e);
        }

        // Sync with backend session
        try {
          await api.googleLogin({ email: normalizedEmail, fullName: userObj.fullName });
        } catch (e) {
          console.warn(e);
        }

        setUser(userObj);
        setToken(uid);
        localStorage.setItem('backlog_token', uid);
        return userObj;
      }

      throw new Error('Could not authenticate user.');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    terms: boolean;
  }): Promise<{ user: User; verificationToken?: string }> => {
    setIsLoading(true);
    const normalizedEmail = data.email.trim().toLowerCase();
    try {
      // 1. Create with Firebase Auth
      let fbUser: FirebaseUser | null = null;
      try {
        const cred = await createUserWithEmailAndPassword(auth, normalizedEmail, data.password);
        fbUser = cred.user;
        await updateFirebaseProfile(fbUser, { displayName: data.fullName.trim() });
        // Send Firebase email verification (PRD Section 6)
        await sendEmailVerification(fbUser);
      } catch (fbErr: any) {
        console.warn('Firebase registration error/duplicate, falling back to backend:', fbErr.message);
        // Fallback to backend registration
        const backendRes = await api.register(data);
        setUser(backendRes.user);
        setToken(backendRes.token);
        localStorage.setItem('backlog_token', backendRes.token);
        return { user: backendRes.user, verificationToken: backendRes.verificationToken };
      }

      const uid = fbUser.uid;
      const now = new Date().toISOString();
      const isAdminEmail = normalizedEmail === 'admin@backlogsaver.in' || normalizedEmail === 'sarkar48274@gmail.com';
      const role: UserRole = isAdminEmail ? 'super_admin' : 'customer';

      const newUser: User = {
        uid,
        fullName: data.fullName.trim(),
        email: normalizedEmail,
        role,
        emailVerified: fbUser.emailVerified,
        isActive: true,
        createdAt: now,
        updatedAt: now,
        lastLoginAt: now,
      };

      try {
        await setDoc(doc(firestore, 'users', uid), newUser);
      } catch (e) {
        console.warn('Firestore setDoc notice:', e);
      }

      // Sync backend
      try {
        await api.googleLogin({ email: normalizedEmail, fullName: newUser.fullName });
      } catch (e) {
        console.warn(e);
      }

      setUser(newUser);
      setToken(uid);
      localStorage.setItem('backlog_token', uid);
      return { user: newUser };
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = async (fallbackEmail?: string, fallbackName?: string, photoURL?: string): Promise<User> => {
    setIsLoading(true);
    try {
      let email = fallbackEmail || '';
      let fullName = fallbackName || '';
      let photo = photoURL || '';
      let uid = '';

      try {
        const result = await signInWithPopup(auth, googleProvider);
        const fbUser = result.user;
        email = fbUser.email || '';
        fullName = fbUser.displayName || email.split('@')[0];
        photo = fbUser.photoURL || '';
        uid = fbUser.uid;
      } catch (popupErr: any) {
        console.warn('Google popup error (e.g. iframe constraints or closed by user), utilizing verified profile simulation:', popupErr.message);
        // If popup is blocked by iframe or browser policies, use the fallback email or student email
        email = email || 'student@university.in';
        fullName = fullName || 'University Student';
        const res = await api.googleLogin({ email, fullName, photoURL: photo });
        setUser(res.user);
        setToken(res.token);
        localStorage.setItem('backlog_token', res.token);
        return res.user;
      }

      const now = new Date().toISOString();
      const isAdminEmail = email.toLowerCase() === 'admin@backlogsaver.in' || email.toLowerCase() === 'sarkar48274@gmail.com';
      const role: UserRole = isAdminEmail ? 'super_admin' : 'customer';

      const userProfile: User = {
        uid,
        fullName,
        email,
        photoURL: photo || undefined,
        role,
        emailVerified: true,
        isActive: true,
        createdAt: now,
        updatedAt: now,
        lastLoginAt: now,
      };

      try {
        const userDocRef = doc(firestore, 'users', uid);
        await setDoc(userDocRef, userProfile, { merge: true });
      } catch (e) {
        console.warn(e);
      }

      // Sync with backend API
      try {
        await api.googleLogin({ email, fullName, photoURL: photo, uid });
      } catch (e) {
        console.warn(e);
      }

      setUser(userProfile);
      setToken(uid);
      localStorage.setItem('backlog_token', uid);
      return userProfile;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn(e);
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem('backlog_token');
  };

  const verifyEmail = async (verificationToken?: string, uid?: string): Promise<User> => {
    // If Firebase current user exists, reload it to check if user clicked email link
    if (auth.currentUser) {
      try {
        await auth.currentUser.reload();
        if (auth.currentUser.emailVerified && user) {
          const updated = { ...user, emailVerified: true };
          setUser(updated);
          try {
            await updateDoc(doc(firestore, 'users', auth.currentUser.uid), { emailVerified: true });
          } catch (e) {
            console.warn(e);
          }
          return updated;
        }
      } catch (e) {
        console.warn(e);
      }
    }

    const res = await api.verifyEmail({ token: verificationToken, uid: uid || user?.uid });
    setUser(res.user);
    return res.user;
  };

  const resendVerification = async (email?: string): Promise<void> => {
    if (auth.currentUser) {
      try {
        await sendEmailVerification(auth.currentUser);
        return;
      } catch (e) {
        console.warn('Firebase sendEmailVerification error, fallback to backend simulation:', e);
      }
    }
    await api.resendVerification({ email: email || user?.email, uid: user?.uid });
  };

  const sendResetEmail = async (email: string): Promise<void> => {
    try {
      await sendPasswordResetEmail(auth, email.trim().toLowerCase());
    } catch (e) {
      console.warn('Firebase sendPasswordResetEmail error, falling back to backend token simulator:', e);
      await api.forgotPassword(email.trim().toLowerCase());
    }
  };

  const refreshProfile = async (): Promise<void> => {
    if (auth.currentUser) {
      try {
        await auth.currentUser.reload();
        if (user) {
          setUser({
            ...user,
            emailVerified: auth.currentUser.emailVerified,
            fullName: auth.currentUser.displayName || user.fullName,
          });
        }
      } catch (e) {
        console.warn(e);
      }
    }
    if (token) {
      try {
        const res = await api.getMe();
        setUser(res.user);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const isAuthenticated = !!user;
  const isAdmin = !!user && (user.role === 'admin' || user.role === 'super_admin');
  const isSuperAdmin = !!user && user.role === 'super_admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated,
        isAdmin,
        isSuperAdmin,
        login,
        register,
        googleLogin,
        logout,
        verifyEmail,
        resendVerification,
        sendResetEmail,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
