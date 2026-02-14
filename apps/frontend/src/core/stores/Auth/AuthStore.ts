import { create } from "zustand";
import { notification } from "antd";
import type { AuthState } from "./AuthModels";
import type { UserAuthData } from "../../models";
import { authApiService } from "../../services";

export const useAuthStore = create<AuthState>((set) => ({
  selectLogin: true,
  isAuthenticated: false,
  user: null,
  accessToken: null,
  loginError: null,
  isLoading: true,

  toggleAuthMode: () => {
    set((state) => ({
      selectLogin: !state.selectLogin,
    }));
  },

  initialize: () => {
    set({ isLoading: true });
    const accessToken = localStorage.getItem("access_token");

    if (accessToken) {
      set({
        accessToken: accessToken,
        isAuthenticated: true,
      });
    }
    set({ isLoading: false });
  },

  signIn: async (AuthUser: UserAuthData) => {
    try {
      const tokens = await authApiService.userLogin(AuthUser);

      localStorage.setItem("access_token", tokens.access_token);
      localStorage.setItem("refresh_token", tokens.refresh_token);

      set({
        isAuthenticated: true,
        accessToken: tokens.access_token,
        loginError: null,
      });
    } catch (error: any) {
      set({ loginError: error });
      notification.error({
        message: "Ошибка входа",
        description: error?.response?.data?.message ?? "Ошибка",
      });
    }
  },

  signUp: async (NewUser: UserAuthData) => {
    try {
      const accessToken = await authApiService.addNewUser(NewUser);
      set((state: AuthState) => ({
        ...state,
        isAuthenticated: true,
        accessToken: accessToken.access_token,
        loginError: null,
      }));
      localStorage.setItem("access_token", accessToken.access_token);
    } catch (error: any) {
      set((state: AuthState) => ({
        ...state,
        loginError: error,
      }));
      notification.error({
        message: "Ошибка регистрации",
        description: error?.response?.data?.message ?? "Ошибка",
      });
      throw error; // важно, чтобы форма понимала, что был reject
    }
  },

  logOut: () => {
    set((state: AuthState) => ({
      ...state,
      isAuthenticated: false,
      accessToken: null,
    }));
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  },
}));
