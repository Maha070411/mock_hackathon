# Mock Hackathon - Full Stack Library Management System

This repository contains a fully functional Library Management System developed using **React (Frontend)** and **Spring Boot (Backend)**, communicating natively with a **MySQL** database. It features secure JWT-based authentication, an Admin Portal for robust inventory and transaction management, and a Student Portal for browsing real-time catalog categories and actively tracking borrowed books.

## Key Features

### Role-Based Access Control
- Secure JWT stateless authentication mechanism encrypting user payloads intelligently.
- **Admin**: Has overarching functional access to manage books, formally view robust student borrowing tables in the Ledger, export CSV analytics, and click to definitively mark active checked-out items as "Returned".
- **Student**: Has secure access to cleanly browse uniquely filtered catalogs bounded dynamically by distinct academic departments, search efficiently, and securely monitor their individualized overdue borrowing records seamlessly.

### Frontend
- Interactive, responsive UI powered by modern **React (Vite)** integration.
- Hot-reloading mappings targeting responsive design features cleanly.
- Highly premium styling layouts.

### Backend
- Solid backend configuration via **Spring Boot 3.2.4** and internal **Spring Security** integration.
- Robust RESTful patterns connecting statically to rigorous `MySQL` storage.
- Comprehensive **JUnit 5** and **Mockito** unit tests validating critical constraints implicitly.
- State-of-the-art **`DataInitializer.java`** effectively orchestrating mock data pipelines mapping 32 distinctive departmental textbooks reliably into a fresh database ensuring instantaneous functional demonstration states globally directly after compilation.

### Architecture Info
- Default Database Target: `mock_hackathon` (Locally mapped internally via `application.properties`)
- Backend operates natively on: `localhost:8081` mapping functional `api/*` controllers safely.
- Frontend deployed consistently via Vite mapping: `localhost:5173`

## Quick Launch Guide

1. **Deploying the Administrative Backend**:
   Navigate explicitly directly into the `library-backend` folder structure natively within your CLI console. Check that your local `MySQL` engine is operating internally securely and fire up `mvn spring-boot:run`. 
2. **Deploying the Interactive Frontend**:
   Navigate precisely securely into `mock_hackathon-frontend/mock_hackathon-frontend/frontend/`. Inside this directory, securely issue `npm install` synchronously to fetch modules, iteratively followed smoothly by `npm run dev` to securely host the frontend application instances instantly over port 5173.

## Testing Environment Accounts
- System Administrator Environment: `admin@library.com` (password: `admin123`)
- Student Academic Environment: `student@library.com` (password: `student123`)
