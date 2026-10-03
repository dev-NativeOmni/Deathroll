import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SiteContent } from '../../shared/types';
import { INITIAL_SITE_CONTENT } from '../../shared/constants/initialData';
import { db, doc, getDoc, setDoc } from '../firebase';

type DrawerType = 'site' | 'hero' | 'shows' | 'releases' | 'merch' | 'videos' | 'posts' | 'biography' | 'links' | 'contact' | 'audio' | 'json' | null;

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
    // 1. Fast initial load from localStorage if available
    try {
      const cached = localStorage.getItem('deathroll_content');
      if (cached) {
        const parsed = JSON.parse(cached);
        setServerContent(parsed);
        setDraftContent(parsed);
      }
    } catch (e) {}

    // 2. Fetch official cloud data from Cloud Firestore
    try {
      setIsLoading(true);
      const docRef = doc(db, 'content', 'siteContent');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data && data.content) {
          setServerContent(data.content);
          setDraftContent(data.content);
          setRevision(data.revision || 1);
          setIsDirty(false);
          try { localStorage.setItem('deathroll_content', JSON.stringify(data.content)); } catch (e) {}
          return;
        }
      }
    } catch (fsErr) {
      console.warn('Firestore load fallback to local/API:', fsErr);
    } finally {
      setIsLoading(false);
    }

    // 3. Fallback to API if running fullstack Express
    try {
      const res = await fetch('/api/content');
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (data && data.content) {
          setServerContent(data.content);
          setDraftContent(data.content);
          setRevision(data.revision || 1);
          setIsDirty(false);
          try { localStorage.setItem('deathroll_content', JSON.stringify(data.content)); } catch (e) {}
        }
      }
    } catch (err) {
      // Offline mode
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
    setStatusMessage('Menyimpan ke Cloud Database...');

    try {
      let serverSaved = false;
      let newRevision = revision + 1;

      // 1. Save directly to Google Cloud Firestore
      try {
        const docRef = doc(db, 'content', 'siteContent');
        await setDoc(docRef, {
          content: draftContent,
          revision: newRevision,
          updatedAt: new Date().toISOString(),
        });
        serverSaved = true;
      } catch (fsErr) {
        console.warn('Firestore write error:', fsErr);
      }

      // 2. Also try API if fullstack Express is running
      try {
        const res = await fetch('/api/admin/content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: draftContent,
            expectedRevision: revision,
          }),
        });
        const contentType = res.headers.get('content-type') || '';
        if (res.ok && contentType.includes('application/json')) {
          const data = await res.json();
          if (data && data.revision) newRevision = data.revision;
          serverSaved = true;
        }
      } catch (netErr) {}

      // 3. Always persist to localStorage
      try {
        localStorage.setItem('deathroll_content', JSON.stringify(draftContent));
      } catch (e) {}

      setServerContent(draftContent);
      setRevision(newRevision);
      setIsDirty(false);
      setSaveStatus('saved');
      setStatusMessage(serverSaved ? 'Perubahan berhasil disimpan ke Cloud Database!' : 'Perubahan berhasil disimpan!');

      setTimeout(() => {
        setSaveStatus('idle');
        setStatusMessage(null);
      }, 3500);

      return true;
    } catch (err) {
      setSaveStatus('error');
      setStatusMessage('Gagal menyimpan perubahan.');
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
