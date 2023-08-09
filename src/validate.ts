import * as core from "@actions/core";
import Joi from "joi";
import { Input, SOURCE_JOYSTICK, SOURCE_LOCAL } from "./types";

const validDataSources = [SOURCE_JOYSTICK, SOURCE_LOCAL];

const inputsSchema = Joi.object<Input>().keys({
  source: Joi.string()
    .valid(...validDataSources)
    .required(),
  secretJson: Joi.string().optional().allow(""),
  version: Joi.string().optional().allow(""),

  // Joystick
  apiKey: Joi.string().min(1).when("source", {
    is: SOURCE_JOYSTICK,
    then: Joi.required(),
    otherwise: Joi.forbidden(),
  }),
  configId: Joi.string().min(1).when("source", {
    is: SOURCE_JOYSTICK,
    then: Joi.required(),
    otherwise: Joi.forbidden(),
  }),

  // Local
  localConfigPath: Joi.string().when("source", {
    is: SOURCE_LOCAL,
    then: Joi.required(),
    otherwise: Joi.forbidden(),
  }),
});

export function validateInputs(): Input {
  const inputOptions = { trimWhitespace: true, required: false };
  const requiredInputsOptions = { ...inputOptions, required: true };

  const inputs: Record<string, unknown> = {
    source: core.getInput("source", requiredInputsOptions),
    version: core.getInput("version", inputOptions),
    secretJson: core.getInput("secretJson", inputOptions),
  };

  core.startGroup("Validating inputs");
  try {
    switch (inputs.source) {
      case SOURCE_JOYSTICK:
        inputs["apiKey"] = core.getInput("apiKey", requiredInputsOptions);
        inputs["configId"] = core.getInput("configId", requiredInputsOptions);

        break;
      case SOURCE_LOCAL:
        inputs["localConfigPath"] = core.getInput("localConfigPath", requiredInputsOptions);
    }

    const { error, value: validatedInput } = inputsSchema.validate(inputs, { abortEarly: false });

    if (error) {
      core.setFailed(error.message);
      console.error("Validation failed", error.message);
      throw error;
    }

    console.info("Validation passed, validated input: ", validatedInput);
    return validatedInput as Input;
  } finally {
    core.endGroup();
  }
}
