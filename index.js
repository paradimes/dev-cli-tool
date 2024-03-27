#!/usr/bin/env node

import minimist from "minimist";
import { createProjectDirectory, generateBoilerplateCode } from "./commands.js";
import { createRepository } from "./github.js";
import inquirer from "inquirer";
import { loadConfig, saveConfig } from "./config.js";
import path from "path";
import { exec } from "child_process";

function execCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout.trim());
      }
    });
  });
}

const args = minimist(process.argv.slice(2));
const config = loadConfig();

if (args._.includes("new")) {
  //   console.log("args === ", args);

  const projectName = args._[1];

  if (!projectName) {
    console.log("Please provide a project name.");
    process.exit(1);
  }

  const defaultProjectType = config.defaultProjectType || "default";

  inquirer
    .prompt([
      {
        type: "list",
        name: "projectType",
        message: "Select a project type:",
        choices: ["react", "express"],
        default: defaultProjectType,
      },
    ])
    .then((answers) => {
      const projectType = answers.projectType;
      createProjectDirectory(projectName, projectType);
    })
    .catch((error) => {
      console.error("Error:", error);
      process.exit(1);
    });
} else if (args._.includes("generate")) {
  inquirer
    .prompt([
      {
        type: "list",
        name: "fileType",
        message: "Select what type of file you want to generate:",
        choices: ["component", "service"],
      },
      {
        type: "input",
        name: "fileName",
        message: "Enter the file name:",
        validate: (input) => {
          if (input.trim() === "") {
            return "Please enter a valid file name.";
          }
          return true;
        },
      },
    ])
    .then((answers) => {
      const { fileType, fileName } = answers;
      generateBoilerplateCode(fileType, fileName);
    })
    .catch((error) => {
      console.error(`Error:, ${error}`);
      process.exit(1);
    });
} else if (args._.includes("create-repo")) {
  inquirer
    .prompt([
      {
        type: "input",
        name: "repoName",
        message: "Enter the repository name:",
        validate: (input) => {
          if (input.trim() === "") {
            return "Please enter a valid repository name.";
          }
          return true;
        },
      },
      {
        type: "input",
        name: "repoDescription",
        message: "Enter the repository description (optional):",
      },
      {
        type: "confirm",
        name: "isPrivate",
        message: "Do you want to make the repository private?",
        default: false,
      },
      {
        type: "input",
        name: "authToken",
        message:
          "Enter your GitHub personal access token (optional if you've already configured it):",
        default: config.authToken,
        validate: (input) => {
          if (input.trim() === "") {
            return "Please enter a valid GitHub personal access token.";
          }
          return true;
        },
      },
    ])
    .then(async (answers) => {
      const { repoName, repoDescription, isPrivate, authToken } = answers;

      try {
        const cloneUrl = await createRepository(
          repoName,
          repoDescription,
          isPrivate,
          authToken
        );
        const repoPath = path.join(process.cwd(), repoName);
        await execCommand(`git clone ${cloneUrl} ${repoPath}`);
        console.log(`Cloned repository to ${repoPath}`);
        console.log(`Repository initialized with basic files`);
      } catch (error) {
        console.error(`Error creating repository: ${error}`);
        process.exit(1);
      }
    });
} else if (args._.includes("config")) {
  inquirer
    .prompt([
      {
        type: "list",
        name: "projectType",
        message: "Select a default project type:",
        choices: ["react", "express"],
        default: config.defaultProjectType,
      },
      {
        type: "input",
        name: "authToken",
        message: "Enter your Github personal access token (optional):",
      },
    ])
    .then((answers) => {
      const { defaultProjectType, authToken } = answers;

      if (defaultProjectType) {
        config.defaultProjectType = defaultProjectType;
      }

      if (authToken) {
        config.authToken = authToken;
      }

      saveConfig(config);
      console.log(`Configuration saved successfully.`);
    });
} else {
  console.log(`Unknown command`);
  process.exit(1);
}
