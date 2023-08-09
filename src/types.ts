export const SOURCE_JOYSTICK = "joystick";
export const SOURCE_LOCAL = "local";

type JoystickFields = {
  source: typeof SOURCE_JOYSTICK;
  apiKey?: string;
  configId?: string;
};

type LocalFields = {
  source: typeof SOURCE_LOCAL;
  localConfigPath?: string;
};

export type Input = {
  source: typeof SOURCE_JOYSTICK | typeof SOURCE_LOCAL;
  secretJson?: string;
  version?: string;
} & (JoystickFields | LocalFields);
