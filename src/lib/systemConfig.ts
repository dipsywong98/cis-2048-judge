import packageJson from '../../package.json';

const { version, name } = packageJson;

type EnvType = string | Promise<string> | number | string[] | boolean;

function env(key: string, fallback: string): string;
function env(key: string, fallback: Promise<string>): Promise<string>;

function env(key: string, fallback: number): number;

function env(key: string, fallback: string[]): string[];

function env(key: string, fallback: boolean): boolean;

function env(key: string, fallback: EnvType): EnvType {
  const value = process.env[key];
  if (typeof fallback === 'string') {
    return value ?? fallback;
  }
  if (typeof fallback === 'number') {
    return Number.parseFloat(env(key, fallback.toString()));
  }
  if (typeof fallback === 'boolean') {
    return value !== undefined ? value === 'true' : fallback
  }
  if (Array.isArray(fallback)) {
    return value?.split(';;') ?? fallback;
  }
  return Promise.resolve(value ?? fallback);
}

const config = {
  APP_NAME: env('APP_NAME', name),
  APP_URL: env('APP_URL', `https://${env('VERCEL_URL', 'localhost:3000')}`),
  COORDINATOR_TOKEN: env('COORDINATOR_TOKEN', ''),
  ENABLE_FAKE_STUDENT: env('ENABLE_FAKE_STUDENT', false),
  GRADE_TIMEOUT_SECOND: env('GRADE_TIMEOUT_SECOND', 30),
  APP_VERSION: version,
  FAQ: env('FAQ', [
    '1. Do I need to validate the input payload?\nYou can assume the payload is valid.',
    '2. What are the possible block shapes?\nFind it youself.',
    '3. How long the move string could be?\nShorter than 10^3.',
  ])
};

export default config;