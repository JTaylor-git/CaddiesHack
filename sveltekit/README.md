# Pro-V Planner (SvelteKit)

This folder contains the initial skeleton for migrating the legacy planner
to a modern SvelteKit project.

The planner page now includes toggles for 2D vs 3D map views and distance vs
dispersion modes. API keys for basemaps and weather are stored in localStorage
via a modal prompt on first load.

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
