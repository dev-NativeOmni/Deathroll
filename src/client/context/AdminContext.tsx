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
  logout: () => Promise<void>;
  refreshAdminState: () => Promise<void>;
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isInitialized, setIsInitialized] = useState(true);
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
      }
    } catch (err) {
      console.error('Failed to check admin state', err);
    } finally {
      setIsLoading(false);
    }
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
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Login gagal' };
      }
      setIsAdmin(true);
      closeLoginModal();
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Koneksi ke server bermasalah' };
    }
  };

  const initializeAdmin = async (token: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/admin/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Inisialisasi gagal' };
      }
      setIsInitialized(true);
      setIsAdmin(true);
      closeLoginModal();
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Koneksi ke server bermasalah' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch (e) {
      console.error(e);
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
