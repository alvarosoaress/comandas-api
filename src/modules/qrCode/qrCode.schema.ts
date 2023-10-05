import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { qrCode } from '../../../database/schema';

export const qrCodeSchema = createInsertSchema(qrCode);

export const qrCodeGetSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export const qrCodeCreateSchema = z.object({
  body: qrCodeSchema.omit({
    id: true,
    qrCodeUrl: true,
    isOccupied: true,
    createdAt: true,
    updatedAt: true,
  }),
});

export const qrCodeDeleteSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export type QrCodeGetType = z.infer<typeof qrCodeGetSchema>['params'];
export type QrCodeCreateType = z.infer<typeof qrCodeCreateSchema>['body'];
export type QrCodeDeleteType = z.infer<typeof qrCodeDeleteSchema>['params'];
