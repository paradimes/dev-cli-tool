import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join, parse } from "path";

export function createProjectDirectory(projectName, projectType) {
  const projectPath = join(process.cwd(), projectName);

  try {
    if (existsSync(projectPath)) {
      console.log(`Directory ${projectName} already exists.`);
      return;
    }

    mkdirSync(projectPath);
    console.log(`Created directory '${projectName}'`);

    switch (projectType) {
      case "react":
        createReactProject(projectPath);
        break;

      case "express":
        createExpressProject(projectPath);
        break;
    }
  } catch (error) {
    console.error(`Error creating project directory: ${error.message}`);
  }
}

function createReactProject(projectPath) {
  mkdirSync(join(projectPath, "src"));
  writeFileSync(
    join(projectPath, "src", "index.js"),
    "// React project index.js"
  );
  writeFileSync(
    join(projectPath, "package.json"),
    "// React project package.json"
  );
  console.log(`Created React project structure.`);
}

function createExpressProject(projectPath) {
  writeFileSync(join(projectPath, "app.js"), "// Express project app.js");
  writeFileSync(
    join(projectPath, "package.json"),
    "// Express project package.json"
  );
  console.log(`Created Express project structure`);
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
                    
                    export default ${componentName};
                    `;
        break;

      case "service":
        boilerplateCode = `export default class ${fileName} {
                            constructor() {
                                // Initalize service
                            }
                            
                            //Add service methods
                        }`;
        break;

      default:
        console.log(`Unknown file type '${fileType}'.`);
        return;
    }

    writeFileSync(filePath, boilerplateCode);
    console.log(`Generated ${fileType} file '${fileName}'.`);
  } catch (error) {
    console.error(`Error generating ${fileType} file: ${error.message}`);
  }
}
