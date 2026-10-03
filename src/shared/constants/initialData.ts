import { SiteContent, ShoutboxMessage } from '../types';

export const INITIAL_SHOUTBOX_MESSAGES: ShoutboxMessage[] = [
  {
    id: "shout-1",
    authorName: "Rian CirclePit",
    city: "Bandung",
    message: "Ditunggu moshpit liar di Monumen Perjuangan Bandung bulan depan! Siap bakar energi!",
    favoriteTrack: "Pembakar Api Perlawanan",
    createdAt: "2026-10-02T16:20:00+07:00"
  },
  {
    id: "shout-2",
    authorName: "Putu Punker",
    city: "Denpasar, Bali",
    message: "Sunset Gigs di Kuta gak pernah ngecewain! Respect terus buat trio DEATHROLL! Tetap merdeka!",
    favoriteTrack: "Suara Dari Jalanan",
    createdAt: "2026-10-01T20:15:00+08:00"
  },
  {
    id: "shout-3",
    authorName: "Bayu Lowrider",
    city: "Yogyakarta",
    message: "Salam sedulur kustom kulture Jogja! Laskar Berbisa anthem wajib waktu kami touring!",
    favoriteTrack: "Laskar Berbisa",
    createdAt: "2026-09-29T11:45:00+07:00"
  },
  {
    id: "shout-4",
    authorName: "Anindya LadyRose",
    city: "Surabaya",
    message: "Vinyl Suara Dari Jalanan udah mendarat mulus di Suroboyo. Liriknya nancep banget di dada!",
    favoriteTrack: "Nyanyian Kaum Terpinggirkan",
    createdAt: "2026-09-27T14:10:00+07:00"
  }
];

