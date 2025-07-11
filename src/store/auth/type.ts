export interface AuthState {
  token: string | null;
  loginTime: number | null;
  setToken: (token: string) => void;
  clearToken: () => void;
  isTokenExpired: () => boolean;
}
