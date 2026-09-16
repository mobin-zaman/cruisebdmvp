# CruiseBD MVP — Booking API

Backend service for the CruiseBD MVP: a river-cruise ticket booking system for
Bangladesh. It exposes a REST API that travel agents use to check seat
availability and book tickets across multiple cruise operators, by automating
the operators' own web-based seat selections with Puppeteer.

Built with [NestJS](https://nestjs.com), TypeORM, MySQL and Firebase
Authentication.

## Features

- **Ship catalogue** — registered cruise operators and their vessels
- **Seat availability** — live seat categories/flagship status per route + date
- **Seat booking** — books seats on the operator's site through a headless
  browser (Puppeteer) and issues a ticket PDF
- **Agent auth** — Firebase ID-token based auth, with agency/agent/admin roles
- **Ticket history** — stored PDFs for every booking

## Tech stack

- NestJS 7 / TypeScript
- TypeORM + MySQL
- Firebase Admin SDK (authentication)
- Puppeteer (headless seat-selection automation on cruise-operator sites)
- imgbb (image upload), html2pdf (ticket PDF generation)

## Requirements

- Node.js 12+ (npm)
- A MySQL server
- A Firebase project with an **Admin SDK service account** key
- API keys for imgbb and html2pdf.app (both optional at runtime)

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment variables**

   Copy `.env.example` to `.env` and fill in the values:

   ```dotenv
   DATABASE_HOST=localhost
   DATABASE_NAME=cruisebd
   DATABASE_USER=root
   DATABASE_PASS=your-db-password
   DATABASE_PORT=3306
   DATABASE_SYNC=true
   IMAGE_BB_API_KEY=
   HTML_2_PDF_API_KEY=
   ```

3. **Firebase Admin SDK credential**

   Place your Firebase service-account JSON file at:

   ```
   config/<your-project>-firebase-adminsdk-<key>.json
   ```

   The exact path is referenced in `src/app.module.ts`. **Never commit a real
   credential** — the `config/` directory is git-ignored (see `.gitignore`).

4. **Database schema**

   With `DATABASE_SYNC=true` (dev), TypeORM creates tables automatically on
   boot. Seed the `ship`, `routes` and `seat_category` tables with your cruise
   operators' details.

## Running

```bash
# development
npm run start:dev

# production
npm run build && npm run start:prod
```

The API listens on **port 4000** by default.

## API

All endpoints require a valid Firebase ID token sent as
`Authorization: Bearer <token>`. Endpoints:

| Method | Path                                    | Description                          |
|--------|-----------------------------------------|--------------------------------------|
| GET    | `/booking/ships`                        | List ships and their seat categories |
| GET    | `/booking/ships/:shipId/seat-category/` | Seat categories for a ship           |
| POST   | `/booking/seat-status/`                 | Live seat availability for a route + date |
| POST   | `/booking/seat-book/`                   | Book seats and issue a ticket        |

## Tests

```bash
npm run test        # unit tests
npm run test:e2e    # end-to-end tests
```

## Project layout

- `src/agency`, `src/agent`, `src/auth` — agencies, agents and authentication
- `src/booking` — seat availability and booking flows
- `src/ship-session` — ship catalogue and the Puppeteer seat-selection logic
- `src/ticket` — ticket and PDF handling

## License

UNLICENSED — private project. See `package.json`.