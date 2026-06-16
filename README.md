# 🎬 Movie Management Backend API

A secure and scalable RESTful API for movie management built with **Node.js**, **Express.js**, **JWT Authentication**, **PostgreSQL**, **Prisma ORM**, **Zod Validation**, and **Swagger/OpenAPI Documentation**.

<div align="center">

<img src="./banner.png" alt="Movie Management Backend API Banner" width="100%" />

<br/>

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge\&logo=node.js\&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge\&logo=express\&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge\&logo=jsonwebtoken\&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge\&logo=postgresql\&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge\&logo=prisma\&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3E63DD?style=for-the-badge\&logo=zod\&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge\&logo=swagger\&logoColor=black)

</div>

---

## 📖 Overview

Movie Management Backend API is a production-ready REST API that enables users to manage movies and personal watchlists securely.

### Key Highlights

* JWT Authentication & Authorization
* PostgreSQL Database Integration
* Prisma ORM
* Zod Request Validation
* Swagger/OpenAPI Documentation
* Protected Routes
* Centralized Error Handling
* Database Migrations & Seeding

---

## 🛠 Tech Stack

| Category         | Technology        |
| ---------------- | ----------------- |
| Runtime          | Node.js           |
| Framework        | Express.js        |
| Authentication   | JWT               |
| Database         | PostgreSQL        |
| ORM              | Prisma ORM        |
| Validation       | Zod               |
| Documentation    | Swagger / OpenAPI |

---

## ✨ Features

### 🔐 Authentication

* User Registration
* User Login
* User Logout
* JWT Authentication
* Password Hashing with bcryptjs
* Protected Routes Middleware

### 🎬 Movies Management

* Create Movie
* Get All Movies
* Get Movie By ID
* Update Movie
* Delete Movie

### 📺 Watchlist Management

* Add Movies To Watchlist
* Update Watch Status
* Rate Movies
* Add Notes
* Remove Watchlist Items

### 🛡 Backend Features

* Zod Validation
* Centralized Error Handling
* Authentication Middleware
* Prisma Migrations
* Database Seeding
* Modular Architecture

---

## 📁 Project Structure

```text
src/
├── configs/
├── controllers/
├── middlewares/
├── prisma/
├── routes/
├── services/
├── validations/
├── utils/
└── server.js
```

---

## 🚀 Getting Started

### Prerequisites

* Node.js v18+
* PostgreSQL v14+
* Git

### Clone Repository

```bash
git clone https://github.com/SalemNabeelSalem/movie-management-backend-api-by-nodejs-expressjs-jwt-postgresql-prisma.git

cd movie-management-backend-api-by-nodejs-expressjs-jwt-postgresql-prisma
```

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Application
NODE_ENV=development
SERVER_PORT=3000

# Authentication
JWT_SECRET=your_super_secret_key

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/movie_management_db
```

### Run Database Migrations

```bash
npx prisma migrate dev
```

### Seed Database (Optional)

```bash
npm run seed
```

### Start Development Server

```bash
npm run dev
```

Server URL:

```text
http://localhost:3000
```

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint         | Description         |
| ------ | ---------------- | ------------------- |
| POST   | `/auth/register` | Register a new user |
| POST   | `/auth/login`    | Login user          |
| POST   | `/auth/logout`   | Logout user         |

### Movies

| Method | Endpoint      | Description     |
| ------ | ------------- | --------------- |
| POST   | `/movies`     | Create movie    |
| GET    | `/movies`     | Get all movies  |
| GET    | `/movies/:id` | Get movie by ID |
| PUT    | `/movies/:id` | Update movie    |
| DELETE | `/movies/:id` | Delete movie    |

### Watchlist

| Method | Endpoint         | Description              |
| ------ | ---------------- | ------------------------ |
| POST   | `/watchlist`     | Add movie to watchlist   |
| GET    | `/watchlist`     | Get user watchlist       |
| GET    | `/watchlist/:id` | Get watchlist item by ID |
| PUT    | `/watchlist/:id` | Update watchlist item    |
| DELETE | `/watchlist/:id` | Remove watchlist item    |

---

## 📚 API Documentation

Swagger UI is available at:

```text
http://localhost:3000/api-docs
```

Using Swagger, you can:

* Explore all endpoints
* Test requests directly
* View schemas and models
* Review authentication requirements

---

## 📄 License

Licensed under the MIT License.

```text
MIT License © Salem Nabeel Salem
```
