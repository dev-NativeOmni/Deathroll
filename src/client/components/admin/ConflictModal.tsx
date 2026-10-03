import React from 'react';
import { useSite } from '../../context/SiteContext';
import { AlertOctagon, RefreshCw, Copy, Check } from 'lucide-react';

export const ConflictModal: React.FC = () => {
  const { conflictRevision, reloadServerContent, dismissConflict, content } = useSite();
  const [copied, setCopied] = React.useState(false);

  if (!conflictRevision) return null;

  const handleCopyDraft = () => {
    navigator.clipboard.writeText(JSON.stringify(content, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-surface border-4 border-amber-600 max-w-lg w-full p-6 space-y-5 shadow-2xl">
        <div className="flex items-center space-x-3 text-amber-500">
          <AlertOctagon className="w-8 h-8 shrink-0" />
          <div>
            <h3 className="text-xl font-wordmark text-text tracking-wider">
              KONFLIK REVISI TERDETEKSI (REV {conflictRevision})
            </h3>
            <p className="text-xs text-amber-400 font-heading">
              Server telah diperbarui oleh sesi editor lain
            </p>
          </div>
        </div>

        <p className="text-sm text-muted leading-relaxed">
          Dokumen di server telah mengalami perubahan sejak Anda terakhir memuat halaman ini. Untuk mencegah penimpaan perubahan orang lain tanpa sengaja, silakan salin draf Anda (jika perlu) lalu muat versi terbaru dari server.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={handleCopyDraft}
            className="flex-1 py-2 px-3 bg-surface-subtle border border-border hover:border-text text-text font-heading text-xs font-bold flex items-center justify-center space-x-1.5"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Tersalin ke Clipboard!' : 'Salin JSON Draft Saya'}</span>
          </button>

          <button
            onClick={reloadServerContent}
            className="flex-1 py-2 px-3 bg-amber-600 hover:bg-amber-500 text-black font-heading text-xs font-bold flex items-center justify-center space-x-1.5 shadow-punk"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Muat Versi Server Terbaru</span>
          </button>
        </div>
      </div>
    </div>
  );
};
