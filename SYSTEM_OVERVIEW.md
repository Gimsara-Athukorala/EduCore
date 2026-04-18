# System Overview: Tanyaitpm Project

## Project Structure

This workspace contains a web application built as a React frontend and a Node.js/Express backend. The project is organized into:

- `Backend/` — Express API server, MongoDB models, controllers, routes, uploads, and email utility.
- `frontend/` — React single-page application with routing and Tailwind styling.
- Root files — workspace-level `package.json`, `package-lock.json`, and a `node_modules/` folder.

> The project also includes a `Backend/.env` file for SMTP configuration and a hard-coded MongoDB URI in `Backend/app.js`.

---

## Root Files

- `package.json` (workspace root)
  - Contains React dependencies: `react`, `react-dom`, `react-router-dom`.
  - Includes dev dependencies for Vite/Tailwind, but the frontend app appears to be using Create React App as well.

- `package-lock.json` (workspace root)
  - Lockfile for the root workspace dependencies.

- `node_modules/`
  - Present in the workspace; contains installed packages for the project.

---

## Backend

### Backend package and startup

- `Backend/package.json`
  - Uses `express`, `mongoose`, `cors`, `dotenv`, `multer`, `nodemailer`, `qrcode`, `nodemon`.
  - `start` script runs `nodemon app.js`.

- `Backend/app.js`
  - Loads `.env` via `dotenv`.
  - Sets DNS resolvers to Google and Cloudflare.
  - Configures Express middleware: `cors`, JSON and URL-encoded body parsing, static file serving from `uploads/`.
  - Registers routes:
    - `/api/lost-items`
    - `/api/found-items`
    - `/api/admin`
    - `/api/claims`
  - Connects to MongoDB using a hard-coded `MONGODB_URI`.
  - Starts the server on `process.env.PORT || 5000`.
  - Includes global error handling and 404 handler.

### Environment files

- `Backend/.env.example`
  - Defines placeholders for `PORT`, SMTP host/port/user/pass, and `MAIL_FROM`.

