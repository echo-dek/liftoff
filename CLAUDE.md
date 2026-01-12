# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Liftoff is a Progressive Web App (PWA) for tracking strength training progress. It's built with SvelteKit 2 and Svelte 5, uses Tailwind CSS 4 for styling, and stores all data in local storage for offline-first functionality. The app features progressive overload (automatic weight incrementation) and is designed to work completely offline once loaded.

The app organizes workouts into phases, days, and exercises, with configurable sets/reps and optional weight tracking.

## Development Process

### Behaviour Driven Development

See the [Behaviour Driven Development Guide](Implementation.md).

### Running the Application
- `bun run dev` - Start development server
- `bun run build` - Build for production (uses static adapter)
- `bun run preview` - Preview production build locally

### Code Quality
- `bun run check` - Type check with svelte-check
- `bun run check:watch` - Type check in watch mode
- `bun run format` - Format code with Prettier
- `bun run lint` - Run Prettier and ESLint checks

### Testing
- `bun run test:unit` - Run Vitest unit tests (includes Svelte component tests)
- `bun run test:e2e` - Run Playwright e2e tests
- `bun run test:bdd` - Run Cucumber BDD tests (builds app, starts preview server, runs features)
- `bun run test` - Run both unit and e2e tests

The project uses a multi-layered testing setup:
- **Unit tests**: Vitest with browser mode using Playwright for Svelte component tests (files: `**/*.svelte.{test,spec}.{js,ts}`)
- **Server tests**: Vitest in Node environment (files: `**/*.{test,spec}.{js,ts}`, excluding Svelte test files)
- **E2E tests**: Playwright tests in the `e2e/` directory
- **BDD tests**: Cucumber/Gherkin feature files in the `features/` directory with Playwright step definitions

## Architecture

### Build Configuration
- **Adapter**: Static adapter (`@sveltejs/adapter-static`) for PWA deployment
- **Styling**: Tailwind CSS 4 via Vite plugin
- **TypeScript**: Full TypeScript support with svelte-check

### Project Structure
- `src/routes/` - SvelteKit routes (file-based routing)
  - `+layout.svelte` - Root layout with favicon and global styles
  - `+page.svelte` - Homepage
  - `layout.css` - Global CSS (imported in layout)
- `src/lib/` - Shared library code and assets
- `e2e/` - Playwright end-to-end tests
- `features/` - Cucumber BDD test files
  - `*.feature` - Gherkin feature files describing user scenarios
  - `step-definitions/` - TypeScript step definitions with Playwright integration

### Svelte 5 Features
This project uses Svelte 5, which includes runes-based reactivity:
- Use `$props()` for component props (not `export let`)
- Use `$state()` for reactive state
- Use `{@render children()}` for slot content

### Testing Notes
- Svelte component tests use `vitest-browser-svelte` and run in a real browser via Playwright
- Component tests should use `render()` from `vitest-browser-svelte` and `page` from `vitest/browser`
- E2E tests build and preview the app before running (see playwright.config.ts)
- All tests require assertions (`expect.requireAssertions: true`)
- BDD tests use Cucumber with Playwright integration
  - Feature files use Gherkin syntax (Given/When/Then)
  - Step definitions in `features/step-definitions/` use Playwright for browser automation
  - Hooks file manages browser lifecycle (launch once, new context per scenario)
  - Base URL defaults to `http://localhost:4173` (override with `BASE_URL` env var)

## Svelte MCP Server

You have access to the Svelte MCP server with comprehensive Svelte 5 and SvelteKit documentation:

### Available MCP Tools

**1. list-sections**
Use this FIRST to discover all available documentation sections. Returns a structured list with titles, use_cases, and paths. When asked about Svelte or SvelteKit topics, ALWAYS use this tool at the start of the chat to find relevant sections.

**2. get-documentation**
Retrieves full documentation content for specific sections. Accepts single or multiple sections. After calling the list-sections tool, you MUST analyze the returned documentation sections (especially the use_cases field) and then use the get-documentation tool to fetch ALL documentation sections that are relevant for the user's task.

**3. svelte-autofixer**
Analyzes Svelte code and returns issues and suggestions. You MUST use this tool whenever writing Svelte code before sending it to the user. Keep calling it until no issues or suggestions are returned.

**4. playground-link**
Generates a Svelte Playground link with the provided code. After completing the code, ask the user if they want a playground link. Only call this tool after user confirmation and NEVER if code was written to files in their project.
