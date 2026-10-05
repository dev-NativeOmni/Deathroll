/**
 * Utility to format and convert Google Drive and other image URLs into direct image stream links.
 * 
 * Supports:
 * - https://drive.google.com/file/d/FILE_ID/view... -> https://lh3.googleusercontent.com/d/FILE_ID
 * - https://drive.google.com/open?id=FILE_ID -> https://lh3.googleusercontent.com/d/FILE_ID
 * - https://drive.google.com/uc?id=FILE_ID -> https://lh3.googleusercontent.com/d/FILE_ID
 * - Standard direct image URLs (Unsplash, Imgur, Cloudinary, etc.)
 */
export function formatImageUrl(url?: string): string {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  // Google Drive URL detector for Images
  const driveFileMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveFileMatch && driveFileMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${driveFileMatch[1]}`;
  }

  const driveIdParamMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (driveIdParamMatch && driveIdParamMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${driveIdParamMatch[1]}`;
  }

  const driveShortMatch = trimmed.match(/drive\.google\.com\/d\/([a-zA-Z0-9_-]+)/);
  if (driveShortMatch && driveShortMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${driveShortMatch[1]}`;
  }

  return trimmed;
}

/**
 * Utility to format and convert Google Drive and other audio URLs into direct audio streaming links.
 */
export function formatAudioUrl(url?: string): string {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  // Data URLs (base64 audio) or blob
  if (trimmed.startsWith('data:audio') || trimmed.startsWith('blob:')) {
    return trimmed;
  }

  // Google Drive URL detector for Audio streaming
  const driveFileMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveFileMatch && driveFileMatch[1]) {
    return `https://docs.google.com/uc?export=download&id=${driveFileMatch[1]}`;
  }

  const driveIdParamMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (driveIdParamMatch && driveIdParamMatch[1]) {
    return `https://docs.google.com/uc?export=download&id=${driveIdParamMatch[1]}`;
  }

  const driveShortMatch = trimmed.match(/drive\.google\.com\/d\/([a-zA-Z0-9_-]+)/);
  if (driveShortMatch && driveShortMatch[1]) {
    return `https://docs.google.com/uc?export=download&id=${driveShortMatch[1]}`;
  }

  return trimmed;
}
