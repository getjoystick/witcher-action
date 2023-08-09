import { exec } from "@actions/exec";
import os from "node:os";
import fs from "node:fs/promises";
import { SOURCE_LOCAL } from "./types";
import { validateInputs } from "./validate";
import * as core from "@actions/core";

const inputs = validateInputs();

core.startGroup("Building witcher params");
const witcherWithVersion = inputs.version ? `witcher@${inputs.version}` : "witcher";

let witcherParams = ["--yes", witcherWithVersion, inputs.source];

(async () => {
  // Secret
  if (inputs.secretJson) {
    const runnerTempDir = process.env.RUNNER_TEMP || os.tmpdir();
    const secretJsonPath = `${runnerTempDir}/witcher-action-input-secret.json`;

    // put file int the secret json path and set the inputs.secretJson
    await fs.writeFile(secretJsonPath, inputs.secretJson);

    witcherParams = [...witcherParams, "--secret", secretJsonPath];
  }

  // Optional params
  const inputsToOptionallyAdd = ["apiKey", "configId"];
  Object.keys(inputs)
    .filter((key) => inputsToOptionallyAdd.includes(key))
    .forEach((key) => {
      witcherParams = [...witcherParams, `--${key}`, inputs[key]];
    });

  // Local arg
  if (inputs.source === SOURCE_LOCAL && inputs.localConfigPath) {
    witcherParams = [...witcherParams, inputs.localConfigPath];
  }

  const commandToRun: [string, string[]] = ["npx", witcherParams];

  console.info("Command to run: ", commandToRun);
  core.endGroup();

  await exec(...commandToRun);
})();
