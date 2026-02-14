import axios from "axios";
import type { UserAuthData } from "../../models";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;
class AuthApiService {
  async userLogin(AuthUser: UserAuthData) {
    const { data } = await axios.post(`${SERVER_URL}/auth/login`, AuthUser);

    return data;
  }

  async addNewUser(NewUser: UserAuthData) {
    const { data } = await axios.post(
      `${SERVER_URL}/auth/registration`,
      NewUser,
    );

    return data;
  }

  async refreshToken(refresh_token: string) {
    const { data } = await axios.post(`${SERVER_URL}/auth/refresh`, {
      refresh_token,
    });

    return data;
  }
}

export const authApiService = new AuthApiService();
