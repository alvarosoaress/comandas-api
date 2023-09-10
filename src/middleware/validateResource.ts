import { type Request, type Response, type NextFunction } from 'express';
import { type z } from 'zod';

const validate =
  (schema: z.Schema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (e: any) {
      return res.status(400).json(e.errors);
    }
  };

export default validate;
