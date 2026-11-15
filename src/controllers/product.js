// src/controllers/products.js
// Logika setiap endpoint /api/products.
// Semua response memakai bentuk { status, message, data }.

import * as store from "../store.js";
import { parseId, validateProduct } from "../validate.js";

function kirim(res, kode, message, data, errors) {
  const body = { status: kode < 400, message };
  if (data !== undefined) body.data = data;
  if (errors) body.errors = errors;
  return res.status(kode).json(body);
}

// GET /api/products?search=pen
export function listProducts(req, res) {
  const kataKunci = String(req.query.search ?? "").trim().toLowerCase();
  const hasil = store
    .getAll()
    .filter((p) => p.name.toLowerCase().includes(kataKunci));
  return kirim(res, 200, "Berhasil mengambil data produk", hasil);
}

// GET /api/products/:id
export function getProduct(req, res) {
  const id = parseId(req.params.id);
  if (id === null) return kirim(res, 400, "ID produk tidak valid.");

  const produk = store.getById(id);
  if (!produk) return kirim(res, 404, `Produk dengan ID ${id} tidak ditemukan.`);

  return kirim(res, 200, "Berhasil mengambil detail produk", produk);
}

// POST /api/products
export function createProduct(req, res) {
  const { valid, errors, data } = validateProduct(req.body);
  if (!valid) return kirim(res, 400, "Data produk tidak valid.", undefined, errors);

  const baru = store.create(data);
  return kirim(res, 201, "Produk berhasil ditambahkan", baru);
}

// PUT /api/products/:id
export function updateProduct(req, res) {
  const id = parseId(req.params.id);
  if (id === null) return kirim(res, 400, "ID produk tidak valid.");

  if (!store.getById(id)) return kirim(res, 404, `Produk dengan ID ${id} tidak ditemukan.`);

  const { valid, errors, data } = validateProduct(req.body);
  if (!valid) return kirim(res, 400, "Data produk tidak valid.", undefined, errors);

  const diperbarui = store.update(id, data);
  return kirim(res, 200, "Produk berhasil diperbarui", diperbarui);
}

// DELETE /api/products/:id
export function deleteProduct(req, res) {
  const id = parseId(req.params.id);
  if (id === null) return kirim(res, 400, "ID produk tidak valid.");

  const dihapus = store.remove(id);
  if (!dihapus) return kirim(res, 404, `Produk dengan ID ${id} tidak ditemukan.`);

  return kirim(res, 200, "Produk berhasil dihapus", dihapus);
}