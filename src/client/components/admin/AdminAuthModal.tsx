import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { X, Lock, Key, ShieldCheck, AlertCircle, Loader2, RotateCcw } from 'lucide-react';

export const AdminAuthModal: React.FC = () => {
  const {
    isLoginModalOpen,
    closeLoginModal,
    isInitialized,
    login,
    initializeAdmin,
    resetAdmin,
  } = useAdmin();

  const [token, setToken] = useState('');
  const [confirmToken, setConfirmToken] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetConfirm, setIsResetConfirm] = useState(false);

  if (!isLoginModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isInitialized) {
      if (token.length < 6) {
        setError('Token minimal harus 6 karakter.');
        return;
      }
      if (token !== confirmToken) {
        setError('Konfirmasi token tidak cocok.');
        return;
      }

      setIsSubmitting(true);
      const res = await initializeAdmin(token);
      setIsSubmitting(false);
      if (!res.success) {
        setError(res.error || 'Gagal menginisialisasi admin');
      } else {
        setToken('');
        setConfirmToken('');
      }
    } else {
      if (!token) {
        setError('Masukkan token admin.');
        return;
      }

      setIsSubmitting(true);
      const res = await login(token);
      setIsSubmitting(false);
      if (!res.success) {
        setError(res.error || 'Token salah atau tidak valid');
      } else {
        setToken('');
      }
    }
  };

  const handleResetClick = () => {
    resetAdmin();
    setToken('');
    setConfirmToken('');
    setError(null);
    setIsResetConfirm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-surface border-2 border-accent w-full max-w-md p-6 sm:p-8 shadow-punk-lg relative"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Close Button */}
        <button
          onClick={closeLoginModal}
          className="absolute top-4 right-4 p-1.5 text-muted hover:text-text hover:bg-surface-subtle transition-colors"
          aria-label="Tutup modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-accent text-white flex items-center justify-center border border-text shadow-punk">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 id="modal-title" className="text-2xl font-wordmark text-text tracking-wider">
              {!isInitialized ? 'SETUP TOKEN ADMIN BARU' : 'LOGIN AKSES ADMIN'}
            </h2>
            <p className="text-xs text-muted font-heading uppercase tracking-wider">
              {!isInitialized ? 'Inisialisasi Password Rahasia' : 'In-Place CMS Management'}
            </p>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isInitialized ? (
            <>
              <p className="text-xs text-muted/90 leading-relaxed bg-surface-subtle p-3 border border-border">
                Buat token/password admin baru untuk mengelola dan mengedit seluruh isi website band langsung di halaman ini.
              </p>
              <div>
                <label className="block text-xs font-heading font-bold text-text uppercase tracking-wider mb-1">
                  Buat Token Admin Baru
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-muted absolute left-3 top-3" />
                  <input
                    type="password"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Minimal 6 karakter (cth: deathroll2026)"
                    className="w-full bg-bg border border-border focus:border-accent text-text pl-9 pr-3 py-2 text-sm focus:outline-none"
                    autoFocus
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-heading font-bold text-text uppercase tracking-wider mb-1">
                  Ulangi Token
                </label>
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 text-muted absolute left-3 top-3" />
                  <input
                    type="password"
                    value={confirmToken}
                    onChange={(e) => setConfirmToken(e.target.value)}
                    placeholder="Ketik ulang token yang sama"
                    className="w-full bg-bg border border-border focus:border-accent text-text pl-9 pr-3 py-2 text-sm focus:outline-none"
                    required
                  />
                </div>
              </div>
            </>
          ) : (
            <div>
              <label className="block text-xs font-heading font-bold text-text uppercase tracking-wider mb-1">
                Masukkan Token Admin
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-muted absolute left-3 top-3" />
                <input
                  type="password"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Ketik token admin Anda"
                  className="w-full bg-bg border border-border focus:border-accent text-text pl-9 pr-3 py-2 text-sm focus:outline-none"
                  autoFocus
                  required
                />
              </div>
            </div>
          )}

          {/* Error display */}
          {error && (
            <div className="bg-red-950/80 border border-red-700 text-red-300 p-2.5 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-accent hover:bg-accent-hover text-white font-heading font-bold text-base tracking-wider uppercase shadow-punk transition-all flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <span>{!isInitialized ? 'SIMPAN & AKTIFKAN ADMIN' : 'MASUK KE MODE ADMIN'}</span>
              )}
            </button>
          </div>

          {/* Reset Option if User Forgot Token */}
          {isInitialized && (
            <div className="pt-3 text-center border-t border-border">
              {!isResetConfirm ? (
                <button
                  type="button"
                  onClick={() => setIsResetConfirm(true)}
                  className="text-xs text-muted hover:text-accent underline flex items-center justify-center space-x-1 mx-auto"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Lupa token? Reset dan Buat Token Baru</span>
                </button>
              ) : (
                <div className="space-y-2 bg-surface-subtle p-3 border border-border">
                  <p className="text-xs text-amber-400">
                    Apakah Anda ingin mereset token admin dan membuat token baru?
                  </p>
                  <div className="flex justify-center space-x-2">
                    <button
                      type="button"
                      onClick={handleResetClick}
                      className="px-3 py-1 bg-red-800 hover:bg-red-700 text-white text-xs font-bold"
                    >
                      Ya, Reset Sekarang
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsResetConfirm(false)}
                      className="px-3 py-1 bg-surface text-muted text-xs"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
