import { existsSync, mkdirSync, writeFileSync } from "fs";
import path, { join, parse } from "path";
import { execCommand } from "./index.js";
import ora from "ora";
import cliProgress from "cli-progress";

export async function createProjectDirectory(
  projectName,
  projectType,
  options
) {
  const projectPath = join(process.cwd(), projectName);

  switch (projectType) {
    case "react":
      await createReactProject(projectName, options);
      break;
  }
}

async function createReactProject(projectName, options) {
  const { useTypeScript, useTailwind, useFramerMotion, useReactRouter } =
    options;

  const spinner = ora("Creating React project 🪚").start();

  try {
    // Create React project using Vite
    await execCommand(
      `npm create vite@latest ${projectName} -- --template react${
        useTypeScript ? "-ts" : ""
      }`
    );

    spinner.succeed("React project created successfully ✅ 🏁");

    process.chdir(projectName);
    await execCommand("npm install");

    // install additional deps based on selected options
    const dependencies = [];
    if (useTailwind) {
      dependencies.push(
        "tailwindcss@latest postcss@latest autoprefixer@latest"
      );
    }
    if (useFramerMotion) {
      dependencies.push("framer-motion");
    }
    if (useReactRouter) {
      dependencies.push("react-router-dom");
    }

    if (dependencies.length > 0) {
      spinner.start("Installing additional dependencies 🪚");
      await execCommand(`npm install ${dependencies.join(" ")}`);
      spinner.succeed("Additional dependencies installed successfully ✅ 🏁");
    }

    // Generate Taiwind CSS configuration files
    if (useTailwind) {
      spinner.start("Handling Tailwind configuration 🪚");
      await execCommand("npx tailwindcss init -p");

      // Update tailwind.config.js
      writeFileSync(
        "tailwind.config.js",
        `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`
      );

      // Update index.css
      writeFileSync(
        "src/index.css",
        `@tailwind base;
@tailwind components;
@tailwind utilities;`
      );
    }
    spinner.succeed("Tailwind config completed ✅ 🏁");
  } catch (error) {
    spinner.fail(`Error creating React project ❌: ${error.message}`);
  }
}

export function generateBoilerplateCode(fileType, fileName) {
  const spinner = ora(`Generating ${fileType} file...`).start();

  const filePath = join(process.cwd(), fileName);

  try {
    if (existsSync(filePath)) {
      spinner.fail(`File ${fileName} already exists`);
      return;
    }

    const componentName = parse(fileName).name;

    let boilerplateCode = ``;

    switch (fileType) {
      case "component":
        boilerplateCode = `import React from 'react';
                
const ${componentName} = () => {
    return (
        <div>
          <h1>${componentName} Component</h1>
        </div>
        )
    }
    
export default ${componentName};`;
        break;

      case "service":
        boilerplateCode = `export default class ${componentName} {
  constructor() {
      // Initalize service
  }

  // Add service methods

}`;
        break;
    }

    writeFileSync(filePath, boilerplateCode);
    spinner.succeed(`Generated ${fileType} file '${fileName}'.`);
  } catch (error) {
    spinner.fail(`Error generating ${fileType} file: ${error.message}`);
  }
}