- `Backend/.env`
  - Contains values for `PORT`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`.
  - This file is local and should be kept private.

### Models

- `Backend/Model/LostItem.js`
  - Mongoose schema for lost item reports.
  - Fields: `fullName`, `studentId`, `email`, `contactNumber`, `itemName`, `category`, `location`, `date`, `description`, `imageUrl`, `status`, `reward`.
  - Status values: `pending`, `approved`, `rejected`, `resolved`.

- `Backend/Model/FoundItem.js`
  - Mongoose schema for found item reports.
  - Fields: `fullName`, `studentId`, `email`, `contactNumber`, `itemName`, `category`, `location`, `date`, `description`, `imageUrl`, `foundBy`, `status`, `claimDeadline`, `claimedBy`, `claimedAt`, `adminNotes`.
  - Status values: `pending`, `approved`, `rejected`, `claimed`, `returned`.
  - `foundBy` can be `student` or `management`.

- `Backend/Model/Claim.js`
  - Mongoose schema for claim requests.
  - Includes item snapshot fields, claimant details, ID proof metadata, status, verification, pickup code, QR code data, and timestamps.
  - Status values: `pending`, `approved`, `rejected`, `completed`.
  - Indexes on `claimantStudentId`, `itemId`, `status`, and a unique partial index to prevent duplicate pending/approved claims.

### Controllers

- `Backend/controllers/lostItemController.js`
  - Create lost item report with validations.
  - Fetch approved lost items with pagination, category filter, and search.
  - Get single lost item by ID.
  - Update lost item status with basic admin password check (`admin123`).
  - Delete lost item and remove associated image file.
  - Admin pending items and stats endpoints.

- `Backend/controllers/foundItemController.js`
  - Create found item report with validations and optional image upload.
  - Fetch approved found items with filters: category, search, `foundBy`, pagination.
  - Get single found item by ID.
  - Update found item status with admin password check.
  - Claim a found item and transition item status to `claimed`.
  - Mark found item as returned, delete item, and get admin pending/stats.

- `Backend/controllers/claimController.js`
  - Create a claim for an approved found item.
  - Validate item availability, student ID format, email, duplicate claims.
  - Automatically mark found item as `claimed` when a claim is created.
  - List all claims, user claims by student ID, single claim details.
  - Update claim status and send pickup approval email when approved.
  - Delete claims and generate claim statistics.

- `Backend/controllers/adminControllerlostitems.js`
  - Admin dashboard endpoints for stats, pending/accepted items, claim review, and bulk claim management.
  - Update statuses for lost items, found items, and claim records.
  - Delete lost/found items and claims with image cleanup.
  - Add manual found items as an admin.
  - Export data as CSV-like payloads.

### Routes

- `Backend/Route/lostItemRoutes.js`
  - Multer setup for `uploads/lost-items`.
  - Public routes: `GET /`, `GET /:id`, `POST /`.
  - Admin routes: `PUT /:id/status`, `DELETE /:id`, `GET /admin/pending`, `GET /admin/stats`.

- `Backend/Route/foundItemRoutes.js`
  - Multer setup for `uploads/found-items`.
  - Public routes: `GET /`, `GET /:id`, `POST /`.
  - Claim route: `POST /:id/claim`.
  - Admin routes: `PUT /:id/status`, `PUT /:id/return`, `DELETE /:id`, `GET /admin/pending`, `GET /admin/stats`.

- `Backend/Route/claimRoutes.js`
  - Public routes: `POST /`, `GET /my-claims`, `GET /:id`.
  - Admin routes: `GET /`, `PUT /:id/status`, `DELETE /:id`, `GET /admin/stats`.

- `Backend/Route/adminRouteslostFound.js`
  - Central admin routes for dashboard, pending/accepted items, claim management, lost/found item actions, manual found item creation, export.
  - Upload route for admin found item addition.

### Utility

- `Backend/utils/claimPickupMailer.js`
  - Generates `PICKUP-XXXXXX` pickup codes.
  - Builds QR code data payload for claim verification.
  - Configures Nodemailer transporter from `.env` values.
  - Sends claim approval email with embedded QR code image.
  - Returns status when SMTP is not configured.

### Uploads

- `Backend/uploads/lost-items/`
  - Lost item images stored under filenames like `lost-1775378296616-345853877.jpeg`.
  - Total images: 13.

- `Backend/uploads/found-items/`
  - Found item images stored under filenames like `found-1776448910288-183335702.png`.
  - Total images: 15.

> These asset directories are served statically by `Backend/app.js` at `/uploads`.

---

## Frontend

### Frontend package and config

- `frontend/package.json`
  - Uses React 19, React Router DOM 7, Create React App scripts, Tailwind CSS, and Lucide icons.
  - Includes testing libraries and `web-vitals`.

- `frontend/tailwind.config.js`
  - Configures Tailwind to scan `./index.html` and `./src/**/*.{js,ts,jsx,tsx}`.
  - Defines custom colors and fonts.

- `frontend/postcss.config.js`
  - Standard PostCSS setup for Tailwind.

- `frontend/README.md`
  - Default CRA guidance on scripts and deployment.

### Public assets

- `frontend/public/index.html`
  - Basic CRA HTML template with title `EduCore University`.
  - Loads `%PUBLIC_URL%/favicon.ico`, `manifest.json`, and page metadata.

- `frontend/public/manifest.json`
  - Default Create React App manifest with app icons and theme color.

- `frontend/public/robots.txt`
  - Default robots file.

- `frontend/public/logo192.png`, `logo512.png`
  - Default CRA logos.

### Frontend source files

- `frontend/src/index.js`
  - React entry point.
  - Renders `<App />` inside `#root`.

- `frontend/src/App.js`
  - Defines routes with React Router:
    - `/` and `/lost-items` → `lost&foundMainpage`
    - `/found-items` → `FoundItemsPage`
    - `/claim-item/:itemId` → `claimItmes`
    - `/about` → `aboutus`
    - `/adminlostfound` → `AdminLostFoundPage`
  - Always renders `Header` and `Footer`.

- `frontend/src/App.css`
  - Empty file.

