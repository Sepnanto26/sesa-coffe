# ☕ SESA Coffee - Digital Menu & Real-time POS System

Website profil, menu interaktif, dan sistem pemesanan digital untuk **SESA Coffee PIK 2**. Proyek ini dirancang untuk memberikan pengalaman pemesanan yang mulus bagi pelanggan dan pusat kendali yang efisien bagi Admin.

## 🚀 Fitur Utama

### 📱 Sisi Pelanggan (User)
- **Modern Landing Page:** Profil SESA Coffee dengan visual estetik dan ambiance PIK 2.
- **Interactive Menu:** Filter kategori (Espresso, Milk Based, Indo Food, Cocktail) dengan animasi halus.
- **Product Detail:** Spesifikasi mendalam untuk setiap menu (bahan & cara penyajian).
- **Digital Ordering:** Sistem keranjang belanja (Cart) yang tersimpan di browser.
- **Multi-Payment:** Simulasi pembayaran via QRIS, Transfer BCA, dan Bayar di Kasir.
- **Real-time Stock Sync:** Menu otomatis bertanda **SOLD OUT** jika stok dimatikan oleh admin.

### 🛠️ Sisi Admin (Command Center)
- **Live Dashboard:** Notifikasi suara (Ping!) dan update otomatis setiap ada pesanan masuk.
- **Sales Analytics:** Statistik jumlah pesanan, total pendapatan, dan meja terisi secara real-time.
- **Order Management:** Fitur "Selesaikan Pesanan" untuk memproses antrian.
- **Sales History:** Riwayat transaksi yang sudah selesai tersimpan secara permanen.
- **Inventory Control:** Tombol on/off stok menu yang terhubung langsung ke halaman pelanggan.

## 🛠️ Teknologi yang Digunakan
- **Frontend:** Vanilla HTML5, CSS3 (Modern Flexbox & Grid), JavaScript (ES6+).
- **Backend/Database:** Google Firebase Realtime Database.
- **Icons & Fonts:** FontAwesome 6, Google Fonts (Playfair Display & Poppins).

## ⚙️ Cara Instalasi
1. Clone repository ini.
2. Pastikan file `order.html`, `admin.html`, dan `menu.html` sudah dikonfigurasi dengan **Firebase Config** milik Anda.
3. Buka menggunakan **Live Server** di VS Code.

## 🔒 Catatan Keamanan Admin
Untuk keamanan, halaman dashboard admin (`admin.html`) disarankan untuk:
- Diubah namanya menjadi file yang sulit ditebak (misal: `secret-admin-pos.html`).
- Menambahkan sistem password pada bagian JavaScript sebelum mengakses data.

---
© 2025 SESA Coffee PIK 2. Jakarta Utara.