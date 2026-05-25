# ResqNet Mobile

Disaster response app with live weather/earthquake signals, maps, and a **SQLite** backend for community reports.

## Run with SQL database

```bash
npm install
npm run db:init    # creates data/resqnet.db from schema.sql
npm start          # http://localhost:3000
```

Open **http://localhost:3000**, log in with OTP **4040**.

- **Alerts** tab shows a green **SQL** badge when the API is connected.
- **Citizen emergency alerts** with geo tags (lat/lon, accuracy, landmark) are stored in SQLite.
- Family check-ins are stored in SQLite.
- If the server is not running, the app falls back to **localStorage** (amber “Offline · local” badge).

## API

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | DB stats |
| GET | `/api/reports?city=Bengaluru` | List community reports |
| POST | `/api/reports` | Create report (JSON body) |
| DELETE | `/api/reports/:id` | Delete report |
| GET | `/api/checkins?city=Bengaluru` | Family safe/SOS check-ins |
| POST | `/api/checkins` | Save check-in |
| POST | `/api/signals/snapshot` | Store risk/weather snapshot |

## Database files

- `server/schema.sql` — table definitions
- `server/seed.sql` — optional demo rows
- `data/resqnet.db` — created at runtime (gitignored)

Reset database:

```bash
npm run db:init -- --reset
```

## Languages (24)

Use the **language dropdown** at the top (login screen and main header). Supports English, Hindi, Bengali, Telugu, Marathi, Tamil, Urdu, Gujarati, Kannada, Malayalam, Punjabi, Odia, Assamese, Japanese, Spanish, French, German, Arabic, Portuguese, Russian, Chinese, Korean, Vietnamese, and Indonesian. Choice is saved in the browser.

## NGO response tab

Shows **only citizen-reported incidents** from the Alerts feed (same SQL/geo-tagged reports). No pre-seeded missions. Register as an NGO responder, then **Deploy** to open the incident on the map.

## Disaster siren

The siren is **manual only** — tap the **bullhorn** in the header after login. It does not auto-ring from weather or risk scores.

- **Silence siren** on the red overlay dismisses the alert.
- Browsers may require one tap anywhere on the page before audio can play.

## Static-only (no SQL)

`npx serve .` still works for UI/maps/signals, but reports stay in the browser only.
