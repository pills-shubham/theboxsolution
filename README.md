# The Box Solution - Full Stack Packaging Business App

A production-ready web application for package/box manufacturing businesses, built with Next.js, Supabase, and Framer Motion.

## 🚀 Features
- **Google OAuth Authentication**: Seamless login via Google.
- **Dynamic Product Catalog**: Manage products with multiple dimensions.
- **Atomic Ordering**: Robust order placement system using Postgres RPC.
- **Clean Architecture**: Decoupled service layer for frontend ease.
- **Premium UI**: Modern dark-mode compatible design with glassmorphism and animations.
- **Security**: Row Level Security (RLS) for all user data.

---

## 🛠️ Setup Instructions

### 1. Requirements
- Node.js 18+
- Supabase Account
- Google Cloud Project (for OAuth)

### 2. Installation
```bash
git clone <repo-url>
cd theboxsolution
npm install
```

### 3. Supabase & Google Configuration
1. Go to your [Supabase Dashboard](https://supabase.com).
2. Enable **Google** in Authentication > Providers.
3. In your [Google Cloud Console](https://console.cloud.google.com):
   - Create an OAuth 2.0 Client ID.
   - Add your Supabase Auth callback URL (e.g., `https://[project-ref].supabase.co/auth/v1/callback`).
   - Copy the Client ID and Secret to the Supabase Dashboard.
4. Run the SQL schema provided in the documentation or MCP logs.
5. Create a `.env.local` file with:
```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 4. Run Development Server
```bash
npm run dev
```

---

## 📂 Folder Structure
- `src/app`: Next.js App Router pages.
- `src/app/admin`: Admin dashboard, orders, and inventory management.
- `src/app/auth/callback`: Handles OAuth redirect.
- `src/services`: **API Mock Layer**. Wraps Supabase calls.
- `src/services/admin.ts`: Admin-only database operations.
- `src/components`: Reusable UI components.
- `src/lib`: Configuration (Supabase client).

---

## 📡 API Documentation (Service Layer)

### **Authentication** (`authService`)
| Method | Description | Payload |
|--------|-------------|---------|
| `loginWithGoogle()` | Redirects to Google OAuth | - |
| `signOut()` | Clears session | - |

### **Admin Services** (`adminService`)
| Method | Description | Role Required |
|--------|-------------|---------------|
| `checkAdminStatus()` | Verifies if user is an admin | Any |
| `getAllOrders()` | Fetches all system orders | Admin |
| `updateOrderStatus(id, s)`| Updates any order status | Admin |
| `listAllProducts()` | Global product management | Admin |

---

## 🛡️ Admin Portal & Whitelisting
The Admin Portal is accessible at `/admin`. Access is strictly controlled via a whitelist.

### To Grant Admin Access:
1. Open your **Supabase Dashboard** > **Table Editor**.
2. Select the `admin_whitelist` table.
3. Insert the **email address** of the Google account you want to grant access to.
4. When that user logs in via `/admin/login`, their record in the `users` table will automatically be marked as `is_admin: true`.

---

### **Products** (`productService`)
| Method | Description | Response |
|--------|-------------|----------|
| `listProducts()` | Get all products | `Product[]` |
| `getProduct(id)` | Get details with dimensions | `Product & { dimensions: Dim[] }` |

### **Cart** (`cartService`)
| Method | Description | Payload |
|--------|-------------|---------|
| `getCart()` | Get logged-in user's cart | `CartItem[]` |
| `addToCart()` | Add item | `{ productId, dimensionId, quantity }` |
| `updateQuantity()`| Patch quantity | `{ cartItemId, quantity }` |
| `removeFromCart()`| Delete item | `{ cartItemId }` |

### **Orders** (`orderService`)
| Method | Description | Payload |
|--------|-------------|---------|
| `placeOrder(addrId)`| **Atomic Order Placement** | `{ address_id: string }` |
| `listOrders()` | History for user | `Order[]` |
| `getOrderDetails()` | Specific order breakdown | `Order & { items: OrderItem[] }` |

### **Addresses** (`addressService`)
| Method | Description | Payload |
|--------|-------------|---------|
| `listAddresses()` | Get user addresses | `Address[]` |
| `addAddress()` | Save new address | `Partial<Address>` |

---

## 🔒 Security (RLS Policies)

The system automatically enforces the following security rules:
- **Products**: Publicly readable, write-access restricted to admins.
- **User Data**: Users can only `SELECT`, `INSERT`, `UPDATE`, or `DELETE` rows where `user_id = auth.uid()`.
- **Order Items**: Accessible only if the parent order belongs to the authenticated user.
- **Transactions**: Order placement is handled via a `SECURITY DEFINER` Postgres function (`place_order`) to ensure atomicity even if RLS is strict.

---

## 📦 Scalability Notes
- **Database**: Uses relational integrity with cascade deletes.
- **API**: Uses Supabase PostgREST (auto-generated) + RPC for complex logic.
- **Frontend**: Fully typed with TypeScript interfaces in `src/services/types.ts`.

---
Developed by Antigravity.
