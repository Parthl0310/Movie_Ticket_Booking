# MERN Movie Ticket Booking App

A full-stack movie booking application built with React, Vite, Node.js, Express, MongoDB, and Vercel deployment support.
https://movie-ticket-booking-wg21.vercel.app/

## Project Structure

- `client/` - React frontend using Vite, Clerk auth, Tailwind CSS, and Axios for API calls.
- `server/` - Express backend with MongoDB, Mongoose, Clerk middleware, Stripe payments, Inngest functions, and SMTP email configuration.

## Technologies

- Frontend: React 19, Vite, Tailwind CSS, React Router DOM, React Hot Toast, React Player
- Backend: Node.js, Express 5, MongoDB, Mongoose, Stripe, Cloudinary, Inngest, Nodemailer, Clerk
- Deployment: Vercel (client and server configured separately)

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/Parthl0310/Movie_Ticket_Booking.git
cd MERN
```

### 2. Setup the server

```bash
cd server
npm install
```

Create `server/.env` and add the required environment variables.

Example `server/.env`:

```env
MONGODB_URI=<your-mongodb-connection-string>
SMTP_USER=<your-smtp-username>
SMTP_PASS=<your-smtp-password>
STRIPE_SECRET_KEY=<your-stripe-secret-key>
STRIPE_WEBHOOK_SECRET=<your-stripe-webhook-secret>
INNGEST_EVENT_KEY=<your-inngest-event-key>
```

Start the backend:

```bash
npm run server
```

The server runs locally on `http://localhost:3000`.

### 3. Setup the client

```bash
cd ../client
npm install
```

Create `client/.env` and add the values needed for the frontend.

Example `client/.env`:

```env
VITE_CURRENCY='₹'
VITE_CLERK_PUBLISHABLE_KEY=<your-clerk-publishable-key>
VITE_BASE_URL=http://localhost:3000/
VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p/w500
```

Start the frontend:

```bash
npm run dev
```

Open the local Vite URL shown in the terminal (usually `http://localhost:5173`).

## API Endpoints

The backend exposes the following routes:

- `/api/show` - show management endpoints
- `/api/booking` - booking endpoints
- `/api/admin` - admin routes
- `/api/user` - user routes
- `/api/stripe` - Stripe webhook endpoint
- `/api/inngest` - Inngest event handling
- `/health` - health check endpoint

## Vercel Deployment

This project includes separate Vercel configuration files for the frontend and backend.

### Client deployment

1. Create a Vercel project from the `client/` folder.
2. Set the build command to:
   ```bash
   npm run build
   ```
3. Set the output directory to:
   ```bash
   dist
   ```
4. Add the required Vercel environment variables for the client:
   - `VITE_CLERK_PUBLISHABLE_KEY`
   - `VITE_BASE_URL` (set this to your deployed backend URL)
   - `VITE_TMDB_IMAGE_BASE_URL`
   - `VITE_CURRENCY`

The `client/vercel.json` file rewrites all incoming requests to the app root.

### Server deployment

1. Create a Vercel project from the `server/` folder.
2. Vercel will use `server/vercel.json` to deploy the Node backend with `@vercel/node`.
3. Add the required Vercel environment variables for the server:
   - `MONGODB_URI`
   - `SMTP_USER`
   - `SMTP_PASS`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `INNGEST_EVENT_KEY`

The `server/vercel.json` file routes all requests to `server.js`.

## Notes

- The frontend uses `VITE_BASE_URL` to reach the backend API.
- The backend connects to MongoDB using `MONGODB_URI` and appends `/Movie_ticket_booking`.
- For production, ensure all secret values are configured in Vercel instead of storing them in `.env` files.

## Run Commands Summary

- Start backend: `cd server && npm run server`
- Start frontend: `cd client && npm run dev`
- Build frontend: `cd client && npm run build`

## Useful Links

- Vercel docs: https://vercel.com/docs
- Clerk docs: https://clerk.com/docs
- Stripe docs: https://stripe.com/docs
- MongoDB docs: https://www.mongodb.com/docs
- Inngest docs: https://www.inngest.com/docs
