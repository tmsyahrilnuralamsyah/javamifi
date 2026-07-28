# JAVAMIFI

Javamifi adalah aplikasi web penjualan ebook berbasis Laravel 12, Inertia.js, React, dan Tailwind CSS. Sistem ini dipakai untuk mengelola katalog ebook, transaksi pembelian online via Midtrans, serta area customer untuk melihat buku yang sudah dibeli.

## Gambaran Fitur

### Admin Panel
- Dashboard dengan data real dari database:
  - grafik revenue
  - grafik jumlah pesanan
  - top buku terlaris
  - status breakdown pesanan
- Kelola kategori
- Kelola buku
- Kelola customer
- Monitoring pesanan
- Monitoring pembayaran
- Login admin dengan email/password
- Login Google

### Customer Side
- Landing page langsung menyatu dengan katalog ebook
- Filter buku berdasarkan kategori
- Live search di navbar berdasarkan judul, penulis, dan kategori
- Detail buku publik
- Keranjang berbasis session
- Checkout banyak ebook sekaligus
- Pembayaran online via Midtrans
- Halaman `Buku Saya`
- Halaman `Pesanan Saya`
- Login, register, login Google
- Ubah password melalui modal
- Tombol WhatsApp admin

## Alur Bisnis Singkat

1. Admin membuat kategori dan buku.
2. Buku yang tampil di landing hanya buku `is_published = true` dan kategori `is_active = 1`.
3. Customer menambahkan ebook ke keranjang.
4. Customer checkout dan dibawa ke Midtrans.
5. Setelah pembayaran berhasil, status order dan payment diperbarui.
6. Ebook otomatis masuk ke halaman `Buku Saya`.

## Tech Stack

- PHP `^8.2`
- Laravel `^12.0`
- Inertia.js
- React `^18`
- Tailwind CSS
- Laravel Breeze
- Laravel Socialite
- MySQL

## Clone Project

```bash
git clone https://github.com/tmsyahrilnuralamsyah/javamifi.git
cd javamifi
```

## Install Dependency

```bash
composer install
npm install
```

## Setup Environment

Salin file `.env.example` menjadi `.env`.

Di Windows:

```bash
copy .env.example .env
```

Di macOS/Linux:

```bash
cp .env.example .env
```

Lalu generate app key:

```bash
php artisan key:generate
```

## Konfigurasi `.env`

Minimal sesuaikan bagian berikut:

```env
APP_NAME=javamifi
APP_ENV=local
APP_URL=http://127.0.0.1:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=javamifi
DB_USERNAME=root
DB_PASSWORD=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URL=http://127.0.0.1:8000/auth/google/callback

MIDTRANS_MERCHANT_ID=
MIDTRANS_CLIENT_KEY=
MIDTRANS_SERVER_KEY=
MIDTRANS_IS_PRODUCTION=false
MIDTRANS_MERCHANT_NAME="${APP_NAME}"

WHATSAPP_ADMIN_NUMBER=62895364526171
N8N_PAYMENTS_WEBHOOK_URL=
```

Catatan:
- Gunakan `GOOGLE_REDIRECT_URL`, bukan `GOOGLE_REDIRECT_URI`.
- Untuk local, sebaiknya `APP_URL` disamakan dengan URL yang benar-benar dipakai saat menjalankan aplikasi, misalnya `http://127.0.0.1:8000`.

## Migrasi dan Seeder

```bash
php artisan migrate
php artisan db:seed
```

Seeder default akan membuat admin:
- Email: `admin@javamifi.test`
- Password: `password`

## Storage Link

Cover buku disimpan di storage public, jadi jalankan:

```bash
php artisan storage:link
```

## Menjalankan Aplikasi

Jalankan dua terminal.

Terminal 1:

```bash
php artisan serve
```

Terminal 2:

```bash
npm run dev
```

Lalu buka:

```text
http://127.0.0.1:8000
```

## Setup Login Google

Isi `.env`:

```env
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URL=http://127.0.0.1:8000/auth/google/callback
```

Di Google Cloud Console:
- Authorized JavaScript origins:
  - `http://127.0.0.1:8000`
- Authorized redirect URIs:
  - `http://127.0.0.1:8000/auth/google/callback`

Setelah ubah `.env`, jalankan:

```bash
php artisan config:clear
```

## Setup Midtrans

Isi kredensial Midtrans di `.env`:

```env
MIDTRANS_MERCHANT_ID=
MIDTRANS_CLIENT_KEY=
MIDTRANS_SERVER_KEY=
MIDTRANS_IS_PRODUCTION=false
```

Endpoint notification yang dipakai aplikasi ini:

```text
/payments/midtrans/notification
```

## Setup n8n ke Google Sheet

Jika ingin setiap pembayaran sukses otomatis masuk ke Google Sheet melalui n8n, isi juga `.env`:

```env
N8N_PAYMENTS_WEBHOOK_URL=https://your-subdomain.app.n8n.cloud/webhook/your-production-path
```

Alur integrasi:
- Laravel hanya mengirim data pembayaran yang sudah sukses
- Trigger dipanggil dari proses sinkron status Midtrans
- n8n menerima payload lalu append row ke Google Sheet
- Aplikasi menyimpan `exported_to_sheet_at` agar satu payment tidak terkirim dua kali

Payload yang dikirim ke n8n:
- `paid_at`
- `payment_number`
- `order_number`
- `customer_name`
- `customer_email`
- `gross_amount`
- `payment_type`
- `transaction_status`

## Route Penting

### Public / Customer
- `/`
- `/books/{slug}`
- `/cart`
- `/checkout`
- `/my-books`
- `/my-orders`
- `/my-orders/{order}`
- `/payments/midtrans/notification`

### Admin
- `/dashboard`
- `/admin/categories`
- `/admin/books`
- `/admin/orders`
- `/admin/payments`
- `/admin/customers`

## Struktur Data Singkat

Tabel inti yang dipakai:
- `users`
- `categories`
- `books`
- `orders`
- `order_items`
- `payments`
- `user_books`

## Akun Admin Default

```text
Email    : admin@javamifi.test
Password : password
```
