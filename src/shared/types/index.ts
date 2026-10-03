export type ISODate = string;
export type ID = string;

export type SiteSettings = {
  bandName: string; // default: "DEATHROLL"
  tagline: string;
  logoUrl?: string;
  primaryColor: string;
  backgroundColor: string;
  copyrightText: string;
};

export type HeroSlide = {
  id: ID;
  title: string;
  subtitle?: string;
  imageUrl: string;
  imageAlt: string;
  ctaLabel?: string;
  ctaHref?: string;
  position: number;
  published: boolean;
};

export type Show = {
  id: ID;
  slug: string;
  date: ISODate;
  eventName: string;
  venue: string;
  city: string;
  description?: string;
  posterUrl?: string;
  ticketUrl?: string;
  status: "scheduled" | "sold_out" | "cancelled" | "past";
};

export type Release = {
  id: ID;
  slug: string;
  title: string;
  releaseDate: ISODate;
  type: "single" | "ep" | "album" | "live";
  coverUrl: string;
  coverAlt: string;
  description?: string;
  tracklist?: string[];
  chordsLyrics?: string;
  links: {
    spotify?: string;
    appleMusic?: string;
    youtube?: string;
  };
  featured: boolean;
};

export type MerchandiseItem = {
  id: ID;
  name: string;
  category: "tshirt" | "hoodie" | "vinyl" | "cassette" | "accessories";
  price: number;
  formattedPrice: string;
  imageUrl: string;
  badge?: string;
  orderUrl?: string;
  inStock: boolean;
  position: number;
};

export type VideoClip = {
  id: ID;
  title: string;
  category: "music_video" | "live_concert" | "documentary";
  youtubeId: string;
  thumbnailUrl: string;
  duration: string;
  publishedAt: string;
};

export type ShoutboxMessage = {
  id: ID;
  authorName: string;
  city: string;
  message: string;
  favoriteTrack?: string;
  createdAt: string;
};

export type Post = {
  id: ID;
  slug: string;
  title: string;
  excerpt: string;
  bodyMarkdown: string;
  imageUrl?: string;
  imageAlt?: string;
  publishedAt: string;
  status: "draft" | "published";
};

export type Biography = {
  heading: string;
  bodyMarkdown: string;
  imageUrl?: string;
  imageAlt?: string;
  members?: {
    name: string;
    role: string;
    photoUrl?: string;
  }[];
};

export type ExternalLink = {
  id: ID;
  label: string;
  url: string;
  kind: "instagram" | "facebook" | "x" | "spotify" | "apple_music" | "youtube" | "merch" | "other";
  position: number;
};

export type ContactInfo = {
  email?: string;
  whatsapp?: string;
  bookingPhone?: string;
  address?: string;
};

export type AudioTrack = {
  id: ID;
  title: string;
  album: string;
  audioUrl?: string;
  bpm?: number;
};

export type SiteContent = {
  schemaVersion: 1;
  site: SiteSettings;
  heroSlides: HeroSlide[];
  shows: Show[];
  releases: Release[];
  merchandise: MerchandiseItem[];
  videos: VideoClip[];
  posts: Post[];
  biography: Biography;
  links: ExternalLink[];
  contact: ContactInfo;
  audioPlayer?: {
    enabled: boolean;
    tracks: AudioTrack[];
  };
  updatedAt: string;
};

export type AdminState = {
  initialized: boolean;
  authenticated: boolean;
  expiresAt?: string;
};

export type SaveSiteResponse = {
  revision: number;
  updatedAt: string;
};
