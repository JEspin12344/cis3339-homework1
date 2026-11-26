
# CIS 3339 Homework 1

## Project Description

A Student Management System developed using Vue 3,
Vue Router, Pinia, Node.js, Express, and MongoDB.

## Required Software

- Node.js
- npm
- MongoDB Community Edition

## Environment Variables

The backend/.env file contains:

MONGODB_URI=mongodb://127.0.0.1:27017/cis3339_homework1
PORT=3000

## Dependency Installation

From the main project directory, run:

```bash
cd backend
npm install
cd ../frontend
npm install
cd ..
```

## Start MongoDB

Open Windows PowerShell as Administrator and run:

```powershell
Start-Service MongoDB
```

To verify MongoDB is running:

```powershell
Get-Service MongoDB
```

The application automatically creates the required
database collections. No manual database setup is needed.

## Production Build

From the main project directory, run:

```bash
npm run build
```

## Start the Server

```bash
npm start
```

## Application URL

http://localhost:3000

## Application Features

- Add, search, display, and delete students.
- Add, display, and delete courses.
- Enroll students in courses.
- View course enrollment rosters.
- Prevent duplicate records.
- Automatically delete associated enrollments.
- Store and retrieve data using MongoDB.
- Navigate between pages using Vue Router.
- Manage shared application state using Pinia.
