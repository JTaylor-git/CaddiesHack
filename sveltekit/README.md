# Pro-V Planner (SvelteKit)

This folder contains the initial skeleton for migrating the legacy planner
to a modern SvelteKit project.

The planner page includes a toolbar for switching between 2D and 3D views and
distance or dispersion data modes. API keys for Mapbox, Esri and OpenWeatherMap
are saved in localStorage and prompted via a modal on first launch. A side drawer
lists holes and displays the current wind conditions.

## Available Routes

- `/planner` – unified 2D/3D planner
- `/courses` – course directory
- `/courses/[id]` – course details
- `/account` – profile settings and saved courses
- `/profile` – club carry/roll & dispersion chart
- `/events` – tournament calendar
- `/docs` – help and training materials

## Development

Install dependencies and start the dev server:

```bash
npm install
npm run dev -- --open
```

Run `npm run build` to create a production build.