- `frontend/src/index.css`
  - Imports Tailwind base/components/utilities.
  - Sets default body margin and font-family.

### Frontend components

- `frontend/src/Components/Lost&Found/lost&foundMainpage.js`
  - Main landing page for lost item reporting and browsing.
  - Fetches lost items from the backend.
  - Provides search, category filtering, date tabs, featured slideshow, item cards, and report lost form.
  - Includes client-side validation for reports.

- `frontend/src/Components/Lost&Found/FoundItemsPage.js`
  - Found items browsing page.
  - Filters by `foundBy` category (`student` or `management`), search, and item category.
  - Displays approved found items and supports found-item report submission.

- `frontend/src/Components/Lost&Found/claimItmes.js`
  - Claim form for a specific found item.
  - Loads item details from the backend using `itemId`.
  - Validates claimant name, student ID, email, ID proof, and terms acceptance.
  - Submits claim requests to `/api/claims`.

- `frontend/src/Components/Lost&Found/AdminLostFoundPage.js`
  - Admin dashboard page.
  - Fetches admin stats, pending items, and accepted items.
  - Allows review and approval/rejection of lost items, found items, and claims.
  - Supports deletion and status updates with `adminPassword=admin123`.

- `frontend/src/Components/Static/aboutus.js`
  - About page with campus slideshow and mission/vision content.
  - Uses Lucide icons and static hero text.

- `frontend/src/Components/Navigations/Header.js`
  - Sticky top navigation bar.
  - Contains brand, navigation buttons, and action icons.

- `frontend/src/Components/Navigations/footer.js`
  - Footer with EduCore branding, quick links, support, legal links, and copyright.

---

## Notable System Details

- Backend uses a hard-coded MongoDB connection string in `Backend/app.js`.
- Admin operations are gatekept by an in-controller password check using `adminPassword === 'admin123'`.
- File uploads are handled by `multer` and saved under `Backend/uploads/lost-items` and `Backend/uploads/found-items`.
- Claim approval emails use `nodemailer` and generate QR codes with `qrcode`.
- The frontend interacts with backend APIs at `http://localhost:5000`.

## Upload Files Inventory

### Lost item image files (`Backend/uploads/lost-items`)
- lost-1775378296616-345853877.jpeg
- lost-1775377248356-837643788.jpg
- lost-1775377032185-90369823.jpeg
- lost-1775376932822-637914264.jpg
- lost-1775376024968-762680119.jpg
- lost-1775375777828-423102033.jpg
- lost-1775375686535-134426998.jpeg
- lost-1775374613419-737557570.jpeg
- lost-1775374336882-118770808.jpg
- lost-1775313509290-683742518.jpg
- lost-1775223734749-54227009.jpg
- lost-1775154977160-468440312.jpeg
- lost-1775019854731-994776103.png

### Found item image files (`Backend/uploads/found-items`)
- found-1776448910288-183335702.png
- found-1776448746391-384211976.png
- found-1776448385254-98227979.png
- found-1775376579997-690220216.jpg
- found-1775372323059-353257202.jpg
- found-1775227177403-125727161.jpg
- found-1775227048276-803675782.jpg
- found-1775225593011-200082761.jpeg
- found-1775224771775-904336669.jpg
- found-1775195652181-598106599.jpeg
- found-1775020843601-223778915.png
- found-1775019771331-347658952.png
- found-1775019656856-380499421.png
- found-1775017757634-211534765.png
- found-1775015426424-429800593.png

---

## How to run the system

- Backend: `cd Backend && npm install && npm start`
- Frontend: `cd frontend && npm install && npm start`

The backend listens on `http://localhost:5000`; the frontend is expected to run on `http://localhost:3000`.

---

## Important notes

- `Backend/.env` contains SMTP credentials and should not be committed to source control.
- `Backend/app.js` currently exposes a database connection URI directly in source code.
- `AdminLostFoundPage.js` and backend admin routes rely on `adminPassword=admin123` for authorization.
- The frontend includes several large component files under `frontend/src/Components/Lost&Found/` implementing major app flows.
