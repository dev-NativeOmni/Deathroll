import React from 'react';

/**
 * Clean markdown parser that sanitizes text and prevents XSS / raw HTML injection.
 */
export function renderMarkdown(markdownText: string): React.ReactNode[] {
  if (!markdownText) return [];

  const lines = markdownText.split('\n');
  const elements: React.ReactNode[] = [];
  let inList = false;
  let listItems: string[] = [];

  const flushList = (key: number) => {
    if (inList && listItems.length > 0) {
      elements.push(
        <ul key={`ul-${key}`} className="list-disc list-inside space-y-1 my-3 text-text/90 pl-2">
          {listItems.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              {parseInlineMarkdown(item)}
            </li>
          ))}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Empty lines
    if (!trimmed) {
      flushList(index);
      return;
    }

    // Unordered list
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      inList = true;
      listItems.push(trimmed.substring(2));
      return;
    }

    // Flush any pending list
    flushList(index);

    // Headings
    if (trimmed.startsWith('### ')) {
      elements.push(
        <h3 key={index} className="text-xl font-heading font-bold text-text mt-5 mb-2 tracking-wide">
          {parseInlineMarkdown(trimmed.substring(4))}
        </h3>
      );
      return;
    }
    if (trimmed.startsWith('## ')) {
      elements.push(
        <h2 key={index} className="text-2xl font-heading font-bold text-accent mt-6 mb-3 tracking-wide border-b border-border/60 pb-1">
          {parseInlineMarkdown(trimmed.substring(3))}
        </h2>
      );
      return;
    }
    if (trimmed.startsWith('# ')) {
      elements.push(
        <h1 key={index} className="text-3xl font-heading font-bold text-text mt-8 mb-4 tracking-wider">
          {parseInlineMarkdown(trimmed.substring(2))}
        </h1>
      );
      return;
    }

    // Blockquote
    if (trimmed.startsWith('> ')) {
      elements.push(
        <blockquote
          key={index}
          className="border-l-4 border-accent pl-4 py-2 my-4 bg-surface/80 italic text-muted font-medium text-lg"
        >
          {parseInlineMarkdown(trimmed.substring(2))}
        </blockquote>
      );
      return;
    }

    // Paragraph
    elements.push(
      <p key={index} className="my-3 text-text/90 leading-relaxed text-base">
        {parseInlineMarkdown(trimmed)}
      </p>
    );
  });

  flushList(lines.length);
  return elements;
}

/**
 * Handles inline markdown: **bold**, *italic*, [link](url)
 */
function parseInlineMarkdown(text: string): React.ReactNode {
  // Regex to match markdown links: [text](url)
  const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(parseFormatting(text.substring(lastIndex, match.index)));
    }
    const linkText = match[1];
    const linkUrl = match[2];
    parts.push(
      <a
        key={match.index}
        href={linkUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-accent hover:underline font-semibold"
      >
        {linkText}
      </a>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(parseFormatting(text.substring(lastIndex)));
  }

  return parts.length === 1 ? parts[0] : <>{parts}</>;
}

function parseFormatting(text: string): React.ReactNode {
  // Bold **text**
  const boldRegex = /\*\*([^*]+)\*\*/g;
  const segments: React.ReactNode[] = [];
  let lastIdx = 0;
  let m;

  while ((m = boldRegex.exec(text)) !== null) {
    if (m.index > lastIdx) {
      segments.push(parseItalics(text.substring(lastIdx, m.index)));
    }
    segments.push(
      <strong key={m.index} className="font-bold text-text">
        {m[1]}
      </strong>
    );
    lastIdx = m.index + m[0].length;
  }

  if (lastIdx < text.length) {
    segments.push(parseItalics(text.substring(lastIdx)));
  }

  return segments.length === 1 ? segments[0] : <>{segments}</>;
}

function parseItalics(text: string): React.ReactNode {
  const italicRegex = /\*([^*]+)\*/g;
  const segments: React.ReactNode[] = [];
  let lastIdx = 0;
  let m;

  while ((m = italicRegex.exec(text)) !== null) {
    if (m.index > lastIdx) {
      segments.push(text.substring(lastIdx, m.index));
    }
    segments.push(
      <em key={m.index} className="italic text-muted">
        {m[1]}
      </em>
    );
    lastIdx = m.index + m[0].length;
  }

  if (lastIdx < text.length) {
    segments.push(text.substring(lastIdx));
  }

  return segments.length === 1 ? segments[0] : <>{segments}</>;
}
