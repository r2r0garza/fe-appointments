# Appointments Frontend

Frontend for a small appointment-request app. Users enter their name, email address, preferred date, and a short note, then submit the request and see whether it was accepted.

## User flow

- Present a form for the appointment request details.
- Provide clear validation feedback for missing or invalid values.
- Submit valid requests to the appointments backend.
- Show the backend's accepted or failed result clearly and accessibly.

An accepted request is an acknowledgement that the request was received; it is not a confirmed booking unless scheduling functionality is added later.

## Development

This project uses React, TypeScript, Vite, Tailwind CSS, and shadcn/ui. From this directory, install dependencies with `pnpm install`, then start the development server with `pnpm dev`.

Available checks are `pnpm typecheck`, `pnpm lint`, and `pnpm build`. Run `pnpm preview` to serve a production build locally.

## API configuration

The form posts its four fields to `/api/appointments`. During local development Vite proxies that path to `http://127.0.0.1:8000`; configure a different proxy target with `VITE_API_PROXY`. For a separately hosted frontend, set `VITE_API_BASE_URL` to the API origin at build time. Start the backend with `python3 be-appointments/server.py` from the repository root (or `python3 server.py` from `be-appointments`).
