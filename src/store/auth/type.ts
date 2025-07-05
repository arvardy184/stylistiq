export type AuthState = {
  token: string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
};
