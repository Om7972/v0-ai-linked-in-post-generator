
// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export const getApiUrl = (endpoint: string): string =&gt; {
  return `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
};
