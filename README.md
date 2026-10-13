# ContextGraph Frontend

A React + Vite frontend prototype for ContextGraph — an intelligent, context-aware personal information retrieval system.

## Current UI modules

- Dashboard
- Natural-language Context Search
- Documents / Information Vault
- Knowledge Graph visualization
- Memory Timeline
- Collections placeholder
- Search History placeholder
- Settings placeholder
- Upload modal

## Run locally

Requirements:
- Node.js 18+ (Node 20+ recommended)

```bash
npm install
npm run dev
```

Then open the Vite URL shown in the terminal, normally:

http://localhost:5173

## Backend integration

The current frontend uses demo data so the UI can be reviewed immediately.

When we build the Spring Boot backend, API calls will be added for:
- Authentication
- Uploads
- Document extraction
- OCR
- Semantic search
- Context-aware ranking
- Knowledge graph
- Timeline
- Related information
- Duplicate/conflict detection

Recommended deployment:
- Frontend: Vercel
- Backend: Render
- Database: PostgreSQL
