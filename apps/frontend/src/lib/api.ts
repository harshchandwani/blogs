export type Article = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImageUrl: string | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ArticleInput = {
  title: string;
  excerpt?: string;
  content: string;
  coverImageUrl?: string;
  published?: boolean;
};

const API_URL = import.meta.env['VITE_API_URL'] ?? "http://localhost:3000/api";
const TOKEN_KEY = "field-notes-admin-token";

export function getAuthToken() {
  return typeof window === "undefined" ? null : localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(path: string, options: RequestInit = {}) {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(
      body?.error?.formErrors?.[0] ?? body?.error ?? "Request failed",
    );
  }
  return body as T;
}

export const api = {
  login: async (password: string) => {
    const result = await request<{ token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ password }),
    });
    setAuthToken(result.token);
    return result;
  },
  listArticles: () => request<Article[]>("/articles"),
  getArticle: (slug: string) =>
    request<Article>(`/articles/${encodeURIComponent(slug)}`),
  createArticle: (article: ArticleInput) =>
    request<Article>("/articles", {
      method: "POST",
      body: JSON.stringify(article),
    }),
  updateArticle: (id: number, article: Partial<ArticleInput>) =>
    request<Article>(`/articles/${id}`, {
      method: "PUT",
      body: JSON.stringify(article),
    }),
  deleteArticle: (id: number) =>
    request<{ message: string }>(`/articles/${id}`, {
      method: "DELETE",
    }),
};
