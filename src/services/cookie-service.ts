import { Response } from 'express';
import { config } from '../config/index.js';

interface ParsedCookies {
  [key: string]: string;
}

export class CookieService {
  static parseCookies(cookieHeader: string | undefined): ParsedCookies {
    if (!cookieHeader) return {};

    return cookieHeader
      .split(';')
      .map(cookie => cookie.trim())
      .reduce((acc: ParsedCookies, cookie: string) => {
        const [name, value] = cookie.split('=');
        if (name && value) {
          acc[name] = decodeURIComponent(value);
        }
        return acc;
      }, {});
  }

  static getToken(cookieHeader: string | undefined): string | undefined {
    const cookies = this.parseCookies(cookieHeader);
    return cookies[config.auth.cookieName];
  }

  static setToken(res: Response, token: string): void {
    const { cookieName, cookieOptions } = config.auth;
    const cookieValue = `${cookieName}=${token}; HttpOnly; Path=${cookieOptions.path}; SameSite=${cookieOptions.sameSite}; Max-Age=${cookieOptions.maxAge}`;
    res.setHeader('Set-Cookie', cookieValue);
  }
}
