# Washe — Frontend

Aplikasi web (React 19 + TypeScript + Vite + Tailwind v4) untuk platform laundry
**Washe**. Frontend ini mengonsumsi API Laravel di folder `../backend`.

## Menjalankan

```bash
# 1. Jalankan backend
cd ../backend && php artisan serve        # http://localhost:8000

# 2. Siapkan env frontend (opsional, default sudah http://localhost:8000)
cp .env.example .env.local

# 3. Jalankan dev server
npm install
npm run dev                                # http://localhost:5173
```

Proxy Vite meneruskan `/api` dan `/storage` ke `VITE_BACKEND_URL`.

Perintah lain: `npm run build` (type-check + build), `npm run lint` (oxlint),
`npm run preview`.

## Alur Booking (sesuai BRD)

1. Pengunjung menjelajah halaman **publik** (beranda, layanan, cabang, promo, blog, tentang, kontak).
2. Untuk **membuat booking, pengguna WAJIB login**. Tombol booking mengarah ke
   `/login?redirect=/dashboard/booking/new`. Setelah login, pengguna dikembalikan ke form booking.
3. Di form booking: pilih cabang → layanan → voucher (opsional) → isi detail penjemputan & jadwal.
4. Submit memanggil `POST /api/customer/bookings` sehingga booking **tersimpan di backend**.
5. Setelah tersimpan, ditampilkan modal sukses dengan tombol **deeplink ke WhatsApp cabang**
   (`https://wa.me/<nomor>?text=...`) berisi rangkuman booking, dan booking muncul di dashboard.

## Struktur

```
src/
  api/          klien axios + modul endpoint (auth, public, customer)
  components/   komponen UI (common, booking)
  context/      AuthProvider, SettingsProvider
  hooks/        useAsync, useDocumentTitle
  layouts/      PublicLayout, MemberLayout
  lib/          tipe data, format, helper WhatsApp, status booking
  pages/
    public/     halaman publik
    auth/       login & register
    member/     dashboard anggota (booking, loyalitas, voucher, alamat, profil)
```

## Rute

**Publik:** `/`, `/layanan`, `/store`, `/store/:id`, `/promo`, `/blog`, `/blog/:slug`,
`/tentang`, `/kontak`, `/p/:slug`, `*`

**Auth:** `/login`, `/register`

**Member (butuh login):** `/dashboard`, `/dashboard/bookings`, `/dashboard/bookings/:id`,
`/dashboard/booking/new`, `/dashboard/loyalty`, `/dashboard/vouchers`, `/dashboard/address`,
`/dashboard/profile`

## Akun demo

| Email                | Password | Peran   |
| -------------------- | -------- | ------- |
| customer@washe.test  | password | Customer|
| admin@washe.test     | password | Admin   |
| root@washe.test      | password | Root    |
