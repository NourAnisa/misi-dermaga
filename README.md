# Misi Dermaga — Nyalakan Mercusuar

Game web 2D untuk demonstrasi **Pertemuan 6: Studi Properti dan Elemen Game** pada mata kuliah Pengembangan Aplikasi Game. Dibuat untuk Nor Anisa dan mahasiswa; dapat dimainkan dengan keyboard, mouse, atau layar sentuh.

## Memainkan game

Unduh repository melalui **Code → Download ZIP**, ekstrak, lalu buka **index.html**. Tidak memerlukan Node.js, instalasi, login, API key, atau koneksi internet saat bermain. Jangan membuka HTML dari dalam ZIP sebelum mengekstrak seluruh folder.

Untuk akses melalui GitHub Pages, buka **Settings → Pages → Build and deployment**. Pilih **Deploy from a branch**, cabang **main**, folder **/(root)**, lalu **Save**. Setelah deployment selesai, gunakan URL yang ditampilkan GitHub. Alamat yang diharapkan: https://nouranisa.github.io/misi-dermaga/ . Link ini baru aktif setelah Pages diaktifkan.

Panduan resmi: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Cara bermain

| Kontrol | Fungsi |
|---|---|
| WASD / tombol panah | Berjalan |
| E | Interaksi dengan objek terdekat |
| Q / tombol Obat | Memakai obat |
| Klik / sentuh objek | Berjalan mendekat dan berinteraksi dalam mode Bermain |
| P | Jeda / lanjutkan |
| Tombol sentuh | Gerak dan interaksi pada ponsel |
| Mode belajar | Memilih objek dan melihat penjelasannya |

Raka harus menyalakan mercusuar setelah badai. Ambil **kunci**, buka **peti** untuk mendapatkan bahan bakar, buka **pintu jembatan**, isi **generator**, lalu aktifkan **mercusuar**. Peti tidak memerlukan kunci; kunci digunakan oleh pintu.

Kondisi awal 70 HP. Tumpahan oli mengurangi 10 HP per detik ketika diinjak. Tas obat dapat diambil dan digunakan sekali untuk memulihkan hingga 30 HP, maksimum 100. Tidak ada batas waktu; jam hanya mencatat durasi. Waktu dan kondisi berhenti saat jeda, membuka panduan, atau pindah tab. Progres hanya berlaku untuk sesi halaman saat ini dan tidak disimpan setelah refresh.

## Skenario demonstrasi kelas (15–20 menit)

1. **Uji aturan (3 menit).** Coba buka pintu tanpa kunci. Tanyakan mengapa aksi gagal dan properti apa yang menjadi syarat.
2. **Amati perubahan keadaan (5 menit).** Ambil kunci, buka peti dan pintu. Bandingkan visual, inventori, feedback, dan progres sebelum/sesudah.
3. **Amati resource (3 menit).** Injak oli sebentar, ambil tas obat, lalu gunakan Q. Jelaskan resource terbatas, konsumsi, dan konsekuensi.
4. **Bedah properti (4 menit).** Aktifkan Mode belajar. Pilih lampu, radio, bangku, dan generator. Jelaskan bahwa kategori dapat tumpang tindih: lampu interaktif sekaligus dekoratif.
5. **Diskusi (3–5 menit).** Buka tab Elemen dan cocokkan definisi dengan pengalaman bermain. Tanyakan: apa yang berubah jika pintu selalu terbuka atau bahan bakar tidak terbatas?

## Kaitan dengan RPS

Mengacu pada Sub-CPMK 5 pada RPS STI7356 yang disediakan: studi properti dalam merancang game, konsep properti, elemen formal dan dramatis, serta perancangan properti dan elemen game dalam aplikasi digital. Demo ini merupakan contoh pendamping, bukan pengganti tugas studi/sketsa properti dalam bentuk gambar. Jumlah objek dan aturan demo adalah rancangan pembelajaran contoh, bukan ketentuan tambahan dari RPS.

| Objek | Kategori | Peran |
|---|---|---|
| Kunci emas | Fungsional, interaktif, resource | Membuka pintu; sekali pakai |
| Peti | Fungsional, interaktif | Menyediakan bahan bakar sekali |
| Pintu | Fungsional, interaktif | Membatasi akses sebelum memiliki kunci |
| Generator | Fungsional, interaktif | Memakai bahan bakar dan menyediakan listrik |
| Mercusuar | Fungsional, interaktif | Tujuan akhir |
| Radio | Interaktif | Petunjuk dan narasi |
| Tas obat | Fungsional, interaktif, resource | Memulihkan HP |
| Lampu | Interaktif, dekoratif | Dapat diubah; memperkuat suasana |
| Bangku | Dekoratif | Konteks lingkungan; memiliki collision |
| Dua pohon | Dekoratif | Konteks, skala, dan batas fisik |
| Oli | Fungsional | Bahaya lingkungan |

Kategori properti tidak eksklusif. Dekorasi yang memiliki collision juga memiliki dampak pada navigasi meskipun tujuan utamanya visual. Resource menjelaskan sesuatu yang dikelola atau dikonsumsi; tidak semua resource harus berupa objek fisik.

### Elemen formal

- **Players:** satu pemain mengendalikan Raka.
- **Objective:** menyalakan mercusuar.
- **Procedures:** berjalan, mengambil, membuka, mengisi bahan bakar, mengaktifkan.
- **Rules:** pintu perlu kunci; generator perlu bahan bakar; mercusuar perlu listrik.
- **Resources:** HP, kunci, bahan bakar, obat.
- **Conflict:** akses terkunci, listrik mati, bahaya oli.
- **Boundaries:** area dermaga; sungai tidak dapat dilalui.
- **Outcome:** menang saat mercusuar menyala; kalah saat HP nol.

### Elemen dramatis

Premis badai, karakter Raka, tantangan pemulihan penerangan, ruang eksplorasi, dan pesan radio menyatukan aturan dengan pengalaman. Bangku kosong, peti persediaan, dan lampu yang masih menyala dapat dibahas sebagai environmental storytelling. Makna tersebut merupakan interpretasi desain, bukan fakta yang selalu terbaca sama oleh setiap pemain.

## Struktur kode

```text
index.html        Antarmuka permainan dan materi
styles.css        Tampilan responsif
engine.js         Aturan, state, collision, dan pencarian rute
game.js           Canvas, input, feedback, audio, dan mode belajar
assets/atlas.webp Sprite karakter dan properti
tests/engine.test.cjs Pengujian aturan dan keterjangkauan misi
```

Ubah `OBJECTS` di `engine.js` untuk nama, fungsi, kategori, posisi, dan cerita. Ubah `act` untuk aturan interaksi. `LAND` mendefinisikan area berjalan. Hindari mengubah kondisi kemenangan tanpa memperbarui panel materi dan pengujian.

Untuk menjalankan pengujian model gunakan Node.js: `node --test tests/engine.test.cjs`. Node.js hanya untuk pengembangan/pengujian, tidak diperlukan untuk memainkan game.

Sprite dibuat dengan bantuan AI untuk demo ini dan dikompresi menjadi WebP. Seluruh gambar tersedia lokal. Tidak ada layanan analitik atau permintaan ke server pihak ketiga saat permainan berjalan. Browser yang mendukung WebMCP dapat membaca progres melalui tool opsional `inspect_dermaga`; permainan tetap berjalan tanpa dukungan fitur tersebut.
