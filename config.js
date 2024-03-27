import fs from "fs";
import path from "path";

// define `configDir` as a hidden directory named `.dev-cli-tool` in the user's home directory
const configDir = path.join(
  process.env.HOME || process.env.USERPROFILE,
  ".dev-cli-tool"
);
// the `configFile` is a JSON file named `config.json` located inside the `configDir`
const configFile = path.join(configDir, "config.json");

// the `loadConfig` function reads the configuration file and returns its contents as an object. if file dne, return an empty object.
export function loadConfig() {
  if (!fs.existsSync(configFile)) {
    return {};
  }

  try {
    const configData = fs.readFileSync(configFile, "utf8");
    return JSON.parse(configData);
  } catch (error) {
    console.error(`Error loading configuration: ${error}`);
    return {};
  }
}

// the `saveConfig` function takes a configuration object and saves it to the configuration file. it creates the `configDir` if it dne.
export function saveConfig(config) {
  try {
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir);
    }

    fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
    console.log(`Configuration saved successfully.`);
  } catch (error) {
    console.error(`Error saving configuration: ${error}`);
  }
}
