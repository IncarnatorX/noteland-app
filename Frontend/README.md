# Noteland Frontend

This is the frontend for **Noteland**, a note-taking and task management web application built with React and Vite.

## Features

- Create, view, and delete notes
- Add tasks to notes and mark them as completed
- Organized UI with sidebar navigation and main section
- Toast notifications for actions and warnings
- Responsive design

## Project Structure

- `public/` — Static assets (images)
- `src/`
  - `components/` — React components for notes, tasks, sidebar, etc.
  - `context/` — React Context for global state management
  - `toasts/` — Toast notification logic and components
  - `assets/` — (currently empty)
  - `App.jsx` — Main app component
  - `main.jsx` — Entry point
  - `App.css`, `index.css` — Styles

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Environment Variables

Set `VITE_BACKEND_URL` in a `.env` file to point to your backend API.

## Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run preview` — Preview production build
- `npm run lint` — Run ESLint

## Dependencies

- React
- Vite
- React Toastify
