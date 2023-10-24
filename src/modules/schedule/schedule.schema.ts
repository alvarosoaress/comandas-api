import { createInsertSchema } from 'drizzle-zod';
import { shopSchedule } from '../../../database/schema';
import { z } from 'zod';

export const scheduleSchema = createInsertSchema(shopSchedule);

export const scheduleSetSchema = z.object({
  body: z.array(scheduleSchema.omit({ createdAt: true, updatedAt: true })),
});

export type ScheduleSetType = z.infer<typeof scheduleSetSchema>['body'];
