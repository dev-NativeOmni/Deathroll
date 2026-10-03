import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SiteContent } from '../../shared/types';
import { INITIAL_SITE_CONTENT } from '../../shared/constants/initialData';

type DrawerType = 'site' | 'hero' | 'shows' | 'releases' | 'merch' | 'videos' | 'posts' | 'biography' | 'links' | 'contact' | 'json' | null;

type SiteContextType = {
  content: SiteContent;
  revision: number;
  isLoading: boolean;
  isSaving: boolean;
  isDirty: boolean;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error' | 'conflict';
  statusMessage: string | null;
  activeDrawer: DrawerType;
  openDrawer: (drawer: DrawerType) => void;
  closeDrawer: () => void;
  updateDraft: (updater: (prev: SiteContent) => SiteContent) => void;
  saveChanges: () => Promise<boolean>;
  discardChanges: () => void;
  reloadServerContent: () => Promise<void>;
  conflictRevision: number | null;
  dismissConflict: () => void;
};

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [serverContent, setServerContent] = useState<SiteContent>(INITIAL_SITE_CONTENT);
  const [draftContent, setDraftContent] = useState<SiteContent>(INITIAL_SITE_CONTENT);
  const [revision, setRevision] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error' | 'conflict'>('idle');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [activeDrawer, setActiveDrawer] = useState<DrawerType>(null);
  const [conflictRevision, setConflictRevision] = useState<number | null>(null);

  const fetchContent = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/content');
      if (res.ok) {
        const data = await res.json();
        setServerContent(data.content);
        setDraftContent(data.content);
        setRevision(data.revision);
        setIsDirty(false);
        try { localStorage.setItem('deathroll_content', JSON.stringify(data.content)); } catch (e) {}
        return;
      }
    } catch (err) {
      // Offline / Static mode fallback to localStorage
      try {
        const cached = localStorage.getItem('deathroll_content');
        if (cached) {
          const parsed = JSON.parse(cached);
          setServerContent(parsed);
          setDraftContent(parsed);
        }
      } catch (e) {}
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  // Warn user before leaving page if there are unsaved drafts
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const updateDraft = (updater: (prev: SiteContent) => SiteContent) => {
    setDraftContent((prev) => {
      const next = updater(prev);
      setIsDirty(true);
      return next;
    });
  };

  const openDrawer = (drawer: DrawerType) => setActiveDrawer(drawer);
  const closeDrawer = () => setActiveDrawer(null);

  const saveChanges = async (): Promise<boolean> => {
    setIsSaving(true);
    setSaveStatus('saving');
    setStatusMessage('Menyimpan perubahan ke server...');

    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: draftContent,
          expectedRevision: revision,
        }),
      });

      const data = await res.json();

      if (res.status === 409) {
        setSaveStatus('conflict');
        setConflictRevision(data.currentRevision || revision + 1);
        setStatusMessage('Terjadi konflik versi! Server telah diperbarui oleh sesi lain.');
        return false;
      }

      if (!res.ok) {
        setSaveStatus('error');
        setStatusMessage(data.error || data.details || 'Gagal menyimpan data');
        return false;
      }

      setServerContent(draftContent);
      setRevision(data.revision);
      setIsDirty(false);
      setSaveStatus('saved');
      setStatusMessage('Perubahan berhasil disimpan permanen!');

      setTimeout(() => {
        setSaveStatus('idle');
        setStatusMessage(null);
      }, 4000);

      return true;
    } catch (err) {
      setSaveStatus('error');
      setStatusMessage('Koneksi jaringan terputus.');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const discardChanges = () => {
    if (window.confirm('Batalkan semua perubahan draft yang belum disimpan?')) {
      setDraftContent(serverContent);
      setIsDirty(false);
      setSaveStatus('idle');
      setStatusMessage(null);
    }
  };

  const reloadServerContent = async () => {
    await fetchContent();
    setConflictRevision(null);
    setSaveStatus('idle');
    setStatusMessage(null);
  };

  const dismissConflict = () => setConflictRevision(null);

  return (
    <SiteContext.Provider
      value={{
        content: draftContent,
        revision,
        isLoading,
        isSaving,
        isDirty,
        saveStatus,
        statusMessage,
        activeDrawer,
        openDrawer,
        closeDrawer,
        updateDraft,
        saveChanges,
        discardChanges,
        reloadServerContent,
        conflictRevision,
        dismissConflict,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error('useSite must be used within a SiteProvider');
  }
  return context;
};
