# Tugas-3-BE_PEMWEB-C_5027251118

# Tugas 3 - Backend Manajemen Produk

REST API untuk Manajemen Produk, dibuat dengan Express. Data disimpan ke file `data/products.json`
(dibuat otomatis saat server pertama kali menyala), jadi data tetap ada setelah server restart.

## Menjalankan

```bash
npm install
npm run dev
```

Server berjalan di http://localhost:4000 (ubah dengan variabel lingkungan `PORT`).
Untuk mengembalikan data awal: hentikan server, hapus `data/products.json`, lalu jalankan lagi.

## Endpoint

| Method | URL | Keterangan | Status sukses |
|---|---|---|---|
| GET | `/health` | Cek server | 200 |
| GET | `/api/products` | Daftar produk. Opsional `?search=kata` | 200 |
| GET | `/api/products/:id` | Detail produk | 200 |
| POST | `/api/products` | Tambah produk | 201 |
| PUT | `/api/products/:id` | Ubah produk | 200 |
| DELETE | `/api/products/:id` | Hapus produk | 200 |

Body untuk POST dan PUT:

```json
{ "name": "Pulpen", "price": 5000 }
```

Aturan validasi: `name` wajib diisi (maksimal 60 karakter), `price` harus bilangan bulat lebih dari 0.

## Format response

```json
{ "status": true, "message": "Berhasil mengambil data produk", "data": [] }
```

Jika gagal: `status` bernilai `false`. Validasi yang gagal (400) juga menyertakan `errors` per field.

| Kode | Arti |
|---|---|
| 400 | Data tidak valid, ID bukan angka, atau JSON rusak |
| 404 | Produk atau rute tidak ditemukan |
| 500 | Kesalahan server |

## Struktur

```
src/
├── index.js                  # menyalakan server
├── app.js                    # middleware, route, 404, error handler
├── routes/products.js        # method + URL -> controller
├── controllers/products.js   # logika tiap endpoint
├── validate.js               # validasi nama dan harga
└── store.js                  # penyimpanan data (file JSON)
```