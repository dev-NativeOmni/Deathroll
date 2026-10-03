import React, { useState } from 'react';
import { renderMarkdown } from '../../utils/markdown';
import { Bold, Italic, Heading, List, Link, Quote, Eye, Edit } from 'lucide-react';

type MarkdownEditorProps = {
  value: string;
  onChange: (val: string) => void;
  rows?: number;
  label?: string;
  placeholder?: string;
};

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  rows = 8,
  label,
  placeholder,
}) => {
  const [tab, setTab] = useState<'write' | 'preview'>('write');

  const insertSyntax = (prefix: string, suffix: string = '') => {
    onChange(`${value}${prefix}teks${suffix}`);
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        {label && (
          <label className="block text-xs font-heading font-bold text-text uppercase tracking-wider">
            {label}
          </label>
        )}
        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={() => setTab('write')}
            className={`px-2 py-0.5 text-xs font-heading font-semibold flex items-center space-x-1 border ${
              tab === 'write'
                ? 'bg-accent text-white border-accent'
                : 'bg-surface text-muted border-border'
            }`}
          >
            <Edit className="w-3 h-3" />
            <span>Tulis</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('preview')}
            className={`px-2 py-0.5 text-xs font-heading font-semibold flex items-center space-x-1 border ${
              tab === 'preview'
                ? 'bg-accent text-white border-accent'
                : 'bg-surface text-muted border-border'
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>Preview</span>
          </button>
        </div>
      </div>

      {tab === 'write' ? (
        <div className="border border-border bg-bg">
          {/* Markdown Action Toolbar */}
          <div className="flex flex-wrap items-center gap-1 p-1.5 bg-surface border-b border-border text-muted">
            <button
              type="button"
              onClick={() => insertSyntax('## ')}
              className="p-1 hover:text-text hover:bg-surface-subtle"
              title="Heading 2"
            >
              <Heading className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertSyntax('**', '**')}
              className="p-1 hover:text-text hover:bg-surface-subtle"
              title="Bold"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertSyntax('*', '*')}
              className="p-1 hover:text-text hover:bg-surface-subtle"
              title="Italic"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertSyntax('- ')}
              className="p-1 hover:text-text hover:bg-surface-subtle"
              title="List"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertSyntax('> ')}
              className="p-1 hover:text-text hover:bg-surface-subtle"
              title="Blockquote"
            >
              <Quote className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertSyntax('[Judul Link](', ')')}
              className="p-1 hover:text-text hover:bg-surface-subtle"
              title="Link"
            >
              <Link className="w-3.5 h-3.5" />
            </button>
          </div>

          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={rows}
            placeholder={placeholder || 'Tulis format Markdown di sini...'}
            className="w-full bg-bg text-text p-3 text-sm focus:outline-none font-mono resize-y"
          />
        </div>
      ) : (
        <div className="border border-border bg-surface p-4 min-h-[160px] max-h-[350px] overflow-y-auto">
          {value ? (
            renderMarkdown(value)
          ) : (
            <span className="text-xs text-muted italic">Tidak ada teks markdown untuk dipreview.</span>
          )}
        </div>
      )}
    </div>
  );
};
