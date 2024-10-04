@echo off
start cmd /k "cd backend && npm install && npm run nodemon start"
start cmd /k "cd frontend && npm install && npm start"