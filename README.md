# al-hayy-int

**Al Hayy International** (`alhayyinternational.com`) — High-converting, bespoke European & American luxury minimalist E-Commerce atelier platform. Built with Next.js 16 App Router, Tailwind CSS, Lucide Icons, Canvas Confetti, and integrated with live PHP/MySQL backend APIs.

---

## ✨ Key Features & Architecture

- **Luxury European Minimalist Aesthetic**: Editorial typography, muted parchment tones, high-conversion layouts, and dynamic micro-interactions.
- **Dynamic Catalog & Filtering**: Real-time product browsing, category filtering, price sliders, in-stock counters, and high-resolution zoom views.
- **Direct Card Controls**: Interactive `[-] [ Qty ] [+]` controls embedded directly on product cards without intrusive drawer popups.
- **Strict Customer Auth Guard**: Unauthenticated users visiting checkout are seamlessly redirected to `/login?redirect=/checkout` with their cart preserved.
- **Multi-Gateway Payment Integration**:
  - **Razorpay**: Domestic Indian Cards, UPI, NetBanking.
  - **Stripe**: International Cards (Visa, Mastercard, AMEX, Apple Pay).
  - **UPI Direct QR**: Instant zero-fee QR scan (GPay, PhonePe, Paytm).
  - **Cash on Delivery (COD)**: Configurable handling fee, min order amount, and toggled OFF by default.
- **Secure Management Portal (`/admin`)**:
  - Protected administrative hub (Login-only, no registration).
  - Real-time Product Catalog CRUD (Multipart FormData uploads).
  - Dynamic Category Management.
  - Live Customer Orders & Inquiries Viewer.
  - Full Payment Gateways Configuration & Toggle Switch panel synced with remote MySQL database.
- **SEO & Performance Engine**:
  - Dynamic metadata on all pages (`title`, `description`, OpenGraph).
  - `sitemap.js` and `robots.js` generators for search indexing.
  - Responsive image optimization with Next.js Image component.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### 3. Production Build
```bash
npm run build
npm start
```

---

## 🛠️ Tech Stack
- **Framework**: Next.js 16 (App Router + Turbopack)
- **Frontend**: React 19, Tailwind CSS, Lucide React, Canvas Confetti
- **Backend API**: PHP REST APIs (PDO MySQL)
- **Payment Gateways**: Razorpay, Stripe, UPI Direct, Cash on Delivery (COD)
