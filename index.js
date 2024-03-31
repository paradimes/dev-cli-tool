#!/usr/bin/env node

import minimist from "minimist";
import { createProjectDirectory, generateBoilerplateCode } from "./commands.js";
import { createRepository } from "./github.js";
import inquirer from "inquirer";
import { loadConfig, saveConfig } from "./config.js";
import path from "path";
import { spawn } from "child_process";
import { fileURLToPath } from "url";

// utility function: executes a given `command` in the terminal using `spawn`
export function execCommand(command) {
  // returns a new Promise that will resolve with the command's output if it succeeds or reject with an error if it fails
  return new Promise((resolve, reject) => {
    // inside the Promise, it uses the `spawn` function from the `child_process` module to create a new child process and execute the command
    const child = spawn(command, { shell: true });
    let output = "";

    // it attaches event listeners to the child process:
    // this listens for data on the standard --output-- stream and appends it to the `output` variable
    child.stdout.on("data", (data) => {
      output += data.toString();
    });

    // this listens for data on the standard --error-- stream and appends it to the `output` variable
    child.stderr.on("data", (data) => {
      output += data.toString();
    });

    // this listens for any errors that occur during the execution of the command and rejects the Promise with the error.
    child.on("error", (error) => {
      reject(error);
    });

    // this listen for the child process to close and checks the exit code
    child.on("close", (code) => {
      // code 0 indicates success, so any other code should reject the Promise with an error message that includes the exit code and the captured output
      if (code !== 0) {
        reject(new Error(`Command failed with exit code ${code}: ${output}`));
      } else {
        // the code was 0 therefore indicating success, resolves the Promise with the trimmed output
        resolve(output.trim());
      }
    });
  });
}

function runCLI() {
  const args = minimist(process.argv.slice(2));
  const config = loadConfig();

  if (args._.includes("new")) {
    //   console.log("args === ", args);

    inquirer
      .prompt([
        {
          type: "input",
          name: "projectName",
          message: "Enter the project name:",
          validate: (input) => {
            if (input.trim() === "") {
              return "Please enter a valid project name.";
            }
            return true;
          },
        },
        {
          type: "confirm",
          name: "useTypeScript",
          message: "Do you want to use TypeScript?",
          default: true,
        },
        {
          type: "confirm",
          name: "useTailwind",
          message: "Do you want to use Tailwind CSS for styling?",
          default: true,
        },
        {
          type: "confirm",
          name: "useFramerMotion",
          message: "Do you want to use Framer Motion for animations?",
          default: true,
        },
        {
          type: "confirm",
          name: "useReactRouter",
          message: "Do you want to use React Router for routing?",
          default: true,
        },
      ])
      .then(async (answers) => {
        const {
          projectName,
          useTypeScript,
          useTailwind,
          useFramerMotion,
          useReactRouter,
        } = answers;

        const options = {
          useTypeScript,
          useTailwind,
          useFramerMotion,
          useReactRouter,
        };
        await createProjectDirectory(projectName, "react", options);
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
          choices: ["react"],
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
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runCLI();
}
