export interface Config {
  port: number;
  allowedOrigin: string;
  poiskkinoApiKey: string | null;
  trustProxy: number;
}

export function readConfig(env: NodeJS.ProcessEnv = process.env): Config {
  return {
    port: Number(env.PORT ?? 3001),
    allowedOrigin: env.ALLOWED_ORIGIN ?? 'http://localhost:5173',
    poiskkinoApiKey: env.POISKKINO_API_KEY || null,
    trustProxy: Number(env.TRUST_PROXY ?? 0),
  };
}
