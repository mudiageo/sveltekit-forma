# Contributing to Remotive

Thank you for your interest in contributing to Remotive! This guide will help you get started.

## Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/your-username/sveltekit-forma.git
   cd sveltekit-forma
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

## Development Workflow

### Making Changes

1. **Create a new branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write tests for new functionality
   - Update documentation if needed
   - Follow the existing code style

3. **Test your changes**
   ```bash
   npm test
   npm run check
   npm run lint
   ```

4. **Create a changeset**
   ```bash
   npm run changeset
   ```
   
   Follow the prompts to describe your changes. This helps with automatic versioning and changelog generation.

### Code Style

- We use Prettier for code formatting
- ESLint for code quality
- TypeScript for type safety
- Follow existing patterns in the codebase

### Testing

- Write unit tests for new components
- Test accessibility features
- Ensure TypeScript types are correct
- Test both SSR and client-side behavior

### Documentation

- Update README.md for new features
- Add JSDoc comments for public APIs
- Create examples for complex features
- Update the changelog via changesets

## Pull Request Process

1. **Ensure all tests pass**
   ```bash
   npm test
   npm run check
   npm run lint
   npm run package
   ```

2. **Create a pull request**
   - Use a descriptive title
   - Link any related issues
   - Describe what changes you made
   - Include screenshots for UI changes

3. **Review process**
   - Maintainers will review your PR
   - Address any feedback
   - Once approved, your PR will be merged

## Project Structure

```
src/
├── lib/
│   ├── components/     # Form components
│   ├── form.ts        # Core form utilities
│   └── index.ts       # Main exports
├── routes/
│   ├── demo/          # Demo pages
│   └── examples/      # Usage examples
└── test/              # Test utilities
```

## Types of Contributions

### Bug Reports
- Use GitHub issues
- Include reproduction steps
- Provide environment details

### Feature Requests
- Open a GitHub issue first
- Discuss the feature with maintainers
- Consider backward compatibility

### Code Contributions
- Follow the development workflow above
- Start with good first issues
- Ask questions if you're unsure

### Documentation
- Fix typos and unclear explanations
- Add examples and use cases
- Improve API documentation

## Component Guidelines

### Accessibility
- Use semantic HTML
- Include proper ARIA attributes
- Support keyboard navigation
- Test with screen readers

### TypeScript
- Provide full type safety
- Export interfaces for public APIs
- Use generic types where appropriate

### Svelte Best Practices
- Use Svelte 5 runes (`$state`, `$derived`)
- Follow reactive patterns
- Minimize bundle size

## Release Process

We use [Changesets](https://github.com/changesets/changesets) for version management:

1. Changes are described in changesets
2. Versions are bumped automatically
3. Changelogs are generated automatically
4. Releases are published to npm automatically

## Getting Help

- Open a GitHub issue for questions
- Check existing documentation
- Look at examples in the repository

## Code of Conduct

Please be respectful and inclusive in all interactions. We want Remotive to be a welcoming project for everyone.

Thank you for contributing to Remotive! 🚀