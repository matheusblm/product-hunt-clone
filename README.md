# Product Hunt Clone

A application built with React and TypeScript that replicates the most Popular and Newest Posts of Product Hunt.

## Tech Stack

- React 19
- TypeScript
- React Query (TanStack Query)
- GraphQL (with code generation)
- Testing Libraries (Jest, React Testing Library)

## Prerequisites

- Node.js (Latest LTS version recommended)
- npm (comes with Node.js)

## Getting Started

1. Clone the repository:
```bash
git clone [your-repository-url]
cd product-hunt-clone
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner in interactive watch mode
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## Project Structure

```
src/
├── components/     # React components
├── graphql/       # GraphQL queries and mutations
├── hooks/         # Custom React hooks
├── types/         # TypeScript type definitions
└── ...
```

## Development

This project uses TypeScript for type safety and better developer experience. The GraphQL schema is automatically generated using GraphQL Code Generator.

## Testing

The project uses Jest and React Testing Library for testing. Run tests with:

```bash
npm test
```