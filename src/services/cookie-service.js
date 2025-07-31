import { config } from '../config/index.js';

export class CookieService {
  static parseCookies(cookieHeader) {
    if (!cookieHeader) return {};

    return cookieHeader
      .split(';')
      .map(cookie => cookie.trim())
      .reduce((acc, cookie) => {
        const [name, value] = cookie.split('=');
        if (name && value) {
          acc[name] = decodeURIComponent(value);
        }
        return acc;
      }, {});
  }

  static getToken(cookieHeader) {
    const cookies = this.parseCookies(cookieHeader);
    return cookies[config.auth.cookieName];
  }

  static setToken(res, token) {
    const { cookieName, cookieOptions } = config.auth;
    const cookieValue = `${cookieName}=${token}; HttpOnly; Path=${cookieOptions.path}; SameSite=${cookieOptions.sameSite}; Max-Age=${cookieOptions.maxAge}`;
    res.setHeader('Set-Cookie', cookieValue);
  }
}
