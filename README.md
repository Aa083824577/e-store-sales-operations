# E-Store Sales Operations

## Project Overview

This project consists of a **pre-existing backend API** and a **newly developed frontend** that I built based on an existing Figma UI design.  
I translated the design into a working frontend using HTML, CSS, and vanilla JavaScript, and connected it to the backend via API.

---

## 🔧 Technologies and Logic Used

- **Frontend:**
  - UI design (not by me) from [Figma](https://www.figma.com/design/GhvclsuMFaTHMthjjmpClY/E-Store?node-id=5489-395&t=tM4HU2F5dLl6BMNl-1)
  - HTML & CSS for layout and styling
  - Vanilla JavaScript with modular structure
  - `XMLHttpRequest` for all API requests
- **Logic Implemented:**
  - Full CRUD operations (products, stock, sales)
  - Search and filtering
  - Dynamic UI updates
  - Stock quantity validation
  - Error handling and user feedback
- **API Testing:** via Postman (`tools/STORE-API.postman_collection.json`)

---

## 🧩 Frontend Applications

### 1. Gestion Produit (Product Management)

- Manage product data via API.
- Features: list, create, update, delete, search.
- API Used:
  - `GET/POST/PUT/DELETE /products`
  - `GET /products?search={query}`

### 2. Operation Stock (Stock In)

- Manage incoming stock operations.
- API Used:
  - `GET/POST/DELETE /stock-operations`
  - `GET /products` for selection
  - `GET /stock-operations?search={query}`

### 3. Operation Ventes (Sales Out)

- Handle sales transactions and validate stock.
- API Used:
  - `GET/POST/DELETE /sell-operations`
  - `GET /products`
  - `GET /sell-operations?search={query}`

---

## 🔌 Backend API (Pre-Existing)

- Node.js Express API
- Runs on `http://localhost:3000`
- Routes:
  - `/products`
  - `/stock-operations`
  - `/sell-operations`
- **Note:** I did not build the backend.

---

## 🚀 How to Run the Project

### Prerequisites

- Node.js
- npm
- MongoDB running locally or remotely

### 1. Clone the repository

```bash
git clone <repository-url>
cd "class project"