export const INITIAL_SITE_CONTENT: SiteContent = {
  schemaVersion: 1,
  site: {
    bandName: "DEATHROLL",
    tagline: "HIGH VOLTAGE PUNK ROCK & REBEL HYMNS FROM THE UNDERGROUND",
    logoUrl: "",
    primaryColor: "#d71920",
    backgroundColor: "#0b0b0b",
    copyrightText: "© 2026 DEATHROLL OFFICIAL. ALL RIGHTS RESERVED. BORN TO ROCK, LIVE TO RESIST."
  },
  heroSlides: [
    {
      id: "hero-1",
      title: "DISTORSI JIWA TOUR 2026",
      subtitle: "GEMURUH DISTORSI MELINTASI 14 KOTA DI INDONESIA",
      imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1920&auto=format&fit=crop",
      imageAlt: "DEATHROLL performing live on stage with crowd surfing and red stage lights",
      ctaLabel: "LIHAT JADWAL TUR",
      ctaHref: "/tour",
      position: 0,
      published: true
    },
    {
      id: "hero-2",
      title: "NEW ALBUM: SUARA DARI JALANAN",
      subtitle: "12 TRACK ANTHEM PERLAWANAN & PERSAUDARAAN. STREAMING NOW!",
      imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1920&auto=format&fit=crop",
      imageAlt: "Concert crowd roaring and raising hands in punk rock show",
      ctaLabel: "DENGARKAN SEKARANG",
      ctaHref: "/discography/suara-dari-jalanan",
      position: 1,
      published: true
    },
    {
      id: "hero-3",
      title: "OFFICIAL MERCHANDISE DROP VOL. 4",
      subtitle: "LIMITED EDITION HEAVYWEIGHT TEES, HOODIES & VINYL RECORDS",
      imageUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1920&auto=format&fit=crop",
      imageAlt: "Band member playing electric guitar in smoky live venue",
      ctaLabel: "BELI MERCH RESMI",
      ctaHref: "#merch-section",
      position: 2,
      published: true
    }
  ],
  shows: [
    {
      id: "show-1",
      slug: "jakarta-rock-fest-2026",
      date: "2026-10-24T19:30:00+07:00",
      eventName: "JAKARTA NOISE EXPLOSION FEST",
      venue: "Stadion Madya Senayan",
      city: "Jakarta",
      description: "Pesta punk rock akbar memperingati 15 tahun DEATHROLL bersama 10 band cadas nusantara. Siapkan tenaga untuk circle pit!",
      posterUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=800&auto=format&fit=crop",
      ticketUrl: "https://tiket.com/event/jakarta-noise-explosion",
      status: "scheduled"
    },
    {
      id: "show-2",
      slug: "bali-sunset-rebel-session",
      date: "2026-11-07T18:00:00+08:00",
      eventName: "BALI SUNSET REBEL FESTIVAL",
      venue: "Pantai Kuta Open Stage",
      city: "Bali",
      description: "Konser tepi pantai dengan gemuruh drum dan distorsi gitar menyatu dengan ombak laut selatan.",
      posterUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop",
      ticketUrl: "https://tiket.com/event/bali-sunset-rebel",
      status: "scheduled"
    },
    {
      id: "show-3",
      slug: "bandung-hardcore-matinee",
      date: "2026-11-21T16:00:00+07:00",
      eventName: "BANDUNG UNDERGROUND MATINEE",
      venue: "Monumen Perjuangan Stage",
      city: "Bandung",
      description: "Panggung intim berenergi tinggi untuk para underground warriors kota Kembang.",
      posterUrl: "https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?q=80&w=800&auto=format&fit=crop",
      ticketUrl: "https://tiket.com/event/bandung-matinee",
      status: "sold_out"
    },
    {
      id: "show-4",
      slug: "yogyakarta-kustom-kulture-rumble",
      date: "2026-12-05T20:00:00+07:00",
      eventName: "JOGJA KUSTOM RUMBLE NIGHT",
      venue: "Jogja Expo Center",
      city: "Yogyakarta",
      description: "Kolaborasi musik punk rock dengan parade kustom bike dan lowrider nusantara.",
      posterUrl: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?q=80&w=800&auto=format&fit=crop",
      ticketUrl: "https://tiket.com/event/jogja-rumble",
      status: "scheduled"
    },
    {
      id: "show-5",
      slug: "surabaya-distorsi-pantura",
      date: "2026-09-12T19:00:00+07:00",
      eventName: "SURABAYA HEROIC ROCK NIGHT",
      venue: "Jatim Expo Surabaya",
      city: "Surabaya",
      description: "Malam legendaris membakar semangat arek-arek Suroboyo dengan 20 lagu tanpa henti.",
      posterUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop",
      ticketUrl: "",
      status: "past"
    }
  ],
  releases: [
    {
      id: "rel-1",
      slug: "suara-dari-jalanan",
      title: "Suara Dari Jalanan",
      releaseDate: "2026-03-15",
      type: "album",
      coverUrl: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=800&auto=format&fit=crop",
      coverAlt: "Suara Dari Jalanan Album Art Cover - High Contrast Punk Red and Black",
      description: "Album studio ke-5 DEATHROLL berisikan 12 track bertempo cepat dengan lirik pedas tentang solidaritas sosial, perjuangan kelas pekerja, dan api semangat yang menolak padam.",
      tracklist: [
        "1. Pembakar Api Perlawanan (03:12)",
        "2. Suara Dari Jalanan (03:45)",
        "3. Menolak Tunduk (02:58)",
        "4. Nyanyian Kaum Terpinggirkan (04:10)",
        "5. Darah & Peluh (03:22)",
        "6. Malam Berontak (03:05)",
        "7. Tanah Ibu Pertiwi (04:30)",
        "8. Anthem Persaudaraan (03:18)",
        "9. Distorsi Tanpa Kompromi (02:45)",
        "10. Badai Pasti Berlalu (04:02)",
        "11. Senja di Pesisir Merdeka (03:50)",
        "12. Selamanya Kami Berdiri (04:15)"
      ],
      chordsLyrics: `[Intro]
Em  C  G  D  (x4)
(Distortion guitar power chords)

[Verse 1]
Em            C
Di bawah langit abu-abu kota ini
G             D
Langkah kakiku menolak tuk berhenti
Em            C
Keringat menetes membasahi aspal keras
G             D
Suara perlawanan kan bergema membekas

[Chorus]
Em          C          G          D
Bakar api perlawanan! Jangan pernah kau padamkan!
Em          C          G          D
Bersama kita teriakkan! Suara dari jalanan!

[Solo]
Em  G  C  D  Em`,
      links: {
        spotify: "https://open.spotify.com/album/deathroll-suara-jalanan",
        appleMusic: "https://music.apple.com/album/deathroll-suara-jalanan",
        youtube: "https://youtube.com/playlist?list=deathroll-suara-jalanan"
      },
      featured: true
    },
    {
      id: "rel-2",
      slug: "rebel-soul-anthem",
      title: "Rebel Soul Anthem",
      releaseDate: "2025-08-20",
      type: "ep",
      coverUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop",
      coverAlt: "Rebel Soul Anthem EP Cover",
      description: "Mini album spesial akustik dan punk kotor yang direkam live di sebuah studio independen di pinggiran kota.",
      tracklist: [
        "1. Rebel Soul (03:20)",
        "2. Di Bawah Tiang Gantungan (04:12)",
        "3. Kemenangan Sejati (03:30)",
        "4. Sahabat Jiwa (04:05)"
      ],
      links: {
        spotify: "https://open.spotify.com/album/deathroll-rebel-soul",
        appleMusic: "https://music.apple.com/album/deathroll-rebel-soul",
        youtube: "https://youtube.com/watch?v=rebel-soul"
      },
      featured: true
    },
    {
      id: "rel-3",
      slug: "tanah-merdeka",
      title: "Tanah Merdeka",
      releaseDate: "2024-04-10",
      type: "album",
      coverUrl: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=800&auto=format&fit=crop",
      coverAlt: "Tanah Merdeka Full Album Cover",
      description: "Masterpiece yang melambungkan nama DEATHROLL ke ranah panggung musik nasional. Menghasilkan hits abadi 'Laskar Berbisa' dan 'Matahari Senja'.",
      tracklist: [
        "1. Intro: Bara Api (01:10)",
        "2. Laskar Berbisa (03:40)",
        "3. Tanah Merdeka (04:15)",
        "4. Kota Mati (03:25)",
        "5. Rockabilly Riot (03:10)",
        "6. Jabat Erat Tanganku (03:55)"
      ],
      links: {
        spotify: "https://open.spotify.com/album/deathroll-tanah-merdeka",
        appleMusic: "https://music.apple.com/album/deathroll-tanah-merdeka",
        youtube: "https://youtube.com/playlist?list=deathroll-tanah-merdeka"
      },
      featured: true
    },
    {
      id: "rel-4",
      slug: "menolak-lupa-single",
      title: "Menolak Lupa (Single)",
      releaseDate: "2023-11-10",
      type: "single",
      coverUrl: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=800&auto=format&fit=crop",
      coverAlt: "Menolak Lupa Single Vinyl Cover",
      description: "Single penghormatan untuk para pejuang hak asasi manusia dan pahlawan jalanan yang tak kenal lelah.",
      tracklist: [
        "1. Menolak Lupa (03:52)"
      ],
      links: {
        spotify: "https://open.spotify.com/track/deathroll-menolak-lupa",
        youtube: "https://youtube.com/watch?v=menolak-lupa"
      },
      featured: false
    }
  ],
  merchandise: [
    {
      id: "merch-1",
      name: "Distorsi Jiwa Heavyweight Tee 24s",
      category: "tshirt",
      price: 185000,
      formattedPrice: "Rp 185.000",
      imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop",
      badge: "LIMITED DROP 100 PCS",
      orderUrl: "https://wa.me/6281234567890?text=Halo%20Admin%20Deathroll,%20saya%20mau%20order%20Kaos%20Distorsi%20Jiwa",
      inStock: true,
      position: 0
    },
    {
      id: "merch-2",
      name: "Suara Dari Jalanan 12\" Gatefold Vinyl",
      category: "vinyl",
      price: 380000,
      formattedPrice: "Rp 380.000",
      imageUrl: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?q=80&w=800&auto=format&fit=crop",
      badge: "EXCLUSIVE BLOOD RED WAX",
      orderUrl: "https://wa.me/6281234567890?text=Halo%20Admin%20Deathroll,%20saya%20mau%20order%20Vinyl%20Suara%20Dari%20Jalanan",
      inStock: true,
      position: 1
    },
    {
      id: "merch-3",
      name: "Rebel Alliance Heavy Zip Hoodie 330gsm",
      category: "hoodie",
      price: 360000,
      formattedPrice: "Rp 360.000",
      imageUrl: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop",
      badge: "BESTSELLER",
      orderUrl: "https://wa.me/6281234567890?text=Halo%20Admin%20Deathroll,%20saya%20mau%20order%20Hoodie%20Rebel",
      inStock: true,
      position: 2
    },
    {
      id: "merch-4",
      name: "Laskar Berbisa Vintage Trucker Cap",
      category: "accessories",
      price: 135000,
      formattedPrice: "Rp 135.000",
      imageUrl: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800&auto=format&fit=crop",
      badge: "NEW ARRIVAL",
      orderUrl: "https://wa.me/6281234567890?text=Halo%20Admin%20Deathroll,%20saya%20mau%20order%20Topi%20Trucker",
      inStock: true,
      position: 3
    }
  ],
  videos: [
    {
      id: "vid-1",
      title: "DEATHROLL — Pembakar Api Perlawanan (Official Music Video)",
      category: "music_video",
      youtubeId: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      thumbnailUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop",
      duration: "03:45",
      publishedAt: "2026-03-20"
    },
    {
      id: "vid-2",
      title: "LIVE CIRCLE PIT: Bali Sunset Rebel Festival 2025 (Full Multi-cam)",
      category: "live_concert",
      youtubeId: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      thumbnailUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop",
      duration: "08:12",
      publishedAt: "2025-11-15"
    },
    {
      id: "vid-3",
      title: "DI BALIK DISTORSI: Mini Documentary Rekaman Analog Album Ke-5",
      category: "documentary",
      youtubeId: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      thumbnailUrl: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=800&auto=format&fit=crop",
      duration: "14:20",
      publishedAt: "2026-02-10"
    }
  ],
  posts: [
    {
      id: "post-1",
      slug: "distorsi-jiwa-tour-announcement",
      title: "PENGUMUMAN RESMI: DISTORSI JIWA TOUR 2026 RESMI DIMULAI!",
      excerpt: "Setelah dua tahun berada di studio rekaman, DEATHROLL siap mengguncang 14 kota di pulau Jawa dan Bali. Cek kota kamu sekarang!",
      bodyMarkdown: `## KAMI KEMBALI KE JALANAN!

Kawan-kawan sebangsa dan setanah air, penantian telah usai. DEATHROLL secara resmi mengumumkan rangkaian **Distorsi Jiwa Tour 2026** yang akan menjangkau 14 titik di seluruh nusantara.

### Apa yang Baru di Tur 2026?
- Tata panggung bertema *Punk Zine Distortion* dengan tata suara 40.000 Watt.
- Penampilan lagu-lagu baru dari album *Suara Dari Jalanan* untuk pertama kalinya secara live.
- Booth merchandise resmi dengan cetakan terbatas dan sertifikat keaslian.

> "Bukan seberapa keras kamu berteriak, tapi seberapa jujur suara hatimu berpihak pada kebenaran." — *Bagas Rocker*`,
      imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop",
      imageAlt: "Concert crowd roaring and raising hands in punk rock show",
      publishedAt: "2026-10-01T10:00:00+07:00",
      status: "published"
    },
    {
      id: "post-2",
      slug: "dibalik-layar-album-suara-dari-jalanan",
      title: "CATATAN REKAMAN: DI BALIK PROSES KREATIF ALBUM TERBARU",
      excerpt: "Simak kisah emosional di balik penulisan lagu 'Pembakar Api Perlawanan' dan rekaman analog tape selama 40 hari nonstop.",
      bodyMarkdown: `## MEREKAM DENGAN PELUH DAN KEJUJURAN

Album **Suara Dari Jalanan** tidak dirancang di ruang berpendingin udara mewah. Sebagian besar lirik ditulis di emperan bengkel kustom dan kedai kopi pinggir jalan, menyerap langsung denyut nadi keresahan masyarakat.`,
      imageUrl: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1200&auto=format&fit=crop",
      imageAlt: "Audio mixing console in recording studio",
      publishedAt: "2026-09-18T14:30:00+07:00",
      status: "published"
    }
  ],
  biography: {
    heading: "SEJARAH & JIWA PEMBERONTAK DEATHROLL",
    bodyMarkdown: `DEATHROLL lahir dari panasnya aspal jalanan dan dentuman distorsi underground pada tahun 2011. Terinspirasi oleh gelombang melodic punk rock 90-an, rockabilly liar, serta semangat perlawanan sosial khas punk nusantara, trio ini telah menempuh ribuan kilometer panggung dari gigs basement sempit hingga festival stadion puluhan ribu penonton.

Musik DEATHROLL menggabungkan ketukan drum berkecepatan tinggi, riff gitar melodik bertenaga distorsi tebal, dan lirik berbahasa Indonesia yang lantang menyuarakan keadilan sosial, perlawanan terhadap penindasan, persahabatan sejati, dan kecintaan pada tanah air.`,
    imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop",
    imageAlt: "DEATHROLL band members posing with electric guitars and leather jackets",
    members: [
      {
        name: "Bagas 'Thunder' Wicaksono",
        role: "Lead Vocal & Bass Guitar",
        photoUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=600&auto=format&fit=crop"
      },
      {
        name: "Reza 'Wild' Pratama",
        role: "Lead Guitar & Backing Vocal",
        photoUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop"
      },
      {
        name: "Damar 'Machine' Adiputra",
        role: "Drums & Percussion",
        photoUrl: "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?q=80&w=600&auto=format&fit=crop"
      }
    ]
  },
  links: [
    {
      id: "link-1",
      label: "Instagram",
      url: "https://instagram.com/deathrollofficial",
      kind: "instagram",
      position: 0
    },
    {
      id: "link-2",
      label: "Spotify",
      url: "https://open.spotify.com/artist/deathrollofficial",
      kind: "spotify",
      position: 1
    },
    {
      id: "link-3",
      label: "YouTube",
      url: "https://youtube.com/@deathrollofficial",
      kind: "youtube",
      position: 2
    },
    {
      id: "link-4",
      label: "Apple Music",
      url: "https://music.apple.com/artist/deathrollofficial",
      kind: "apple_music",
      position: 3
    },
    {
      id: "link-5",
      label: "Facebook",
      url: "https://facebook.com/deathrollofficial",
      kind: "facebook",
      position: 4
    },
    {
      id: "link-6",
      label: "Official Merch Store",
      url: "#merch-section",
      kind: "merch",
      position: 5
    }
  ],
  contact: {
    email: "management@deathrollofficial.com",
    whatsapp: "+6281234567890",
    bookingPhone: "+6281298765432",
    address: "Markas DEATHROLL Rebel Headquarters, Jl. Distorsi No. 13, Denpasar - Bali, Indonesia"
  }
};
