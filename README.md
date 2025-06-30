# E-Store Sales Operations

## Project Overview

This project consists of a **pre-existing backend API** and a **newly developed frontend application**.  
I developed the **frontend** to provide a user-friendly interface that interacts with the existing backend API for managing products, stock operations, and sales operations.

---

## Frontend Technologies and Logic

- **Technologies used:**  
  - HTML, CSS for structure and styling  
  - Vanilla JavaScript with `XMLHttpRequest` for API communication  
  - Modular JavaScript code organized into reusable components/modules

- **Frontend Responsibilities:**  
  - Managing product listings: create, read, update, delete (CRUD) operations  
  - Handling stock and sales operations with validation and dynamic UI updates  
  - Connecting asynchronously to backend API endpoints to fetch and send data  
  - Implementing search and filtering features  
  - Error handling and user feedback within the frontend  

---

## Frontend Applications

The frontend is composed of three main applications, each serving a specific purpose:

### 1. Gestion Produit (Product Management)

- Manage product information through the API:  
  display, create, edit, delete, and search products.  
- **API Endpoints Used:**  
  `GET /products`, `GET /products/:id`, `POST /products`, `PUT /products/:id`, `DELETE /products/:id`, `GET /products?search={query}`

### 2. Operation Stock (Stock Operations)

- Manage incoming stock operations including multiple products per operation:  
  list, create, delete, view details, and search stock operations.  
- **API Endpoints Used:**  
  `GET /stock-operations`, `GET /stock-operations/:id`, `POST /stock-operations`, `DELETE /stock-operations/:id`, `GET /stock-operations?search={query}`, `GET /products`

### 3. Operation Ventes (Sales Operations)

- Manage sales operations with multiple products and stock validation:  
  list, create, delete, view details, and search sales operations.  
- **API Endpoints Used:**  
  `GET /sell-operations`, `GET /sell-operations/:id`, `POST /sell-operations`, `DELETE /sell-operations/:id`, `GET /sell-operations?search={query}`, `GET /products`

---

## Existing Backend API

- The backend is a pre-existing Node.js Express API included in this repository but **not developed by me**.  
- It exposes RESTful endpoints for products, stock operations, and sales operations.  
- Runs by default on `http://localhost:3000`.

---

## How to Run the Project

### Prerequisites

- Node.js (v14+ recommended)  
- npm  
- MongoDB running locally or remotely  

### 1. Clone the repository

```bash
git clone <repository-url>
cd "class project"
