// src/index.js
// Titik masuk: menyalakan server.

import app from "./app.js";

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});