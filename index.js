#!/usr/bin/env node

const minimist = require("minimist");
const {
  createProjectDirectory,
  generateBoilerplateCode,
} = require("./commands");

const { createRepository } = require("./github");

const args = minimist(process.argv.slice(2));

if (args._.includes("new")) {
  console.log("args === ", args);
  const projectName = args._[1];
  const projectType = args.type || "default";

  if (!projectName) {
    console.log("Please provide a project name.");
    return;
  }

  if (!["default", "react", "express"].includes(projectType)) {
    console.log(`Invalid project type: ${projectType}`);
    console.log(`Supported project types: default, react, express`);
    return;
  }
  createProjectDirectory(projectName, projectType);
} else if (args._.includes("generate")) {
  const fileType = args._[1];
  const fileName = args._[2];

  if (!fileType) {
    console.log("Please provide a file type.");
    return;
  }

  if (!["component", "service"].includes(fileType)) {
    console.log(`Invalid file type: ${fileType}`);
    console.log(`Supported file types: component, service`);
    return;
  }

  if (!fileName) {
    console.log(`Please provide a file name.`);
    return;
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
    return;
  }

  createRepository(repoName, repoDescription, isPrivate, authToken);
} else {
  console.log(`Unknown command`);
}
