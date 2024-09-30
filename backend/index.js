// const http = require("http");
const https = require("https");
const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const routes = require("./routes/routes");
const initializeWebSocket = require("./sockets/eventDispatcher");
const cookieParser = require("cookie-parser");
const config = require("./config.js");
const bodyParser = require("body-parser");
const routeAuth = require("./middlewares/routeAuth");
const authController = require("./controllers/authController");
const emailController = require("./controllers/emailController");
const roleAuth = require("./middlewares/roleAuth");

const app = express();
const port = config.PROJECT_STATE === "production" ? 3000 : 5000;

const corsOptions = {
  origin: [
    ...config.ALLOWED_ORIGIN,
    config.PROJECT_STATE === "development" && "https://localhost:3000",
    "https://192.168.1.2:3000",
    "https://192.168.220.1:3000",
  ],
  methods: ["GET,POST,PUT,DELETE,OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
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
app.post("/api/sendEmail", emailController.sendEmail);
app.use("/api", routeAuth, roleAuth, routes);

const server = https.createServer(serverOptions, app);
// const server = http.createServer(app);

initializeWebSocket(server);

server.listen(port, () => {
  console.log(`Server is running on port https://localhost:${port}`);
});

module.exports = app;
