const requiredEnvVars = {
  VITE_API_BASE: 'API base URL',
} as const;

type EnvVar = keyof typeof requiredEnvVars;

function validateEnv(): void {
  const missing: string[] = [];

  for (const [key, description] of Object.entries(requiredEnvVars)) {
    if (!import.meta.env[key]) {
      missing.push(`${key} (${description})`);
    }
  }

  if (missing.length > 0) {
    console.error(
      `❌ Missing required environment variables:\n${missing.map((v) => `  - ${v}`).join('\n')}\n\nPlease set these in your .env file.`
    );
    throw new Error(`Missing environment variables: ${missing.join(', ')}`);
  }
}

// Validate on import
if (import.meta.env.DEV) {
  validateEnv();
}

export function getEnvVar(key: EnvVar): string {
  const value = import.meta.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

export const env = {
  API_BASE: getEnvVar('VITE_API_BASE'),
} as const;
