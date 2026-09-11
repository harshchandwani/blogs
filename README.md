# Personal Blog & Learning Sandbox

A custom-built, full-stack blogging platform designed as a complete replacement for Medium. Beyond serving as a personal documentation hub for technical articles, this project acts as a **continuous learning sandbox** to experiment with and master enterprise-level system architecture, advanced backend concepts, and DevOps tooling.

## 🚀 Core Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** Custom JWT (JSON Web Tokens)
- **Content Parsing:** Markdown / MDX

## 🏗 System Architecture

This project is architected as a **Monorepo** using [Turborepo](https://turbo.build/). This structure was chosen to demonstrate enterprise-level codebase management, streamline CI/CD pipelines, and achieve end-to-end type safety between the Node API and the Next.js client.

### Workspace Structure

\`\`\`text
my-blog-monorepo/
├── apps/
│   ├── frontend/       # Next.js Application (Client)
│   └── backend/        # Node.js / Express (API)
├── packages/
│   ├── database/       # Prisma Schema & Generated Client
│   ├── eslint-config/  # Shared linting rules
│   └── typescript/     # Shared tsconfig.json
└── turbo.json          # Monorepo task orchestration
\`\`\`

## 🎯 Current Features

The application is purposefully scoped to three core views to prioritize backend architecture over frontend complexity:

1. **The Dashboard:** A public, high-performance feed of all published technical articles and notes.
2. **The Article View:** A clean reading experience rendering raw Markdown/MDX into HTML, complete with syntax highlighting for code blocks.
3. **The Admin Panel:** A secure, JWT-protected authoring environment to draft, edit, and publish content.

## 🗺 DevOps & Infrastructure Roadmap (The Sandbox)

This project is built to evolve continuously. The underlying infrastructure will be upgraded in phases to introduce new technologies:

- [ ] **Phase 1: Containerization:** Implement a `docker-compose.yml` to orchestrate the Node app, Next.js app, and local PostgreSQL database.
- [ ] **Phase 2: Data Caching:** Integrate **Redis** to implement cache-aside strategies for the public article feed, drastically reducing database read operations.
- [ ] **Phase 3: Event-Driven Architecture:** Integrate **Kafka** to establish an asynchronous message broker (e.g., handling background tasks when a new article is published).

## 🛠 Getting Started (Local Development)

### Prerequisites
- Node.js (v18+)
- pnpm (Recommended package manager for Turborepo)
- Docker & Docker Compose (For local database and infrastructure)

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/your-repo-name.git
   cd your-repo-name
   \`\`\`

2. Install dependencies across the entire monorepo:
   \`\`\`bash
   pnpm install
   \`\`\`

3. Set up the environment variables:
   Create a `.env` file in `apps/backend` and `apps/frontend` using `.env.example` as a reference.

4. Start the database (via Docker):
   \`\`\`bash
   docker-compose up -d postgres
   \`\`\`

5. Push the database schema:
   \`\`\`bash
   cd packages/database
   pnpm prisma db push
   \`\`\`

6. Start the development servers:
   \`\`\`bash
   # From the root of the project
   pnpm dev
   \`\`\`
   *This command leverages Turborepo to spin up both the frontend (localhost:3000) and backend (localhost:4000) simultaneously.*

---
**Author:** Harsh Chandwani
