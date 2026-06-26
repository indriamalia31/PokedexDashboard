# Pokédex Dashboard - REST API Consumer Mobile App

[cite_start]Aplikasi mobile berbasis React Native (Expo) untuk memenuhi **Misi 11 - Build Your Own API App**[cite: 1, 2]. [cite_start]Aplikasi ini mengonsumsi REST API publik secara dinamis lengkap dengan manajemen state UI terstandarisasi[cite: 3, 29].

## 🚀 Tech Stack
* [cite_start]**Framework:** React Native (Expo Ecosystem) [cite: 9]
* **Language:** JavaScript (ES6+)
* [cite_start]**API Endpoint:** PokeAPI (`https://pokeapi.co/api/v2/pokemon`) [cite: 21]
* [cite_start]**State Management:** React Hooks (`useState`, `useEffect`) [cite: 28]

---

## ✨ Fitur Aplikasi (Rubrik Penilaian OBE)

Berikut adalah checklist implementasi fitur yang berhasil dikembangkan di dalam aplikasi:

### 🟢 Level 1 — Fitur Wajib (Core)
* [cite_start][x] **Asynchronous Fetching:** Menggunakan arsitektur `async/await` dengan struktur kontrol `try-catch-finally` untuk memastikan siklus data aman[cite: 27, 30].
* [cite_start][x] **Lifecycle-bound Trigger:** Memanfaatkan `useEffect` dengan dependency array kosong `[]` untuk memicu request data saat *on-mount*[cite: 28].
* [cite_start][x] **3-State UI Management:** Antarmuka responsif yang menangani kondisi *Loading* (ActivityIndicator), *Error Screen* (dengan fallback pesan), dan *Success Screen*[cite: 29].
* [cite_start][x] **Performant Rendering:** List diimplementasikan via komponen komposit `FlatList` lengkap dengan optimasi `keyExtractor`[cite: 31].
* [cite_start][x] **Data Card Rich Fields:** Kartu data Pokémon menampilkan lebih dari 3 field informasi (ID, Nama, Gambar Resmi, dan Tipe Utama)[cite: 32].
* [cite_start][x] **Fungsionalitas Retry:** Menyediakan tombol re-fetch interaktif pada state error untuk memanggil kembali fungsi request[cite: 29, 33].

### 🟡 Level 2 — Fitur Pengembangan (Full Integration)
* [cite_start][x] **Pull-to-Refresh:** Sinkronisasi ulang data instan dengan menarik layar ke bawah via komponen `RefreshControl`[cite: 36, 37].
* [cite_start][x] **Client-side Search & Filtering:** Menyediakan input `TextInput` dinamis untuk memfilter entitas Pokémon secara real-time berdasarkan pencarian teks nama[cite: 38, 39].
* [cite_start][x] **Layar Detail (Modal Screen):** Mekanisme interaksi ketuk (*tap*) pada kartu untuk memicu kemunculan modal detail berisi spek (tinggi, berat, kemampuan, dan stat dasar)[cite: 40, 41].
* [cite_start][x] **Filter Kategori (Quick Chips):** Akses filter cepat menggunakan baris horizontal kategori tipe Pokémon[cite: 42, 43].
* [cite_start][x] **Toggle Fetch/Axios Simulation:** Tombol *switch state* untuk mendemonstrasikan fleksibilitas logika integrasi HTTP Client[cite: 44, 45].
* [cite_start][x] **Empty State UI:** Layout antarmuka alternatif yang ramah pengguna apabila hasil query pencarian tidak ditemukan di dalam sistem lokal[cite: 46, 47].

---

## 🆚 Analisis Implementasi Engine Data Fetching (Fetch vs Axios)
[cite_start]Aplikasi ini diintegrasikan dengan dua pendekatan manipulasi HTTP Request[cite: 44]:
1. **Native Fetch API:** Menggunakan engine bawaan runtime environment. [cite_start]Membutuhkan dua tahap pemrosesan data (memanggil `.json()` secara manual) dan penanganan HTTP status error (seperti 4xx/5xx) yang harus divalidasi manual lewat properti `response.ok`[cite: 27].
2. **Axios Client Approach (Simulated Object Parsing):** Otomatis melakukan parsing JSON ke dalam objek data wrapper `.data`. [cite_start]Selain itu, memiliki keunggulan interseptor request/response serta otomatis melempar (*throw*) error jika status HTTP berada di luar rentang 2xx[cite: 27].

---

## 📱 Dokumentasi State UI (Screenshot dari HP Fisik)
[cite_start]*(Silakan ganti nama file gambar di bawah ini dengan file screenshot asli dari HP kamu yang ditaruh di folder project sebelum melakukan push)* [cite: 56, 61]

1. [cite_start]**Loading State:** ![Loading State](https://github.com/indriamalia31/PokedexDashboard/blob/main/assets/Loading.jpeg) [cite: 61]
2. [cite_start]**Success State:** ![Success State](https://github.com/indriamalia31/PokedexDashboard/blob/main/assets/success.jpeg) [cite: 61]
3. [cite_start]**Error State:** ![Error State](https://github.com/indriamalia31/PokedexDashboard/blob/main/assets/Error.jpeg) [cite: 61]

---

## [cite_start]💻 Panduan Menjalankan Project (Setup Instructions) [cite: 62]

Ikuti langkah-langkah berikut untuk menjalankan project di perangkat lokal Anda:

1. **Clone Repository:**
   ```bash
   git clone [https://snack.expo.dev/@indriamalia31/328249)
   cd PokedexDashboard
