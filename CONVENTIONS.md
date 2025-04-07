# Project Conventions

## JavaScript/TypeScript Style

- Use arrow functions for React components and hooks instead of function declarations
- Use TypeScript for type safety
- Use explicit return types for functions that return complex types
- Prefer type over interface for defining object shapes and API contracts
- Prefer const over let where possible
- Use optional chaining and nullish coalescing
- Use destructuring for props and state

## React Patterns

- Prefer functional components over class components
- Use React hooks for state and side effects
- Co-locate related components in the routes directory
- Prefix private/utility components with `-` (e.g., `-components/SignUpForm.tsx`)
- Use Tanstack Router conventions for routing
- Place shared components in the src/components directory

## Naming Conventions

- Component files: PascalCase
- Util/hook files: camelCase
- CSS modules: camelCase.module.css
- Use descriptive names that reflect component purpose

## File Organization

- Group related files in feature-specific directories
- Keep components small and focused
- Extract reusable logic to custom hooks
