# JAVAMIFI

Javamifi adalah aplikasi web untuk penjualan ebook. Proyek ini dibangun menggunakan Laravel + Inertia (React) + Tailwind.

## Fitur

### Admin Panel
- Dashboard (ringkasan angka + grafik revenue 7 hari/1 bulan/3 bulan, grafik jumlah pesanan 7 hari/1 bulan/3 bulan, top buku terlaris, dan pie chart status breakdown)
- Master Data
  - Kategori (CRUD + status aktif/nonaktif)
  - Buku (CRUD + soft delete, upload cover ke storage, drive link, harga normal & diskon)
- Transaksi
  - Pesanan (list, search, sort, pagination, per_page)
  - Pembayaran (list, search, sort, pagination, per_page)
- Pengguna
  - Customer (CRUD, search, sort, pagination, per_page)

### Customer Area
Bagian customer akan berisi:
- Katalog buku
- Detail buku
- Checkout (bisa banyak buku)
- Pembayaran (Midtrans)
- Buku Saya (menampilkan drive link setelah pembayaran sukses)
- Ubah password
- Login Google

## Tech Stack
- PHP ^8.2
- Laravel ^12
- Inertia.js (React)
- Tailwind CSS
- Laravel Breeze (auth starter)
- Laravel Socialite (login Google)
- MySQL (atau DB lain sesuai konfigurasi `.env`)

## Cara Menjalankan (dari Clone)

### 1) Clone Project

```bash
git clone https://github.com/tmsyahrilnuralamsyah/javamifi.git
cd javamifi
```

### 2) Install Dependency

```bash
composer install
npm install
```

### 3) Setup Environment

Copy file environment:

```bash
copy .env.example .env
```

Atur koneksi database di `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=javamifi
DB_USERNAME=root
DB_PASSWORD=
```

Generate app key:

```bash
php artisan key:generate
```

### 4) Migrasi + Seeder

```bash
php artisan migrate
php artisan db:seed
```

Seeder admin default:
- Email: `admin@javamifi.test`
- Password: `password`

### 5) Storage Link (untuk Cover Buku)

```bash
php artisan storage:link
```

### 6) Jalankan Aplikasi

Jalankan 2 terminal:

Terminal 1:

```bash
php artisan serve
```

Terminal 2:

```bash
npm run dev
```

Akses:
- http://127.0.0.1:8000

Login admin:
- http://127.0.0.1:8000/login

## Setup Login Google (Socialite)

Isi `.env`:

```env
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback
```

Pastikan di Google Cloud Console:
- Authorized JavaScript origins:
  - `http://localhost:8000`
- Authorized redirect URIs:
  - `http://localhost:8000/auth/google/callback`

Jika perubahan `.env` tidak terbaca:

```bash
php artisan config:clear
```

## Struktur Route Admin
- Dashboard: `/dashboard`
- Kategori: `/admin/categories`
- Buku: `/admin/books`
- Pesanan: `/admin/orders`
- Pembayaran: `/admin/payments`
- Customer: `/admin/customers`
