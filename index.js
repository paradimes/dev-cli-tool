#!/usr/bin/env node

import minimist from "minimist";
import { createProjectDirectory, generateBoilerplateCode } from "./commands.js";
import { createRepository } from "./github.js";
import inquirer from "inquirer";
import { loadConfig, saveConfig } from "./config.js";

const args = minimist(process.argv.slice(2));
const config = loadConfig();

if (args._.includes("new")) {
  //   console.log("args === ", args);

  const projectName = args._[1];

  if (!projectName) {
    console.log("Please provide a project name.");
    process.exit(1);
  }

  const defaultProjectType = config.defaultProjecType || "default";

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
  const fileType = args._[1];
  const fileName = args._[2];

  if (!fileType) {
    console.log("Please provide a file type.");
    process.exit(1);
  }

  if (!["component", "service"].includes(fileType)) {
    console.log(`Invalid file type: ${fileType}`);
    console.log(`Supported file types: component, service`);
    process.exit(1);
  }

  if (!fileName) {
    console.log(`Please provide a file name.`);
    process.exit(1);
  }

  generateBoilerplateCode(fileType, fileName);
} else if (args._.includes("create-repo")) {
  const repoName = args._[1];
  const repoDescription = args.repoDescription || "";
  const isPrivate = args.private || false;
  const authToken = args.token;

  if (!repoName) {
    console.log("Please provide a repository name.");
  }

  if (!authToken) {
    console.log(
      `Please provide a GitHub authentication token using the --token flag.`
    );
    process.exit(1);
  }

  createRepository(repoName, repoDescription, isPrivate, authToken);
} else if (args._.includes("config")) {
  const defaultProjectType = args._[1];

  if (!defaultProjectType) {
    console.log(`Please provide a default project type.`);
    process.exit(1);
  }

  if (!["default", "react", "express"].includes(defaultProjectType)) {
    console.log(`Invalid project type: ${defaultProjectType}`);
    console.log(`Supported project types: default, react, express`);
    process.exit(1);
  }

  config.defaultProjecType = defaultProjectType;
  saveConfig(config);
  console.log(`Default project type set to: ${defaultProjectType}`);
} else {
  console.log(`Unknown command`);
}
