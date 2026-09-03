Provider notification test accounts created by `npm run seed` use the password `password123`:

- `jordan@careconnect.local`
- `maya@careconnect.local`
- `dylan@careconnect.local`

Log in as one of these providers, keep the provider available, then create a service request as a customer. The request appears under the provider dashboard notifications.
# CareConnect

A MERN home-services marketplace and operations workspace.

## Run locally

1. Install Node.js 18+ and MongoDB.
2. In `backend`, copy `.env.example` to `.env` and set `MONGO_URI` and `JWT_SECRET`.
3. Run `npm install` and `npm run dev` in `backend`.
4. Run `npm install` and `npm run dev` in `frontend`.
5. Open `http://localhost:5173`.

Keep the backend terminal running while using the frontend. If the browser shows `ERR_CONNECTION_REFUSED` for `:5000/api/auth/login` or `:5000/api/auth/register`, start it again with `cd backend; npm.cmd run dev`. Run `npm.cmd run seed` once if you need the demo admin account `alex@careconnect.local` with password `password123`; seeding clears existing users and providers.

New registrations always use the `user` role. The database roles are `user`, `providers`, and `admin`. Operations, Operations Manager, and Support Agent are admin dashboard workspaces selected from the top switcher. Service Provider is a real `providers` account with a provider dashboard. Admins can promote users from the Users screen; promotion automatically creates the linked provider profile. For an existing database created with previous role names, run `npm run migrate:roles` once from `backend`.

The first UI is a polished operations workspace with request creation, request status tracking, provider discovery, quality metrics, and role-oriented navigation. The API includes JWT authentication, role authorization, provider/request resources, availability-safe status workflow foundations, analytics, and MongoDB models. Extend the existing model surface with quotes, bookings, invoices, reviews, disputes, notifications, and audit events as the next slices.
