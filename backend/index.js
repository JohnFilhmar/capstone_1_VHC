const https = require("https");
const { Server } = require('socket.io');
const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const routes = require("./routes/routes");
const initializeWebSocket = require("./sockets/eventDispatcher");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const routeAuth = require("./middlewares/routeAuth");
const authController = require("./controllers/authController");
const emailController = require("./controllers/emailController");
const roleAuth = require("./middlewares/roleAuth");
require('dotenv').config();

const app = express();
const state = process.env.PROJECT_STATE;
const allowedOrigins = process.env.ALLOWED_ORIGIN;
const port = state === "production" ? 3000 : 5000;

const corsOptions = {
  origin: [
    allowedOrigins,
    state === "development" && "https://localhost:3000",
    "https://192.168.1.2:3000",
    "https://192.168.220.1:3000",
  ],
  credentials: true,
  methods: ['GET','POST','OPTIONS'],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

const serverOptions = {
  key: fs.readFileSync(path.join(__dirname, 'certificates', 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'certificates', 'cert.pem')),
};
app.use(express.static("public"));

app.use("/api/authStaff", authController.authStaff);
app.use("/api/authToken", authController.authToken);
app.use("/api/verifyEmail/:token", authController.verifyEmail);
app.use("/api", routeAuth, roleAuth, routes);

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
