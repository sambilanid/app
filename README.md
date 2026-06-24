# Sambilan.id

> **Platform Gig Economy & Micro-tasking Lokal**
> Menghubungkan masyarakat yang membutuhkan bantuan tugas harian dengan individu yang mencari penghasilan tambahan secara fleksibel.

---

## Tentang Proyek Ini

Proyek ini adalah aplikasi demo dari layanan marketplace Sambilan.

## Tentang Sambilan

Sambilan adalah **two-sided marketplace** berbasis komunitas lokal yang memformalkan pekerjaan informal sehari-hari — seperti jasa titip, antar barang, hingga bersih-bersih — ke dalam satu ekosistem digital yang aman, terpercaya, dan terorganisir.

Masalah yang diselesaikan Sambilan adalah bahwa selama ini transaksi jasa informal semacam ini tersebar di grup media sosial dan koneksi pribadi, yang memiliki keterbatasan dalam jangkauan, transparansi, dan tingkat kepercayaan antar pihak. Sambilan menjawab kebutuhan itu dengan platform yang didukung AI untuk pencocokan cerdas, penetapan harga wajar, dan moderasi konten otomatis.

**Target pengguna:** Mahasiswa dan masyarakat umum — baik yang membutuhkan efisiensi waktu (pemberi kerja) maupun yang mencari penghasilan tambahan fleksibel (pekerja).

---

## Terminologi

Berikut adalah istilah-istilah kunci yang digunakan di seluruh aplikasi dan basis kode Sambilan:

| Istilah | Definisi |
|---|---|
| **Quest Creator** | Mode pengguna sebagai *pemberi kerja*. Pengguna dalam mode ini membuat dan memposting tugas yang ingin diselesaikan oleh orang lain. |
| **Adventurer** | Mode pengguna sebagai *pencari kerja*. Pengguna dalam mode ini menelusuri dan menerima Quest yang tersedia untuk dikerjakan. |
| **Quest** | Satu unit tugas/pekerjaan yang diposting oleh Quest Creator di platform. Quest memuat judul, deskripsi, lokasi, estimasi waktu, dan besaran imbalan. |
| **Proof of Work (PoW)** | Bukti penyelesaian tugas yang wajib diunggah Adventurer (foto, video, atau dokumen) sebelum pembayaran diproses. |
| **Escrow / Ledger** | Sistem penahanan dana sementara di dalam aplikasi. Dana Quest Creator ditahan saat Quest dibuat, dan baru dicairkan ke Adventurer setelah tugas dikonfirmasi selesai. |
| **Smart & Proximity Matching** | Fitur AI yang secara otomatis memprioritaskan notifikasi Quest kepada Adventurer yang berada di radius lokasi terdekat. |
| **Dynamic Pricing** | Fitur AI yang menganalisis deskripsi tugas (tingkat kesulitan dan jarak) lalu memberikan saran upah yang wajar kepada Quest Creator. |
| **Prompt-Based Job Search** | Fitur AI asisten pencari kerja interaktif, di mana Adventurer cukup mengetik kondisi mereka dalam bahasa natural (contoh: *"Saya punya waktu 2 jam siang ini dan bawa motor"*) dan sistem merekomendasikan Quest yang relevan. |
| **Switch Mode** | Fitur yang memungkinkan satu akun beralih antara mode Quest Creator dan Adventurer tanpa perlu membuat akun terpisah. |
| **Withdrawal** | Fitur penarikan saldo hasil kerja Adventurer ke rekening bank pribadi. Biaya admin transfer ditanggung oleh Adventurer. |
| **Guild Notification** | Push notification yang dikirim ke Adventurer terpilih saat ada Quest baru di dekat lokasi mereka. |
| **Auto-Approve** | Mekanisme sistem: jika Quest Creator tidak memberikan konfirmasi penyelesaian dalam 1×24 jam, sistem secara otomatis menyetujui penyelesaian dan mencairkan dana. |

---

## Fitur Utama

### Fitur Inti (MVP)

1. **Buat Quest** — Quest Creator mengisi detail tugas (judul, deskripsi, lokasi via peta, estimasi waktu, dan imbalan), yang kemudian langsung dimoderasi oleh AI sebelum tayang.

2. **Terima Quest** — Adventurer menelusuri daftar Quest yang tersedia, melihat detail, dan mengambil tugas yang sesuai. Sistem dapat memilih berdasarkan siapa yang klik pertama atau yang memiliki rating tertinggi.

3. **Real-time Chat** — Ruang obrolan langsung antara Quest Creator dan Adventurer terbuka setelah Quest diterima, untuk klarifikasi instruksi selama pengerjaan.

