const express = require("express");
const path = require("path");
const app = express();
const http = require("http").createServer(app);
const io = require("./socket-server");

io.attach(http);

// Middleware para procesar JSON
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Importar las rutas del productor
const producerRoutes = require("./producer-server");
app.use(producerRoutes);

app.get("/producer", (req, res) => {
  res.sendFile(path.join(__dirname, "producer.html"));
});

app.get("/consumer", (req, res) => {
  res.sendFile(path.join(__dirname, "consumer.html"));
});

const PORT = 3000;
http.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
