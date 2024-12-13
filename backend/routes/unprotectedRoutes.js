const express = require("express");
const dashboardController = require("../controllers/dashboardController");
const authController = require("../controllers/authController");
const emailController = require("../controllers/emailController");
const unprotectedRoute = express.Router();
const multer = require('multer');
const queueController = require("../controllers/queueController");
const insightsController = require("../controllers/insightsController");
const homeController = require("../controllers/homeController");

const upload = multer();
// EMAIL SENDER
unprotectedRoute.post("/sendEmail", upload.single('file'), emailController.sendEmail);

// AUTHENTICATOR
unprotectedRoute.post("/authStaff", authController.authStaff);
unprotectedRoute.post("/authToken", authController.authToken);
unprotectedRoute.post("/verifyEmail/:token", authController.verifyEmail);

// QUEUE
unprotectedRoute.get('/getQueue', queueController.getQueue);

// HOME
unprotectedRoute.get("/getHomeData", homeController.getHomeData);

// DASHBOARD
unprotectedRoute.get("/getDashBoardData", dashboardController.getDashboardData);

// INSIGHTS
unprotectedRoute.get("/getBarangaysPopulation", insightsController.getBarangaysPopulation);

module.exports = unprotectedRoute;