4. **Proof of Work & Konfirmasi** — Adventurer mengunggah bukti penyelesaian melalui kamera in-app (bukan dari galeri, untuk mencegah pemalsuan). Quest Creator meninjau dan menyetujui sebelum pembayaran diproses.

5. **Sistem Escrow (Ledger)** — Dana Quest Creator ditahan otomatis saat Quest dibuat, menjamin kepastian bayaran bagi Adventurer dan keamanan transaksi bagi semua pihak.

6. **Withdrawal** — Adventurer dapat menarik saldo kapan saja ke rekening bank yang terdaftar.

7. **Integrasi Peta & Navigasi** — Quest Creator menandai titik lokasi tugas secara akurat; Adventurer mendapat rute navigasi menuju lokasi tersebut.

8. **Rating & Review** — Setelah transaksi selesai, kedua pihak saling memberi bintang (1–5) dan ulasan singkat. Reputasi Adventurer terakumulasi dan ditampilkan di profil (misalnya badge *Elite/Pro Adventurer*).

### Fitur AI

| Fitur | Fungsi |
|---|---|
| **Dynamic Pricing** | Saran upah otomatis berdasarkan deskripsi tugas |
| **Smart & Proximity Matching** | Pencocokan Adventurer terdekat dan paling relevan |
| **Prompt-Based Job Search** | Pencarian Quest via bahasa natural |
| **AI Content Moderation** | Deteksi kata terlarang dan konten tidak pantas pada deskripsi Quest secara otomatis (berjalan 1–2 detik di background saat Quest diposting) |

---

## Alur Bisnis

Berikut adalah alur lengkap satu siklus transaksi di Sambilan, dari registrasi hingga pencairan dana:

1. **Registrasi & Onboarding** — Pengguna baru mendaftar dan sebelum bisa mengambil atau membuat Quest, pengguna baru wajib menyelesaikan verifikasi identitas (Selfie dengan KTP/KTM) untuk menjaga ekosistem bebas akun palsu.
2. **Pilih Mode** — Pengguna bisa berperan sebagai Quest Creator, atau Adventurer dalam satu akun.
3. **Buat Quest** *(Quest Creator)* — Quest Creator mengisi detail tugas: judul, deskripsi, kategori, lokasi via pinpoint peta, estimasi waktu, dan besaran imbalan, serta informasi-informasi tambahan tergantung kategori.
4. **Moderasi AI** — Saat Quest dikirim, AI secara otomatis memeriksa konten (kata terlarang, indikasi ilegal) dalam 1–2 detik di background sebelum Quest tayang.
5. **Escrow Aktif** — Saldo Quest Creator dipotong sejumlah nilai imbalan dan ditahan oleh sistem. Quest kini berstatus *Live* (aktif) dan dapat dilihat Adventurer.
6. **Guild Notification** *(Adventurer)* — Sistem AI mengirim push notification ke Adventurer yang berada di radius terdekat dari lokasi Quest dan sedang aktif di platform.
7. **Terima Quest** *(Adventurer)* — Adventurer melihat detail Quest dan mengklik "Terima Quest". Jika ada beberapa peminat, sistem memilih berdasarkan siapa yang pertama klik atau yang memiliki rating tertinggi.
8. **Chat Real-time Terbuka** — Fitur chat antara Quest Creator dan Adventurer yang berinteraksi dengan quest (mengajukan permohonan kerja, mengerjakan, dan menyelesaikan) untuk koordinasi teknis selama dan setelah pengerjaan.
9. **Pengerjaan Tugas** *(Adventurer)* — Adventurer menjalankan tugas sesuai instruksi yang ditetapkan Quest Creator.
10. **Upload Proof of Work** *(Adventurer)* — Setelah selesai, Adventurer wajib mengunggah bukti penyelesaian (foto/video) menggunakan kamera in-app untuk mencegah penggunaan foto palsu dari galeri.
11. **Verifikasi & Konfirmasi** *(Quest Creator)* — Quest Creator meninjau Proof of Work dan mengklik "Setujui". Jika tidak ada respons dalam 1×24 jam, sistem melakukan Auto-Approve secara otomatis.
12. **Pencairan Dana** — Dana escrow dilepas: Reward masuk ke saldo Adventurer, Rp3.500 masuk ke kas platform sebagai komisi.
13. **Rating & Review** — Kedua pihak bisa saling memberi penilaian bintang (1–5) dan ulasan singkat. Reputasi Adventurer terakumulasi dan ditampilkan di profil.
14. **Withdrawal** *(Adventurer)* — Adventurer dapat menarik saldo kapan saja ke rekening bank pribadi. Biaya admin transfer ditanggung oleh Adventurer.

