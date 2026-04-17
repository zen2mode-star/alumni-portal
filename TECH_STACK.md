# KEC Alumni Portal - Technology Stack & Services

This document details the tools, technologies, and services used to build and deploy the **KEC Alumni Portal (KecAlumini.in)**.

---

## 🏗️ Core Tech Stack
The foundational technologies that power the portal.

| Technology | Purpose | Key Features |
| :--- | :--- | :--- |
| **Next.js (v16+)** | The Framework | Server-Side Rendering (SSR), API routes, and fast image optimization. |
| **React (v19)** | UI Library | Component-based interactive user interface. |
| **TypeScript** | Language | Static typing to prevent bugs and improve code maintainability. |
| **Prisma** | Database ORM | Type-safe database client for PostgreSQL. |
| **Tailwind CSS** | Styling Engine | Utility-first CSS for modern, responsive design. |

---

## 🛠️ Key Libraries & Tools
Specific tools used for security, data handling, and UX.

*   **Jose (JWT)**: Handles secure user authentication sessions via encrypted tokens.
*   **Bcryptjs**: Securely hashes user passwords for database storage.
*   **Lucide React**: Premium SVG icon sets for a clean user interface.
*   **Nodemailer**: Automated email system for verification and notifications.
*   **CSV Parse**: Automated engine for importing alumni/student lists from Excel/CSV files.
*   **Tsx**: Used to run TypeScript scripts directly (e.g., seeding the database).

---

## ☁️ Free Cloud Services
The infrastructure used to host and run the site for free.

### 1. Vercel (Web Hosting)
*   **Purpose:** Houses the live website.
*   **Features:** Automatic deployments from GitHub, built-in SSL (HTTPS), and zero-cost hosting for developers.

### 2. Neon PostgreSQL (Database)
*   **Purpose:** Secure, cloud-based storage for all user, job, and event data.
*   **Features:** Serverless PostgreSQL that scales automatically and provides a generous free tier.

### 3. Cloudinary (Media Storage)
*   **Purpose:** Storage for images (profile pictures, posts, banners).
*   **Features:** Fast image delivery via CDN and automatic image resizing to save bandwidth.

### 4. GitHub (Version Control)
*   **Purpose:** Code hosting and version management.
*   **Features:** Integrates with Vercel for seamless updates.

---

### 🚀 Why This Stack?
1.  **Zero Cost**: The entire platform runs on "Free Tiers," meaning there are no monthly hosting fees.
2.  **Modern & Scalable**: These are the same tools used by companies like Netflix, Airbnb, and Uber.
3.  **Secure**: Uses industry-standard encryption and security practices to protect user data.
