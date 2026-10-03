import { z } from 'zod';

export const SiteSettingsSchema = z.object({
  bandName: z.string().min(1, 'Nama band wajib diisi'),
  tagline: z.string().min(1, 'Tagline wajib diisi'),
  logoUrl: z.string().url().or(z.literal('')).optional(),
  primaryColor: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/, 'Format HEX warna tidak valid'),
  backgroundColor: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/, 'Format HEX warna tidak valid'),
  copyrightText: z.string().min(1, 'Copyright text wajib diisi'),
});

export const HeroSlideSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1, 'Judul hero wajib diisi'),
  subtitle: z.string().optional(),
  imageUrl: z.string().min(1, 'URL gambar wajib diisi'),
  imageAlt: z.string().min(1, 'Alt text wajib diisi'),
  ctaLabel: z.string().optional(),
  ctaHref: z.string().optional(),
  position: z.number().int().nonnegative(),
  published: z.boolean(),
});

export const ShowSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, 'Slug hanya boleh huruf kecil, angka, dan strip'),
  date: z.string().min(1, 'Tanggal acara wajib diisi'),
  eventName: z.string().min(1, 'Nama acara wajib diisi'),
  venue: z.string().min(1, 'Venue wajib diisi'),
  city: z.string().min(1, 'Kota wajib diisi'),
  description: z.string().optional(),
  posterUrl: z.string().url().or(z.literal('')).optional(),
  ticketUrl: z.string().url().or(z.literal('')).optional(),
  status: z.enum(['scheduled', 'sold_out', 'cancelled', 'past']),
});

export const ReleaseSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, 'Slug hanya boleh huruf kecil, angka, dan strip'),
  title: z.string().min(1, 'Judul rilisan wajib diisi'),
  releaseDate: z.string().min(1, 'Tanggal rilis wajib diisi'),
  type: z.enum(['single', 'ep', 'album', 'live']),
  coverUrl: z.string().min(1, 'URL cover wajib diisi'),
  coverAlt: z.string().min(1, 'Alt text cover wajib diisi'),
  description: z.string().optional(),
  tracklist: z.array(z.string()).optional(),
  chordsLyrics: z.string().optional(),
  links: z.object({
    spotify: z.string().url().or(z.literal('')).optional(),
    appleMusic: z.string().url().or(z.literal('')).optional(),
    youtube: z.string().url().or(z.literal('')).optional(),
  }),
  featured: z.boolean(),
});

export const MerchandiseItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, 'Nama merch wajib diisi'),
  category: z.enum(['tshirt', 'hoodie', 'vinyl', 'cassette', 'accessories']),
  price: z.number().nonnegative(),
  formattedPrice: z.string().min(1),
  imageUrl: z.string().min(1, 'URL gambar merch wajib diisi'),
  badge: z.string().optional(),
  orderUrl: z.string().optional(),
  inStock: z.boolean(),
  position: z.number().int().nonnegative(),
});

export const VideoClipSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1, 'Judul video wajib diisi'),
  category: z.enum(['music_video', 'live_concert', 'documentary']),
  youtubeId: z.string().min(1, 'YouTube ID / URL wajib diisi'),
  thumbnailUrl: z.string().min(1),
  duration: z.string().min(1),
  publishedAt: z.string().min(1),
});

export const ShoutboxMessageSchema = z.object({
  id: z.string().min(1),
  authorName: z.string().min(2, 'Nama minimal 2 karakter').max(30),
  city: z.string().min(2, 'Kota minimal 2 karakter').max(30),
  message: z.string().min(3, 'Pesan minimal 3 karakter').max(280),
  favoriteTrack: z.string().max(50).optional(),
  createdAt: z.string(),
});

export const PostSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, 'Slug hanya boleh huruf kecil, angka, dan strip'),
  title: z.string().min(1, 'Judul berita wajib diisi'),
  excerpt: z.string().min(1, 'Ringkasan wajib diisi'),
  bodyMarkdown: z.string().min(1, 'Isi artikel wajib diisi'),
  imageUrl: z.string().url().or(z.literal('')).optional(),
  imageAlt: z.string().optional(),
  publishedAt: z.string().min(1, 'Tanggal publikasi wajib diisi'),
  status: z.enum(['draft', 'published']),
});

export const MemberSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  photoUrl: z.string().url().or(z.literal('')).optional(),
});

export const BiographySchema = z.object({
  heading: z.string().min(1, 'Judul biografi wajib diisi'),
  bodyMarkdown: z.string().min(1, 'Teks biografi wajib diisi'),
  imageUrl: z.string().url().or(z.literal('')).optional(),
  imageAlt: z.string().optional(),
  members: z.array(MemberSchema).optional(),
});

export const ExternalLinkSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1, 'Label link wajib diisi'),
  url: z.string().url('URL tidak valid'),
  kind: z.enum(['instagram', 'facebook', 'x', 'spotify', 'apple_music', 'youtube', 'merch', 'other']),
  position: z.number().int().nonnegative(),
});

export const ContactInfoSchema = z.object({
  email: z.string().email('Format email tidak valid').or(z.literal('')).optional(),
  whatsapp: z.string().optional(),
  bookingPhone: z.string().optional(),
  address: z.string().optional(),
});

export const SiteContentSchema = z.object({
  schemaVersion: z.literal(1),
  site: SiteSettingsSchema,
  heroSlides: z.array(HeroSlideSchema),
  shows: z.array(ShowSchema),
  releases: z.array(ReleaseSchema),
  merchandise: z.array(MerchandiseItemSchema),
  videos: z.array(VideoClipSchema),
  posts: z.array(PostSchema),
  biography: BiographySchema,
  links: z.array(ExternalLinkSchema),
  contact: ContactInfoSchema,
  updatedAt: z.string(),
});

export const InitializeAdminInputSchema = z.object({
  token: z.string().min(6, 'Token admin minimal 6 karakter'),
});

export const LoginAdminInputSchema = z.object({
  token: z.string().min(1, 'Token wajib diisi'),
});

export const SaveSiteInputSchema = z.object({
  content: SiteContentSchema,
  expectedRevision: z.number().int().nonnegative(),
});

export const CreateShoutInputSchema = z.object({
  authorName: z.string().min(2, 'Nama minimal 2 karakter').max(30),
  city: z.string().min(2, 'Kota / asal wilayah minimal 2 karakter').max(30),
  message: z.string().min(3, 'Pesan shoutbox minimal 3 karakter').max(280),
  favoriteTrack: z.string().max(50).optional(),
});
