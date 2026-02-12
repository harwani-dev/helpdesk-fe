## Helpdesk (Frontend)

A lightweight helpdesk web app to **create tickets**, and **track requests** from a single dashboard with ticket lists.
This app centralizes the concerns around ticket generation and maintainance.

### What you can do

- **Auth**: register and login (token stored in `localStorage`)
- **Tickets**: create tickets and browse ticket lists
- **Dashboard**: quick overview of what needs attention
- **Activity**: see recent updates/events
- **Profile**: basic user/profile screen

### Tech stack

- **Framework**: React + TypeScript
- **Build tooling**: Vite
- **Styling**: Tailwind CSS (v4)
- **UI**: neobrutalism ui components + Lucide icons
- **Routing**: React Router
- **Data**: TanStack Query, Axios
- **Tables**: TanStack Table
- **Toasts**: Sonner
- **Error Handling**: React error boundary

### Run locally

#### Steps

1. Install dependencies

```bash
npm install
```

2. Start the frontend

```bash
npm run dev
```

3. Open the app

- Vite will print the local URL (typically `http://localhost:5173`)

### Useful scripts

- **dev**: `npm run dev`
- **build**: `npm run build`
- **preview**: `npm run preview`
- **lint**: `npm run lint`