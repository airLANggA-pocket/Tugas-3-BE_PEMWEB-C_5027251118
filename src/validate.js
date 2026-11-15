// src/validate.js
// Validasi data produk dari request. Aturannya sama dengan validasi di frontend.

export function validateProduct(body) {
  const input = body && typeof body === "object" ? body : {};
  const errors = {};

  const name = typeof input.name === "string" ? input.name.trim() : "";
  if (name === "") {
    errors.name = "Nama produk wajib diisi.";
  } else if (name.length > 60) {
    errors.name = "Nama produk maksimal 60 karakter.";
  }

  // Harga boleh dikirim sebagai angka (5000) atau teks angka ("5000")
  const mentah = input.price;
  const price = typeof mentah === "string" && mentah.trim() !== "" ? Number(mentah) : mentah;

  if (typeof price !== "number" || !Number.isFinite(price) || price <= 0) {
    errors.price = "Harga harus lebih dari 0.";
  } else if (!Number.isSafeInteger(price)) {
    errors.price = "Harga harus berupa bilangan bulat.";
  }

  return { valid: Object.keys(errors).length === 0, errors, data: { name, price } };
}

// Mengubah parameter URL (teks) menjadi ID angka. Mengembalikan null jika bukan bilangan bulat positif.
export function parseId(teks) {
  if (!/^\d+$/.test(String(teks))) return null;
  const id = Number(teks);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}