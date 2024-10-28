const express = require('express');
const protectedRoute = express.Router();
const staffController = require('../controllers/staffController');
const recordController = require('../controllers/recordController');
const pharmacyController = require('../controllers/pharmacyController');
const queueController = require('../controllers/queueController');
const appointmentController = require('../controllers/appointmentController');
const clinicRecordController = require('../controllers/clinicRecordController');
const bloodController = require('../controllers/bloodController');

// USER AUTHENTICATION/REGISTRATION
protectedRoute.get('/getStaffId', staffController.getStaffId);
protectedRoute.get('/getStaff', staffController.getStaff);
protectedRoute.post('/addStaff', staffController.addStaff);
protectedRoute.post('/logoutUser', staffController.logoutUser);
protectedRoute.get('/verifyToken', staffController.verifyAccessToken);

// RECORDS
protectedRoute.post('/handleFileUploadRecords', recordController.handleFileUploadRecords);
protectedRoute.post('/addRecord', recordController.addRecord);
protectedRoute.post('/proceedAddRecord', recordController.proceedAddRecord);
protectedRoute.get('/getRecords', recordController.getRecords);
protectedRoute.get('/findRecord/:id', recordController.findRecord);
protectedRoute.post('/findCitizen', recordController.findCitizen);
protectedRoute.post('/updateRecord', recordController.updateRecord);
protectedRoute.post('/deleteRecord/:id', recordController.deleteRecord);
protectedRoute.get('/describeRecords', recordController.describeRecords);

// PHARMACY
protectedRoute.post('/handleFileUploadPharmacy', pharmacyController.handleFileUploadPharmacy);
protectedRoute.get('/getPharmacyInventory', pharmacyController.getPharmacyInventory);
protectedRoute.get('/searchPharmacyInventory/:id', pharmacyController.searchPharmacyInventory);
protectedRoute.get('/describePharmacy', pharmacyController.describePharmacy);
protectedRoute.post('/findMedicine', pharmacyController.findMedicine);
protectedRoute.post('/addMedicine', pharmacyController.addMedicine);
protectedRoute.post('/handleDeleteMedicine/:id', pharmacyController.handleDeleteMedicine);
protectedRoute.post('/updateMedicine', pharmacyController.updateMedicine);
protectedRoute.get('/getProductLogs/:id', pharmacyController.getProductLogs);

// QUEUE
protectedRoute.post('/addToQueue', queueController.addToQueue);
protectedRoute.get('/getQueue', queueController.getQueue);
protectedRoute.get('/getAttended', queueController.getAttended);
protectedRoute.post('/nextQueue', queueController.nextQueue);
protectedRoute.post('/dismissQueue/:id', queueController.dismissQueue);

// APPOINTMENTS
protectedRoute.post('/newAppointment', appointmentController.newAppointment);
protectedRoute.get('/getAppointments', appointmentController.getAppointments);
protectedRoute.get('/findAppointmentByNumber/:id', appointmentController.findAppointmentByNumber);
protectedRoute.post('/handleCancelAppointment/:id', appointmentController.handleCancelAppointment);
protectedRoute.post('/handleApproveAppointment/:id', appointmentController.handleApproveAppointment);

// BLOOD DONORS
protectedRoute.get('/getBlood', bloodController.getBlood);
protectedRoute.post('/addDonor', bloodController.addDonor);

// CLINIC 
protectedRoute.post('/addClinicRecord', clinicRecordController.addCinicRecord);

module.exports = protectedRoute;