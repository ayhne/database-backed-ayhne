# A Blog Starter App

**a.k.a. Bare Bones Blog 🦴**

_Adapted from Dr. Ray Toal’s original https://github.com/lmucs/blog-starter-app_

Anne Sebastian
LMU CMSI 2021 Web Application Development | Fall 2026

Description:
Hi there! This project is a database backed blog application implimented through React and Vite. The Bare Bone Blog application has expanded ability through the integration of a Neon PostgreSQL database so that users can signup/login and preserve their published articles under their account!

Previously the articles were stored locally in memory not it is stored in a shared database that can be accessed publically. In fact the articles stay published after the web app refreshes as well as when a user starts a new session (as long as they are logged into their created account!).

## Scripts

- `npm run dev` — start the development server
- `npm run build` — build for production into `dist/`
- `npm run preview` — serve the production build locally
- `npm test` — run the tests with [Vitest](https://vitest.dev/)
- `npm run lint` — run ESLint
