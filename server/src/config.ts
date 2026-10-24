/** Все переменные окружения читаются в одном месте: так видно, что нужно серверу для запуска. */
export interface Config {
  port: number;
  allowedOrigin: string;
  poiskkinoApiKey: string | null;
}

export function readConfig(env: NodeJS.ProcessEnv = process.env): Config {
  return {
    port: Number(env.PORT ?? 3001),
    allowedOrigin: env.ALLOWED_ORIGIN ?? 'http://localhost:5173',
    poiskkinoApiKey: env.POISKKINO_API_KEY || null,
  };
}
