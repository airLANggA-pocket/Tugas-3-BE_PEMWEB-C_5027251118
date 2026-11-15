// src/app.js
// Menyusun aplikasi Express: middleware, route, 404, dan penanganan error.

import cors from "cors";
import express from "express";
import productRoutes from "./routes/products.js";

const app = express();

app.use(cors()); // mengizinkan frontend (localhost:5173) memanggil API ini
app.use(express.json());

// Logger sederhana: METHOD /url status
app.use((req, res, next) => {
  res.on("finish", () => console.log(`${req.method} ${req.originalUrl} ${res.statusCode}`));
  next();
});

app.get("/health", (req, res) => {
  res.json({ status: true, message: "Server OK" });
});

app.use("/api/products", productRoutes);

// URL yang tidak dikenal
app.use((req, res) => {
  res.status(404).json({
    status: false,
    message: `Rute ${req.method} ${req.originalUrl} tidak ditemukan.`,
  });
});

// Penanganan error (harus punya 4 parameter agar dikenali Express)
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ status: false, message: "Body request bukan JSON yang valid." });
  }
  console.error(err);
  res.status(500).json({ status: false, message: "Terjadi kesalahan pada server." });
});

export default app;