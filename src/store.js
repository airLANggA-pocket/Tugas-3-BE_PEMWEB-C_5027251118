// src/store.js
// Penyimpanan data produk. Data dimuat ke memori saat server menyala dan
// setiap perubahan ditulis ke file JSON, jadi data tidak hilang saat server restart.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DIR_DATA = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "data");
const FILE_DATA = process.env.DATA_FILE ?? path.join(DIR_DATA, "products.json");

// Data awal, dipakai saat file data belum ada atau rusak
function dataAwal() {
  return {
    nextId: 6,
    products: [
      { id: 1, name: "Pulpen", price: 5000 },
      { id: 2, name: "Buku Tulis", price: 12000 },
      { id: 3, name: "Spidol", price: 8000 },
      { id: 4, name: "Penggaris", price: 6000 },
      { id: 5, name: "Penghapus", price: 3000 },
    ],
  };
}

function simpan() {
  fs.mkdirSync(path.dirname(FILE_DATA), { recursive: true });
  const sementara = FILE_DATA + ".tmp";
  fs.writeFileSync(sementara, JSON.stringify(db, null, 2));
  fs.renameSync(sementara, FILE_DATA); // ganti file lama sekaligus agar tidak setengah tertulis
}

function muat() {
  try {
    const isi = JSON.parse(fs.readFileSync(FILE_DATA, "utf8"));
    if (Array.isArray(isi.products) && Number.isInteger(isi.nextId)) return isi;
  } catch {
    // file belum ada atau bukan JSON yang valid: pakai data awal
  }
  return dataAwal();
}

let db = muat();
simpan();

export function getAll() {
  return db.products;
}

export function getById(id) {
  return db.products.find((p) => p.id === id);
}

export function create({ name, price }) {
  const produk = { id: db.nextId++, name, price }; // ID tidak pernah dipakai ulang
  db.products.push(produk);
  simpan();
  return produk;
}

export function update(id, { name, price }) {
  const produk = getById(id);
  if (!produk) return undefined;
  produk.name = name;
  produk.price = price;
  simpan();
  return produk;
}

export function remove(id) {
  const posisi = db.products.findIndex((p) => p.id === id);
  if (posisi === -1) return undefined;
  const [dihapus] = db.products.splice(posisi, 1);
  simpan();
  return dihapus;
}

// Mengembalikan data ke kondisi awal (berguna saat demo atau pengujian)
export function reset() {
  db = dataAwal();
  simpan();
}