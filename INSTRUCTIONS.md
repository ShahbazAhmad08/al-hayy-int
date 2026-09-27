Below is the complete blueprint and master prompt designed for Google Anti-Gravity to build the Next.js E-Commerce Frontend:

Markdown

# Master Blueprint: Next.js E-Commerce App Integration with PHP Backend

## 1. Project Overview

Build a high-performance, responsive Full-Stack E-Commerce Frontend using Next.js (App Router), Tailwind CSS, Lucide Icons, and React Context API. The frontend will communicate with an existing custom PHP/MySQL backend hosted at:
`http://alhayyinternational-com.stackstaging.com/v2/api/`

---

## 2. API Endpoints Reference Map

All API requests must use `http://alhayyinternational-com.stackstaging.com/v2/api/` as the base URL.

| Sl  | API File Name           | Method      | Input Parameters                                                                                                                                                                              | Purpose / Function                                                        |
| --- | ----------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| 1   | `db.php`                | Internal    | None                                                                                                                                                                                          | Centralized Database connection & CORS configuration                      |
| 2   | `get-products.php`      | GET         | None                                                                                                                                                                                          | Fetch all products along with their category name and variants            |
| 3   | `get-product-by-id.php` | GET         | `?id={product_id}`                                                                                                                                                                            | Fetch detailed view of a single product                                   |
| 4   | `add-product.php`       | POST        | FormData: `title`, `description`, `price`, `discount_price`, `category_id`, `is_featured`, `image` (File), `variants` (JSON string)                                                           | Upload product image, save product details, and store size/color variants |
| 5   | `update-product.php`    | POST        | FormData: `id`, `title`, `description`, `price`, `discount_price`, `category_id`, `is_featured`, `image` (Optional File), `variants` (JSON string)                                            | Update product info, replace/keep image, and refresh variants             |
| 6   | `delete-product.php`    | POST/DELETE | Body (JSON): `{"id": product_id}`                                                                                                                                                             | Delete product record from DB and remove uploaded image from server       |
| 7   | `register.php`          | POST        | Body (JSON): `{"username": "", "email": "", "password": ""}`                                                                                                                                  | Register new admin/user                                                   |
| 8   | `login.php`             | POST        | Body (JSON): `{"username": "", "password": ""}`                                                                                                                                               | Authenticate admin/user and return account details                        |
| 9   | `create-order.php`      | POST        | Body (JSON): `{"customer_name": "", "phone": "", "address": "", "total_amount": 0, "payment_status": "pending/paid", "items": [{"product_id": 1, "size": "M", "quantity": 1, "price": 999}]}` | Place COD or Online order and save line items                             |
| 10  | `verify-payment.php`    | POST        | Body (JSON): `{"order_id": 123, "payment_status": "paid/failed"}`                                                                                                                             | Update order payment status after gateway response                        |
| 11  | `get-user-orders.php`   | GET         | `?phone={phone_number}` (Optional)                                                                                                                                                            | Fetch order list (filtered by phone or full list for Admin)               |

---

## 3. Frontend Architecture & Folder Structure

Create the following files in the Next.js project:

```text
├── .env.local
├── context/
│   ├── CartContext.js           <-- Shopping cart & checkout state (LocalStorage persistent)
│   └── AuthContext.js           <-- Admin/User login token management
├── components/
│   ├── Navbar.jsx               <-- Header, Search, Cart Badge, Nav Links
│   ├── Footer.jsx               <-- Branding & Quick Links
│   ├── ProductCard.jsx          <-- Reusable card with Image, Price, Discount, Add-to-Cart
│   ├── CartDrawer.jsx           <-- Slide-over Cart with Quantity +/- & Remove buttons
│   └── PaymentModal.jsx         <-- Fully frontend-configured Payment Gateway Handler
├── app/
│   ├── layout.js                <-- Global Wrapper with Providers
│   ├── page.js                  <-- Homepage (Banner, Featured Products, Categories)
│   ├── shop/
│   │   └── page.js              <-- Product Listing, Filters (Category, Price Range), Search
│   ├── product/[id]/
│   │   └── page.js              <-- Single Product Details, Variant Selection (Size/Color)
│   ├── checkout/
│   │   └── page.js              <-- Shipping Form & Payment Selection (Razorpay/UPI/COD)
│   ├── orders/
│   │   └── page.js              <-- Order Tracking via Phone Number
│   └── admin/
│       ├── page.js              <-- Admin Login
│       └── dashboard/
│           └── page.js          <-- Product CRUD Table, Add/Edit Modal, Orders View
4. Key Implementation Rules for Anti-Gravity
A. Environment Setup (.env.local)
Code snippet
NEXT_PUBLIC_API_BASE_URL=[http://alhayyinternational-com.stackstaging.com/v2/api](http://alhayyinternational-com.stackstaging.com/v2/api)
B. Cart & LocalStorage State Management (CartContext.js)
Persistent storage in localStorage.

Methods: addToCart(product, selectedSize, selectedColor), removeFromCart(productId, size), updateQuantity(productId, size, delta), clearCart().

C. Admin Product Upload Handling (add-product.php & update-product.php)
Form submission MUST use JavaScript FormData() object instead of JSON payload due to image binary upload.

Convert array of variants into JSON string:

JavaScript
const formData = new FormData();
formData.append('title', title);
formData.append('price', price);
formData.append('image', imageFile); // File input
formData.append('variants', JSON.stringify(variantsArray));

await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/add-product.php`, {
  method: 'POST',
  body: formData, // No Content-Type header needed; browser handles boundary
});
D. Frontend Configured Payment Gateway Flow (PaymentModal.jsx & checkout/page.js)
User completes checkout form (Name, Phone, Address).

Frontend calls create-order.php with order details and payment status "pending".

Backend returns order_id.

Option 1: Cash on Delivery (COD)

Frontend immediately redirects to Success screen.

Option 2: Online Payment Gateway (Razorpay/UPI)

Frontend triggers Payment SDK modal (e.g., Razorpay Checkout JS).

Upon successful payment callback:

Frontend calls verify-payment.php passing {"order_id": orderId, "payment_status": "paid"}.

Clear cart and show Success invoice screen.

5. Execution Order for Anti-Gravity
Initialize Next.js app with Tailwind CSS and Lucide Icons.

Create CartContext and AuthContext.

Build Layout, Navbar, and Footer.

Implement Homepage (app/page.js) and Shop Page (app/shop/page.js) fetching data from get-products.php.

Implement Single Product Page (app/product/[id]/page.js) fetching data from get-product-by-id.php.

Implement Checkout Page (app/checkout/page.js) integrated with create-order.php and verify-payment.php.

Implement Admin Dashboard (app/admin/dashboard/page.js) with Product Table, Delete Trigger (delete-product.php), Add Product Modal (add-product.php), and Orders Listing (get-user-orders.php).


---

### AAPKO KYA KARNA HAI:

1. Apne system/laptop par **Google Anti-Gravity** (ya cursor/AI editor) ko open karein.
2. Upar diye gaye **box ke poore text / Markdown prompt** ko copy karke Anti-Gravity mein paste kar dein.
3. Anti-Gravity automatic saari Next.js frontend files setup karke continuous code kar dega
```
