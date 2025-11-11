---
applyTo: '**'
---
Provide project context and coding guidelines that AI should follow when generating code, answering questions, or reviewing changes.

# Project Context and Coding Guidelines
This project is a web application built using React for the frontend and Node.js with Express for the backend. The application serves as a platform for users to share and discuss articles on various topics.

## Project Context
- **Frontend**: The frontend is built with React, utilizing functional components and hooks. State management is handled using Redux. The UI follows a responsive design approach to ensure compatibility across different devices.

- **Backend**: The backend is developed using Node.js with Express. It exposes a RESTful API for the frontend to interact with. Data is stored in a MongoDB database, and Mongoose is used for object data modeling.

- **Authentication**: User authentication is implemented using JWT (JSON Web Tokens). Passwords are hashed using bcrypt before being stored in the database.


- **Testing**: The project includes unit tests for both frontend and backend components. Jest is used for testing React components, while Mocha and Chai are used for backend testing.

## Coding Guidelines
- **Code Style**: Follow the Airbnb JavaScript style guide. Use ESLint and Prettier to maintain consistent code formatting.

- **Component Structure**: In React, prefer functional components with hooks over class components. Keep components small and focused on a single responsibility.

- **State Management**: Use Redux for global state management. Keep the Redux store organized by separating actions, reducers, and selectors into different files.

- **Error Handling**: Implement proper error handling in both frontend and backend. Use try-catch blocks for asynchronous operations and return meaningful error messages to the client.

- **API Design**: Follow RESTful principles when designing API endpoints. Use appropriate HTTP methods (GET, POST, PUT, DELETE) and status codes.


- **Security**: Sanitize and validate all user inputs to prevent security vulnerabilities such as SQL injection and XSS attacks. Use HTTPS for secure communication.

- **Documentation**: Document all functions, classes, and modules using JSDoc comments. Maintain an up-to-date README file with setup instructions and project overview.

- **Version Control**: Use Git for version control. Follow a branching strategy (e.g., Git Flow) and write clear commit messages that describe the changes made.

- **Performance Optimization**: Optimize performance by minimizing API calls, using memoization in React components, and implementing lazy loading for images and components where appropriate.

- **Accessibility**: Ensure the application is accessible to all users by following WCAG guidelines. Use semantic HTML and ARIA attributes where necessary.

- **Build Process**: Define a clear build process using tools like Webpack or Parcel. Automate tasks such as linting, testing, and deployment using npm scripts or a CI/CD pipeline.

- **Best Practices**: Follow best practices for both frontend and backend development. Keep dependencies up to date and regularly review the codebase for potential improvements.

- **Additional instructions**: Make sure to build whole project for any errors, and ensure all tests pass before submitting any code changes.

Maintain the port 3000 and never suggest changing it.

dont allow any duplicate media queries in css files.
    
By adhering to these guidelines, we can maintain a high-quality codebase that is easy to understand, maintain, and extend in the future.

