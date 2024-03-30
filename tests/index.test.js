import { describe, it, expect } from "vitest";
import { execCommand } from "../index.js";
import { spawn } from "child_process";
import { vi } from "vitest";

vi.mock("child_process");

describe("execCommand", () => {
  it("should execute a command successfully", async () => {
    const command = 'echo "Hello, World!"';
    const expectedOutput = "Hello, World!";

    spawn.mockImplementation(() => ({
      stdout: {
        on: (event, callback) => {
          if (event === "data") {
            callback(Buffer.from(expectedOutput));
          }
        },
      },
      stderr: {
        on: vi.fn(),
      },
      on: (event, callback) => {
        if (event === "close") {
          callback(0);
        }
      },
    }));

    const output = await execCommand(command);
    expect(output).toBe(expectedOutput);
  });

  it("should reject with an error if the command fails", async () => {
    const command = "non-existent-command";
    const errorMessage = "Command failed with exit code 1: command not found";

    spawn.mockImplementation(() => ({
      stdout: {
        on: vi.fn(),
      },
      stderr: {
        on: (event, callback) => {
          if (event === "data") {
            callback("command not found");
          }
        },
      },
      on: (event, callback) => {
        if (event === "close") {
          callback(1);
        }
      },
    }));

    await expect(execCommand(command)).rejects.toThrow(errorMessage);
  });
});
