import packageJson from "../../package.json";

const { version, name } = packageJson;

type EnvType = string | Promise<string> | number | string[] | boolean;

function env(key: string, fallback: string): string;
function env(key: string, fallback: Promise<string>): Promise<string>;

function env(key: string, fallback: number): number;

function env(key: string, fallback: string[]): string[];

function env(key: string, fallback: boolean): boolean;

function env(key: string, fallback: EnvType): EnvType {
  const value = process.env[key];
  if (typeof fallback === "string") {
    return value ?? fallback;
  }
  if (typeof fallback === "number") {
    return Number.parseFloat(env(key, fallback.toString()));
  }
  if (typeof fallback === "boolean") {
    return value !== undefined ? value === "true" : fallback;
  }
  if (Array.isArray(fallback)) {
    return value?.split(";;") ?? fallback;
  }
  return Promise.resolve(value ?? fallback);
}

const config = {
  APP_NAME: env("APP_NAME", name),
  APP_URL: env("APP_URL", `https://${env("VERCEL_URL", "localhost:3000")}`),
  COORDINATOR_TOKEN: env("COORDINATOR_TOKEN", ""),
  ENABLE_FAKE_STUDENT: env("ENABLE_FAKE_STUDENT", false),
  GRADE_TIMEOUT_SECOND: env("GRADE_TIMEOUT_SECOND", 5),
  APP_VERSION: version,
  MONGO_URL: env("MONGO_URL", "mongodb://localhost:27017"),
  MONGO_DB: env("MONGO_DB", ""),
  // mongo limit is 512MB storage, estimate each evaluation result cost 0.5MB
  // (actual each evaluation result is 0.3 MB with advanced requirements)
  MONGO_LOG_LIMIT: env("MONGO_LOG_LIMIT", 1000),
};

export default config;