---

## Model Bisnis

Sambilan menggunakan model **komisi berbasis transaksi**:

- **Komisi platform:** Rp3.500 dari setiap Quest yang berhasil diselesaikan
- **Contoh:** Quest dengan reward Rp25.000 → Adventurer menerima Rp25.000, platform menerima Rp3.500, dana diambil dari Quest Creator Rp28.500
- **Payment Gateway:** Midtrans (mendukung QRIS, e-wallet, Virtual Account/transfer bank)
- **Biaya Payment Gateway:** ~Rp250/transaksi (ditanggung platform)

## Jenis Layanan

Berikut kategori jasa yang tersedia di platform beserta kisaran harganya:

| Kategori | Range Harga | Keterangan |
|---|---|---|
| Jasa Titip (Jastip) | Rp5.000 – Rp25.000 | Menyesuaikan jarak & kesulitan mendapatkan barang |
| Jasa Antar Jemput | Rp10.000 – Rp50.000 | Menyesuaikan jarak tempuh |
| Jasa Antar & Ambil Barang | Rp10.000 – Rp30.000 | Menyesuaikan jarak & ukuran/berat barang |
| Jasa Angkut | Rp20.000 – Rp100.000 | Menyesuaikan jarak, volume, dan berat |
| Jasa Pindahan | Rp50.000 – Rp300.000 | Menyesuaikan jumlah barang & jarak |
| Jasa Reparasi | Rp20.000 – Rp150.000 | Menyesuaikan tingkat kesulitan & kebutuhan alat |
| Jasa Bersih-Bersih | Rp25.000 – Rp150.000 | Menyesuaikan luas area & durasi |

> Penetapan harga akhir disarankan oleh fitur **Dynamic Pricing AI** berdasarkan deskripsi yang diisi Quest Creator.

---

## Teknologi

### Stack & Infrastruktur

| Komponen | Solusi |
|---|---|
| Platform | Mobile-Web Responsive (APK Android + Web) |
| Hosting | Cloud Hosting (skalabel sesuai pertumbuhan pengguna) |
| Payment Gateway | Midtrans (Escrow, QRIS, e-wallet, Virtual Account) |
| AI Integration | API LLM (dynamic pricing, smart matching, prompt search, content moderation) |
| Peta & Navigasi | Integrasi map digital untuk pinpoint lokasi Quest |
| Keamanan | SSL pada domain utama, verifikasi identitas KTM/wajah |
| UI/UX Design | Figma (Clickable Prototype → MVP) |

### Aset Digital

- Source code aplikasi (Mobile & Web)
- Domain `sambilan.id`
- Basis data pengguna, riwayat Quest, dan data transaksi

---

## Struktur Tim

| Posisi | Nama | Tanggung Jawab |
|---|---|---|
| CEO / Founder | Nashiruddin | Arah strategis, perancangan UI/UX, manajemen tim, pengawasan sistem AI |
| CTO | Reza Kurniawan | Pengembangan backend, integrasi API payment gateway, keamanan server & database |
| CFO | Sari Nur Aini | Cash flow, pembukuan escrow, pelaporan keuangan, audit transaksi harian |
| CMO | Naila Rona Nur Aini | Strategi pemasaran digital (Instagram, TikTok, X), pembuatan aset visual, sosialisasi komunitas |
| COO | Ade Yahya Hendriawan | Operasional harian, implementasi strategi CEO, efisiensi perusahaan |

---

## Kontak & Tautan

| Kanal | Alamat |
|---|---|
| Website | [www.sambilan.id](http://www.sambilan.id) *(dalam pengembangan)* |
| Instagram | [@sambilan.id](https://instagram.com/sambilan.id) |
| Email | halo@sambilan.id |

---

*Sambilan dikembangkan oleh mahasiswa Informatika Fakultas Teknik Universitas Jenderal Soedirman (UNSOED) dalam program Mahasiswa Wirausaha (PMW) 2026, dengan semangat **"Ekonomi Kolaboratif Lokal"**.*

## Stack Teknologi
- **Frontend**: React (TypeScript)
- **Styling**: Tailwind CSS 4.x
- **Icons**: Lucide React
- **Build Tool**: Vite

## Cara Menjalankan
1. Instal dependensi: `npm install`
2. Jalankan mode pengembangan: `npm run dev`
3. Buka browser di `http://localhost:5173`

## Navigasi Demo
Ketuk di mana saja pada layar untuk berpindah antar halaman (Search -> Results -> Detail).
