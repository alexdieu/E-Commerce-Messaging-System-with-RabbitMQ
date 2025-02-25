const express = require("express");
const path = require("path");
const app = express();

// Middleware para procesar JSON
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Importar las rutas del productor
const producerRoutes = require("./producer-server");
app.use(producerRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "producer.html"));
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Producer server running on http://localhost:${PORT}`);
});
