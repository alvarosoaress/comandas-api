/* eslint-disable @typescript-eslint/consistent-type-definitions */
type User = {
  id?: number | string;
  role?: 'customer' | 'shop' | 'apiKey' | 'admin';
};

declare namespace Express {
  export interface Request {
    user: User;
  }
}
