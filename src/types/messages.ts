export interface StoredHeaders {
  referer: string | null;
  user_agent: string | null;
  cookie: string | null;
  custom: Record<string, string> | null;
}
