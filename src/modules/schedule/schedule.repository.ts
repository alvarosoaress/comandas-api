import { eq } from 'drizzle-orm';
import { db } from '../../../database';
import {
  type ShopSchedule,
  shop,
  shopSchedule,
} from '../../../database/schema';
import { type IScheduleRepository } from './Ischedule.repository';
import { type ScheduleSetType } from './schedule.schema';

export class ScheduleRepository implements IScheduleRepository {
  async shopExists(shopId: number): Promise<boolean> {
    const shopExists = await db.query.shop.findFirst({
      where: eq(shop.userId, shopId),
    });

    return !!shopExists;
  }

  async set(info: ScheduleSetType): Promise<ShopSchedule[] | undefined> {
    const userId = info[0].shop_id;

    await db.transaction(async (tx) => {
      info.forEach(async (schedule) => {
        await tx
          .insert(shopSchedule)
          .values(schedule)
          .onDuplicateKeyUpdate({
            set: { ...schedule, updatedAt: new Date() },
          });
      });
    });

    const scheduleFound = await db.query.shop.findFirst({
      where: eq(shop.userId, userId),
      columns: {},
      with: { schedule: true },
    });

    if (!scheduleFound) return undefined;

    return Object.values(scheduleFound.schedule);
  }
}
