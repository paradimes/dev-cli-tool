import { existsSync, mkdirSync, writeFileSync } from "fs";
import path, { join, parse } from "path";
import { execCommand } from "./index.js";

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

  console.log("Creating React project... ----------------------------------");
  // Create React project using Vite
  await execCommand(
    `npm create vite@latest ${projectName} -- --template react${
      useTypeScript ? "-ts" : ""
    }`
  );
  console.log(
    "React project created successfully ----------------------------------"
  );
  process.chdir(projectName);
  await execCommand("npm install");

  // install additional deps based on selected options
  const dependencies = [];
  if (useTailwind) {
    dependencies.push("tailwindcss@latest postcss@latest autoprefixer@latest");
  }
  if (useFramerMotion) {
    dependencies.push("framer-motion");
  }
  if (useReactRouter) {
    dependencies.push("react-router-dom");
  }

  console.log(
    "Installing additional dependencies... ----------------------------------"
  );
  if (dependencies.length > 0) {
    await execCommand(`npm install ${dependencies.join(" ")}`);
  }
  console.log(
    "Additional dependencies installed successfully ----------------------------------"
  );

  // Generate Taiwind CSS configuration files
  if (useTailwind) {
    console.log("Tailwind config... ----------------------------------");
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
  console.log("Tailwind config completed ----------------------------------");
}

export function generateBoilerplateCode(fileType, fileName) {
  const filePath = join(process.cwd(), fileName);

  try {
    if (existsSync(filePath)) {
      console.log(`File ${fileName} already exists`);
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
    console.log(`Generated ${fileType} file '${fileName}'.`);
  } catch (error) {
    console.error(`Error generating ${fileType} file: ${error.message}`);
  }
}
