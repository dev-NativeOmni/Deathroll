import React, { createContext, useContext, useState, useEffect } from 'react';

type AdminContextType = {
  isAdmin: boolean;
  isInitialized: boolean;
  isLoginModalOpen: boolean;
  isPreviewMode: boolean;
  isLoading: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  togglePreviewMode: () => void;
  login: (token: string) => Promise<{ success: boolean; error?: string }>;
  initializeAdmin: (token: string) => Promise<{ success: boolean; error?: string }>;
  resetAdmin: () => void;
  logout: () => Promise<void>;
  refreshAdminState: () => Promise<void>;
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const refreshAdminState = async () => {
    try {
      const res = await fetch('/api/admin/state');
      if (res.ok) {
        const data = await res.json();
        setIsInitialized(data.initialized);
        setIsAdmin(data.authenticated);
        return;
      }
    } catch (err) {
      // Server not connected (Static / Firebase Hosting mode)
    }

    // Client-side fallback check
    const localToken = localStorage.getItem('deathroll_admin_token');
    if (localToken) {
      setIsInitialized(true);
    } else {
      setIsInitialized(false);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    refreshAdminState();
  }, []);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);
  const togglePreviewMode = () => setIsPreviewMode((prev) => !prev);

  const login = async (token: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      if (res.ok) {
        setIsAdmin(true);
        closeLoginModal();
        return { success: true };
      }
    } catch (err) {
      // Server offline, check local token
    }

    const localToken = localStorage.getItem('deathroll_admin_token');
    if (localToken && localToken === token) {
      setIsAdmin(true);
      closeLoginModal();
      return { success: true };
    }

    // If no token was ever set locally or on server
    if (!localToken && !isInitialized) {
      setIsInitialized(false);
      return { success: false, error: 'Admin belum disetup. Silakan buat token baru.' };
    }

    return { success: false, error: 'Token admin salah atau tidak cocok.' };
  };

  const initializeAdmin = async (token: string): Promise<{ success: boolean; error?: string }> => {
    try {
      await fetch('/api/admin/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
    } catch (err) {
      // Ignore server error in static mode
    }

    // Save token locally
    localStorage.setItem('deathroll_admin_token', token);
    setIsInitialized(true);
    setIsAdmin(true);
    closeLoginModal();
    return { success: true };
  };

  const resetAdmin = () => {
    localStorage.removeItem('deathroll_admin_token');
    setIsInitialized(false);
    setIsAdmin(false);
  };

  const logout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch (e) {
      // Ignore
    } finally {
      setIsAdmin(false);
      setIsPreviewMode(false);
    }
  };

  return (
    <AdminContext.Provider
      value={{
        isAdmin,
        isInitialized,
        isLoginModalOpen,
        isPreviewMode,
        isLoading,
        openLoginModal,
        closeLoginModal,
        togglePreviewMode,
        login,
        initializeAdmin,
        resetAdmin,
        logout,
        refreshAdminState,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
