import type { User, UserAuthData } from "../../models";

export interface AuthState {
  selectLogin: boolean;
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  loginError: unknown;
  isLoading: boolean;

  initialize: () => void;
  toggleAuthMode: (val: boolean) => void;
  signIn: (AuthUser: UserAuthData) => void;
  signUp: (NewUser: UserAuthData) => void;
  logOut: () => void;
}
