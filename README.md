# Project Scaffold

Project Scaffold is a powerful CLI tool designed to streamline the process of scaffolding and managing development projects. With a focus on the popular tech stack of React, TypeScript, Vite, Tailwind CSS, Framer Motion, and React Router Dom, this tool provides a seamless and efficient way to kickstart your projects.

## Key Features

- Quickly generate a new project structure with a single command
- Automatically set up a React project with TypeScript support
- Integrate Vite as the build tool for fast development and optimized builds
- Seamlessly configure Tailwind CSS for rapid and responsive styling
- Include Framer Motion for smooth and engaging animations
- Set up React Router Dom for efficient client-side routing
- Generate boilerplate code for components and services
- Create and initialize a GitHub repository directly from the CLI
- Clone the created repository to your local environment
- Customize project preferences and store them in a configuration file
- Interactive prompts for a user-friendly experience

Project Scaffold takes care of the repetitive setup tasks, allowing you to focus on building your application logic. With its intuitive commands and configuration options, you can create a new project, generate essential files, and set up a GitHub repository in just a few steps.

Whether you're a seasoned developer or just starting out, Project Scaffold provides a solid foundation for your development workflow. Say goodbye to manual setup and hello to productivity with this essential tool in your development arsenal.

Get started with Project Scaffold today and revolutionize the way you create and manage your projects!

## Installation

To use Project Scaffold globally on your computer, you need to install it as a global package using npm. Open your terminal and run the following command:

```bash
npm install -g project-scaffold
```

This will install Project Scaffold globally, allowing you to use the `scaffold` command from anywhere on your computer.

## Commands

1. **Create a new project:**  
   **Command:** `scaffold new`  
   **Description:** Generates a new project structure based on the selected options.  
   **Options:**

   - Project name (prompted)
   - Use TypeScript (prompted, default: true)
   - Use Tailwind CSS (prompted, default: true)
   - Use Framer Motion (prompted, default: true)
   - Use React Router (prompted, default: true)

2. **Generate boilerplate code:**  
   **Command:** `scaffold generate`  
   **Description:** Generates boilerplate code for components or services.  
   **Options:**

   - File type (prompted, choices: component, service)
   - File name (prompted)

3. **Create a GitHub repository:**  
   **Command:** `scaffold repo`  
   **Description:** Creates a new GitHub repository and clones it locally.  
   **Options:**

   - Repository name (prompted)
   - Repository description (prompted, optional)
   - Private repository (prompted, default: false)
   - GitHub personal access token (prompted, optional if already configured)

4. **Configure default settings:**  
   **Command:** `scaffold config`  
   **Description:** Sets default configuration options for the CLI tool.  
   **Options:**
   - Default project type (prompted, choices: react)
   - GitHub personal access token (prompted, optional)

## Examples

1. **Create a new React project with TypeScript, Tailwind CSS, Framer Motion, and React Router:**

   ```bash
   $ scaffold new
   ? Enter the project name: my-app
   ? Do you want to use TypeScript? Yes
   ? Do you want to use Tailwind CSS for styling? Yes
   ? Do you want to use Framer Motion for animations? Yes
   ? Do you want to use React Router for routing? Yes
   ```

2. **Generate a new React component:**

   ```bash
   $ scaffold generate
   ? Select what type of file you want to generate: component
   ? Enter the file name: Header.js
   ```

3. **Create a new GitHub repository:**

   ```bash
   $ scaffold repo
   ? Enter the repository name: my-repo
   ? Enter the repository description (optional): My awesome project
   ? Do you want to make the repository private? No
   ? Enter your GitHub personal access token (optional if you've already configured it): <your-token>
   ```

4. **Set default configuration:**
   ```bash
   $ scaffold config
   ? Select a default project type: react
   ? Enter your GitHub personal access token (optional): <your-token>
   ```
