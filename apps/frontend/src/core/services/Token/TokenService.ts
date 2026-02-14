class TokenService {
  getAccessToken() {
    return localStorage.getItem("access_token");
  }

  getRefreshToken() {
    return localStorage.getItem("refresh_token");
  }

  setTokens(access: string, refresh: string) {
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
  }

  clear() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }
}

export const tokenService = new TokenService();
