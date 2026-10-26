# DKP Innovation — Official Website

Official website and digital presence platform for DKP Innovation, built with React 19, TypeScript, Vite, Tailwind CSS v4, and Framer Motion.

## Project Structure

```
dkp/
├── frontend/
│   ├── public/              # Static assets (images, icons, founder photo)
│   ├── src/
│   │   ├── components/      # UI components, pages (Home, About, Services, Contact)
│   │   │   ├── layout/      # Footer and navigation components
│   │   │   ├── ui/          # Micro-interactions, tilt cards, clipped circles
│   │   │   └── unlumen-ui/  # Stacked feature cards, TeamStack
│   │   ├── context/         # Application state and navigation context
│   │   ├── data/            # Authoritative service and company data
│   │   └── hooks/           # Interaction & animation hooks
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm

### Installation & Development

```bash
cd frontend
npm install
npm run dev
```

### Production Build

```bash
cd frontend
npm run build
npm run preview
```
