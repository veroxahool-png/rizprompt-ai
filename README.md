# RIZPROMPT AI — Prompt Studio

Aplikasi prompt studio multi-file berbasis HTML, CSS, dan JavaScript. Generator, analyzer dasar, template, riwayat, favorit, autosave, serta ekspor TXT/JSON dapat berjalan tanpa API.

## Cara menjalankan (lokal)

### Pilihan A — buka langsung
Buka `index.html` melalui browser. Fitur lokal akan berjalan; sebagian kemampuan clipboard bergantung pada browser.

### Pilihan B — jalankan server lokal (direkomendasikan)
Persyaratan: Node.js 18 atau lebih baru.

```bash
npm start
```

Kemudian buka `http://localhost:8787` di browser. Untuk pengembangan, file frontend ada di `index.html`, `css/styles.css`, dan `js/app.js`.

### Di Android menggunakan Termux
Ekstrak ZIP ke folder yang mudah ditemukan, buka folder proyek di Termux, lalu:

```bash
pkg update
pkg install nodejs unzip
cd rizprompt-ai
npm start
```

Buka `http://localhost:8787` di browser Android. Jika hanya ingin mencoba fitur lokal, kamu juga dapat membuka `index.html` langsung lewat browser/file manager.

## Fitur

- Prompt Generator untuk Seedance 2.0, Seedance 2.0 Fast, dan Seedance 2.0 Mini.
- Bahasa output Indonesia atau Inggris; tingkat detail ringkas, detail, dan sangat detail.
- Pengaturan durasi, rasio aspek, gaya visual, kamera, pencahayaan, tempo, dialog, dan negative prompt.
- Pemetaan referensi karakter seperti `Model 1 (@image1)` dan konsistensi lintas adegan.
- Output berupa satu prompt gabungan.
- SeePrompt Analyzer berbasis aturan, optimasi lokal, serta AI enhance opsional.
- Template, riwayat, favorit, draft autosave, pencarian, ekspor TXT, JSON, dan backup.
- Data tersimpan di browser menggunakan `localStorage`.

## AI enhance opsional (amankan API key)

Frontend tidak menerima atau menyimpan API secret. Contoh `server.js` menyediakan endpoint `/api/enhance`; isi API key hanya pada environment server.

Linux/macOS:

```bash
export OPENAI_API_KEY="isi_api_key_di_terminal"
export OPENAI_MODEL="gpt-4o-mini"
npm start
```

PowerShell Windows:

```powershell
$env:OPENAI_API_KEY="isi_api_key_di_terminal"
$env:OPENAI_MODEL="gpt-4o-mini"
npm start
```

Opsional, untuk provider yang kompatibel dengan format Chat Completions:

```bash
export OPENAI_API_URL="https://api.openai.com/v1/chat/completions"
```

Biarkan nilai default untuk OpenAI. Jika memakai penyedia lain, periksa endpoint, model, dan syarat layanan penyedia terlebih dahulu. Setelah server berjalan, masuk ke **Pengaturan**, aktifkan **Izinkan AI enhance**, lalu uji koneksi. Tombol *AI enhance* di SeePrompt Analyzer akan mengirim teks prompt ke backend/provider yang dikonfigurasi.

**Penting:** Jangan pernah menaruh API key rahasia di `index.html`, `app.js`, atau repo publik. API usage dapat menimbulkan biaya. Backend contoh ini ditujukan untuk penggunaan pribadi/lokal; sebelum dibuka ke internet, tambahkan autentikasi, pembatasan request, TLS, dan proteksi abuse.

## Catatan

Pemilih Seedance di aplikasi ini hanya mengatur susunan instruksi prompt. Aplikasi tidak terhubung ke layanan generasi video Seedance dan tidak menghasilkan file video. Pastikan Anda memeriksa hasil prompt sebelum menggunakannya pada platform video AI.
