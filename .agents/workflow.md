# Workflow

## Build Commands

- `bun run build`: Only for build/bundler issues or verifying production output
- `bun run lint`: Type-checking & type-aware linting
- `bun run dev` runs indefinitely in watch mode
- `bun run db` for Drizzle Kit commands (e.g. `bun run db generate` to generate a migration)

Don't build after every change. If lint & type checks pass; assume changes work.

## Testing

No testing framework is currently set up. Prefer lint checks for now.

## Formatting

Oxfmt is configured for consistent code formatting via `bun run format`. It runs automatically on commit via Husky pre-commit hooks, so manual formatting is not necessary.
