# Chrome Extension Template

A modern, well-structured template for building Chrome browser extensions. This
template provides a solid foundation for developing Chrome extensions using best
practices and modern web technologies.

## Features

- **React** - Build UI components with React
- **Vite with Rolldown** - Fast build tool with experimental Rolldown bundler for optimal performance
- **TypeScript** - Full TypeScript support with strict type checking
- **Manifest V3** - Latest Chrome extension manifest format
- **Hot Reload** - Development server with hot reload support
- **Modern Tooling** - Clean and organized file structure with best practices

## Tech Stack

- **React 19** - UI library
- **Vite 7** - Build tool with Rolldown bundler
- **TypeScript** - Type-safe development
- **Bun** - Fast package manager and runtime

## Getting Started

### Installation

```bash
bun install
```

### Development

Build in watch mode:

```bash
bun run dev
```

Start the hot-reload server:

```bash
bun run watch
```

### Building

Build for production:

```bash
bun run build
```

The output will be in the `dist/` directory, ready to be loaded as an unpacked extension in Chrome.

## Project Structure

```
src/
├── popup/          # Popup UI (React components)
├── background/     # Service worker scripts
├── contentScript/   # Content scripts
├── options/         # Options page
└── utils/           # Shared utilities
```

## Development Workflow

1. Make changes to your React components in `src/popup/`
2. Run `bun run dev` to build in watch mode
3. Run `bun run watch` to start the hot-reload server
4. Load the `dist/` folder as an unpacked extension in Chrome
5. Changes will automatically reload the extension

## Building with Vite + Rolldown

This project uses Vite 7 with the experimental Rolldown bundler, which provides:

- Faster builds compared to traditional bundlers
- Better tree-shaking and optimization
- Modern ES module support
- Optimized output for Chrome extensions
