# Contributing to Scrapify

Thank you for your interest in contributing to Scrapify! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Guidelines](#contributing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)

## Code of Conduct

This project follows a code of conduct to ensure a welcoming environment for all contributors. Please be respectful and constructive in all interactions.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git
- Basic knowledge of React, Node.js, and TypeScript

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/scrapify.git
   cd scrapify
   ```

3. Add the upstream repository:
   ```bash
   git remote add upstream https://github.com/original-owner/scrapify.git
   ```

## Development Setup

### 1. Install Dependencies

```bash
# Install all dependencies (root, backend, and frontend)
npm run install:all
```

### 2. Environment Setup

```bash
# Copy environment example files
cp backend/env.example backend/.env

# Edit the .env file with your configuration
nano backend/.env
```

### 3. Start Development Servers

```bash
# Start both frontend and backend concurrently
npm run dev
```

Or start them separately:

```bash
# Terminal 1 - Backend (http://localhost:3001)
npm run dev:backend

# Terminal 2 - Frontend (http://localhost:3000)
npm run dev:frontend
```

### 4. Verify Setup

- Backend API: http://localhost:3001/api/health
- Frontend Dashboard: http://localhost:3000

## Contributing Guidelines

### Types of Contributions

We welcome various types of contributions:

- **Bug Fixes** - Fix existing issues
- **Feature Additions** - Add new functionality
- **Documentation** - Improve documentation
- **Performance** - Optimize existing code
- **Testing** - Add or improve tests
- **UI/UX** - Improve user interface and experience

### Before You Start

1. **Check Existing Issues** - Look for existing issues or discussions
2. **Create an Issue** - For significant changes, create an issue first
3. **Discuss Changes** - Get feedback before implementing major changes
4. **Check Branch Status** - Ensure you're working on the latest main branch

### Branch Naming

Use descriptive branch names:

```bash
# Feature branches
feature/add-new-scraping-source
feature/improve-dashboard-ui

# Bug fix branches
fix/cors-error-handling
fix/memory-leak-in-scraping

# Documentation branches
docs/update-api-documentation
docs/add-contributing-guide
```

## Pull Request Process

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Make Changes

- Write clean, readable code
- Follow the coding standards
- Add tests if applicable
- Update documentation

### 3. Commit Changes

Use conventional commit messages:

```bash
git commit -m "feat: add new scraping source for GitHub trending"
git commit -m "fix: resolve CORS error in API responses"
git commit -m "docs: update API documentation"
```

### 4. Push Changes

```bash
git push origin feature/your-feature-name
```

### 5. Create Pull Request

1. Go to GitHub and create a pull request
2. Fill out the PR template
3. Request reviews from maintainers
4. Address feedback and make necessary changes

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Manual testing performed
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

## Issue Reporting

### Bug Reports

When reporting bugs, include:

1. **Clear Description** - What happened vs. what you expected
2. **Steps to Reproduce** - Detailed steps to reproduce the issue
3. **Environment** - OS, Node.js version, browser version
4. **Screenshots** - If applicable
5. **Error Messages** - Full error messages and stack traces

### Feature Requests

For feature requests, include:

1. **Use Case** - Why is this feature needed?
2. **Proposed Solution** - How should it work?
3. **Alternatives** - Other solutions considered
4. **Additional Context** - Any other relevant information

## Coding Standards

### TypeScript

- Use strict TypeScript configuration
- Define proper types for all functions and variables
- Use interfaces for object shapes
- Avoid `any` type unless absolutely necessary

```typescript
// Good
interface User {
  id: string;
  name: string;
  email: string;
}

function getUser(id: string): Promise<User> {
  // implementation
}

// Avoid
function getUser(id: any): any {
  // implementation
}
```

### React Components

- Use functional components with hooks
- Define proper prop types
- Use meaningful component and variable names
- Keep components focused and single-purpose

```typescript
// Good
interface ButtonProps {
  variant: 'primary' | 'secondary';
  onClick: () => void;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ variant, onClick, children }) => {
  return (
    <button className={`btn btn-${variant}`} onClick={onClick}>
      {children}
    </button>
  );
};
```

### Node.js/Express

- Use async/await for asynchronous operations
- Implement proper error handling
- Use middleware for cross-cutting concerns
- Follow RESTful API design principles

```typescript
// Good
export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await userService.getAllUsers();
  res.json({
    success: true,
    data: users,
    timestamp: new Date().toISOString()
  });
});
```

### Code Style

- Use ESLint and Prettier for consistent formatting
- Follow the existing code style
- Use meaningful variable and function names
- Add comments for complex logic

```typescript
// Good
/**
 * Calculates the total price including tax
 * @param basePrice - The base price before tax
 * @param taxRate - The tax rate as a decimal (e.g., 0.1 for 10%)
 * @returns The total price including tax
 */
