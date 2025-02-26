require("dotenv").config()
const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const http = require('http')
const { Server } = require("socket.io");
const app = express()
const { connectToDatabase, disconnectFromDatabase } = require('./db')
const { router } = require('./api/routes')

connectToDatabase()

const start = async () => {
  try {
    app.use(cors()).use(morgan("dev")).use(express.json());

    app
      .get("/", (req, res) => res.send("Welcome to EventSync API with MONGO"))
      .use("/api", router);

    // Creamos el servidor HTTP con Express
    const server = http.createServer(app);
    // Inicializamos Socket.io sobre el servidor HTTP
    const io = new Server(server, { cors: { origin: "*" } });

    io.on("connection", (socket) => {
      console.log(`Socket connected: ${socket.id}`);

      socket.on("register", (userId) => {
        socket.join(userId);
        console.log(`Socket ${socket.id} se unió a la sala: ${userId}`);
      });

      socket.on("disconnect", () => {
        console.log(`Socket disconnected: ${socket.id}`);
      });
    });

    const PORT = process.env.EXPRESS_PORT || 2222;
    server.listen(PORT, () => {
      console.info(`Mongo API running on port ${PORT}`);
    });
    console.info(
      `Mongo API and Socket.io running on port ${process.env.EXPRESS_PORT}`
    );
  } catch (err) {
    throw new Error(`Cannot start mongo on port ${process.env.EXPRESS_PORT}, ${err}`)
  }
}

start()
