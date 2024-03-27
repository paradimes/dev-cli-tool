const fs = require("fs");
const path = require("path");

function createProjectDirectory(projectName, projectType) {
  const projectPath = path.join(process.cwd(), projectName);

  if (fs.existsSync(projectPath)) {
    console.log(`Directory ${projectName} already exists.`);
    return;
  }

  fs.mkdirSync(projectPath);
  console.log(`Created directory '${projectName}'`);

  switch (projectType) {
    case "react":
      createReactProject(projectPath);
      break;

    case "express":
      createExpressProject(projectPath);
      break;

    default:
      console.log(`Unknown project type '${projectType}'.`);
  }
}

function createReactProject(projectPath) {
  fs.mkdirSync(path.join(projectPath, "src"));
  fs.writeFileSync(
    path.join(projectPath, "src", "index.js"),
    "// React project index.js"
  );
  fs.writeFileSync(
    path.join(projectPath, "package.json"),
    "// React project package.json"
  );
  console.log(`Created React project structure.`);
}

function createExpressProject(projectPath) {
  fs.writeFileSync(
    path.join(projectPath, "app.js"),
    "// Express project app.js"
  );
  fs.writeFileSync(
    path.join(projectPath, "package.json"),
    "// Express project package.json"
  );
  console.log(`Created Express project structure`);
}

function generateBoilerplateCode(fileType, fileName) {
  const filePath = path.join(process.cwd(), fileName);

  if (fs.existsSync(filePath)) {
    console.log(`File ${fileName} already exists`);
    return;
  }

  const componentName = path.parse(fileName).name;

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

  fs.writeFileSync(filePath, boilerplateCode);
  console.log(`Generated ${fileType} file '${fileName}'.`);
}

module.exports = {
  createProjectDirectory,
  generateBoilerplateCode,
};
