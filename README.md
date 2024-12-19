# Joke API Vue 3 Demo

## Description

This project is a code challenge that demonstrates a Joke API using a Vue 3 frontend and a Node.js backend. The application allows users to view, add, edit, and delete jokes. It supports both server-side and client-side operations for sorting and pagination.

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `frontend`: a Vue.js app using:
  - [Vue 3](https://v3.vuejs.org/)
  - [Vite](https://vitejs.dev/)
  - [Vue Router](https://router.vuejs.org/)
  - [Vee-Validate](https://vee-validate.logaretm.com/v4/)
  - [Zod](https://zod.dev/)
  - [Tailwind CSS](https://tailwindcss.com/)
  - [shadcn-vue](https://www.shadcn-vue.com/)
  - [Lucide Icons](https://lucide.dev/)
- `backend`: a Node.js app using:
  - [Express](https://expressjs.com/)
  - [Limiting Middleware](https://www.npmjs.com/package/limiting-middleware)

### Monorepo

This project is based on a monorepo setup using [Turborepo](https://turborepo.org/).

## How to run

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- [pnpm](https://pnpm.io/)

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/nachodd/joke-api-vue3-demo.git
cd joke-api-vue3-demo
pnpm install
```

### Develop

To run the development server for all the apps, run the following command:

```bash
pnpm dev
```

This will start both the frontend and backend applications. The frontend will be available at `http://localhost:5173/` and the backend at `http://localhost:3005`.
