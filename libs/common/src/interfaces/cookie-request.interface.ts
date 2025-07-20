export interface CookieRequest extends Request {
  cookies: { Authentication: string };
}