function calculateTotalPrice(basePrice: number, taxRate: number): number {
  return basePrice * (1 + taxRate);
}
```

## Testing

### Manual Testing

Before submitting a PR, manually test:

1. **Frontend Functionality**
   - Load the dashboard
   - Test scraping operations
   - Verify error handling
   - Check responsive design

2. **Backend API**
   - Test all endpoints
   - Verify error responses
   - Check rate limiting
   - Test health endpoints

3. **Integration**
   - Test frontend-backend communication
   - Verify data flow
   - Check error propagation

### Test Checklist

- [ ] All new features work as expected
- [ ] Existing functionality is not broken
- [ ] Error cases are handled properly
- [ ] UI is responsive on different screen sizes
- [ ] API endpoints return correct responses
- [ ] Rate limiting works correctly

## Documentation

### Code Documentation

- Add JSDoc comments for functions and classes
- Document complex algorithms and business logic
- Update README files for new features
- Include examples in documentation

```typescript
/**
 * Scrapes data from a specific source
 * @param request - Scraping request parameters
 * @returns Promise resolving to scraped data and metadata
 * @throws {Error} When scraping fails or source is not found
 * @example
 * ```typescript
 * const result = await scrapingService.scrapeData({
 *   source: 'bullish-markets',
 *   format: 'json',
 *   options: { limit: 10 }
 * });
 * ```
 */
async scrapeData(request: ScrapingRequest): Promise<ScrapingResponse> {
  // implementation
}
```

### README Updates

When adding new features:

1. Update the main README.md
2. Update component-specific README files
3. Add API documentation
4. Include usage examples
5. Update installation instructions if needed

## Performance Considerations

### Frontend Performance

- Use React.memo for expensive components
- Implement proper loading states
- Optimize bundle size
- Use lazy loading where appropriate

### Backend Performance

- Implement proper caching strategies
- Use efficient database queries
- Implement rate limiting
- Monitor memory usage

## Security Considerations

- Validate all inputs
- Implement proper authentication (if needed)
- Use HTTPS in production
- Sanitize error messages
- Follow security best practices

## Release Process

### Versioning

We use semantic versioning (SemVer):

- **MAJOR** - Breaking changes
- **MINOR** - New features (backward compatible)
- **PATCH** - Bug fixes (backward compatible)

### Release Checklist

- [ ] All tests pass
- [ ] Documentation is updated
- [ ] Version numbers are updated
- [ ] Changelog is updated
- [ ] Release notes are prepared

## Getting Help

### Communication Channels

- **GitHub Issues** - For bug reports and feature requests
- **GitHub Discussions** - For general questions and discussions
- **Pull Request Comments** - For code review discussions

### Resources

- [React Documentation](https://reactjs.org/docs)
- [Node.js Documentation](https://nodejs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Express.js Documentation](https://expressjs.com/)

## Recognition

Contributors will be recognized in:

- CONTRIBUTORS.md file
- Release notes
- Project documentation

Thank you for contributing to Scrapify! 🚀
