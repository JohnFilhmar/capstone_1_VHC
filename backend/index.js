const https = require("https");
const { Server } = require('socket.io');
const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const unprotectedRoute = require("./routes/unprotectedRoutes");
const protectedRoute = require("./routes/protectedRoutes");
const initializeWebSocket = require("./sockets/eventDispatcher");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const routeAuth = require("./middlewares/routeAuth");
const roleAuth = require("./middlewares/roleAuth");

require('dotenv').config();

const app = express();
const state = process.env.PROJECT_STATE;
const allowedOrigin = process.env.ALLOWED_ORIGIN;
const port = state === "production" ? 3000 : 5000;

const corsOptions = {
  origin: [state === "development" ? "https://localhost:3000" : allowedOrigin],
  credentials: true,
  methods: ['GET','POST','OPTIONS'],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use((req, res, next) => {
  if (state === 'production') {
    res.setHeader("Content-Security-Policy", "default-src 'self'; connect-src 'self' wss://api.kalusugapp.com");
  } else {
    res.setHeader("Content-Security-Policy", "default-src 'self'; connect-src 'self' ws://localhost:3000 wss://localhost:5000");
  }
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Cross-Origin-Resource-Policy", "same-origin");
  next();
});

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

const serverOptions = {
  key: fs.readFileSync(path.join(__dirname, 'certificates', 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'certificates', 'cert.pem')),
};
app.use(express.static("public"));

app.use("/api", unprotectedRoute);
app.use("/api", routeAuth, roleAuth, protectedRoute);

const server = https.createServer(serverOptions, app);
// const server = http.createServer(app);

const io = new Server(server, {
  cors: corsOptions,
});
initializeWebSocket(io);

server.listen(port, () => {
  console.log(`Server is running on port https://localhost:${port}`);
});

module.exports = app;
