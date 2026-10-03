# DEATHROLL — Band Profile & In-Place Lightweight CMS

Official band website for **DEATHROLL** (Indonesian Punk Rock Band) with a high-contrast punk-zine aesthetic, full responsiveness, audio track synth preview, and an in-place live CMS editor.

---

## ⚡ Fitur Utama

- **Identitas Band & Punk-Zine Aesthetic:**
  - Nuansa gelap bertenaga (`#0b0b0b`, `#171717`, `#d71920` crimson red accent), font tebal `Impact`/`Oswald`, tape badge stickers, dan kontras tinggi.
- **Pengalaman Pengunjung (Viewer):**
  - **Hero Slider:** Promosi tur dan album dengan transisi mulus dan CTA.
  - **Jadwal Tur & Gigs (`/tour` & `/tour/:slug`):** Filter acara mendatang/selesai, venue, status (Terjadwal, Sold Out, Batal), tiket online.
  - **Diskografi & Rilisan (`/discography` & `/discography/:slug`):** Cover album rasio 1:1, tracklist lengkap, tautan streaming (Spotify, Apple Music, YouTube).
  - **Berita & Zine Dispatches (`/news` & `/news/:slug`):** Artikel berita dengan markdown reader aman.
  - **Biografi & Personil (`/biography`):** Sejarah band, formasi musisi dengan foto/instrumen, dan timeline perjalanan.
  - **Audio Player Bar Interaktif:** Pemutar lagu bawaan Web Audio Synthesizer sehingga pengunjung dapat merasakan vibe punk rock saat berselancar.
  - **Booking & Kontak:** Direct WhatsApp button, email manajemen, dan peta markas.
- **In-Place Live Admin CMS:**
  - **Trigger Tersembunyi:** Tombol "Admin access" kecil dan aksesibel di footer.
  - **Setup Satu Kali:** Inisialisasi token master admin yang di-hash dengan aman di server.
  - **Sticky Admin Toolbar:** Navigasi cepat editor per bagian, status draft ("Unsaved Changes"), preview mode pengunjung, tombol simpan permanen, dan logout.
  - **Section Drawer Editor:** Form terstruktur per komponen dengan CRUD item, reorder posisi (Naik/Turun), toggle terbit/draft, dan editor Markdown interaktif dengan live preview.
  - **Penyimpanan Permanen Atomik:** Disimpan ke basis data SQLite dengan pencegahan konflik revisi (HTTP 409 Conflict Protection).

---

## 🚀 Cara Menjalankan

### 1. Mode Pengembangan (Development)

Jalankan perintah berikut:

```bash
npm run dev
```

Server API dan web akan aktif di `http://localhost:3001` (dengan vite build / proxy dev server di `http://localhost:5173` jika memakai Vite client terpisah).

### 2. Mode Produksi (Production)

```bash
# Build frontend client
npm run build

# Jalankan server
npm start
```

Kunjungi `http://localhost:3001` di browser Anda.

### 3. Menjalankan Pengujian Sistem (Automated Tests)

```bash
npm test
```

---

## 🔐 Panduan Akses Admin Pertama Kali

1. Buka website di browser (`http://localhost:3001`).
2. Gulir ke bagian paling bawah halaman (Footer).
3. Klik tombol kecil **"Admin access"** dengan ikon gembok di kanan bawah.
4. Masukkan token admin baru (minimal 6 karakter) dan konfirmasi token.
5. Setelah terverifikasi, **Admin Toolbar** akan muncul di bagian paling atas halaman.
6. Anda dapat langsung mengedit teks, menambah jadwal tur, merilis album baru, atau menulis berita.
7. Tekan **"Simpan Perubahan"** untuk menyimpan draft ke database SQLite.

---

## 🗄️ Database & Backup

- File SQLite disimpan di direktori `data/deathroll.sqlite`.
- Untuk melakukan backup, cukup salin file `data/deathroll.sqlite` ke lokasi penyimpanan yang aman.
