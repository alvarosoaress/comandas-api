import { type ShopSchedule } from '../../../database/schema';
import { type ScheduleSetType } from './schedule.schema';

export type IScheduleRepository = {
  shopExists: (shopId: number) => Promise<boolean>;
  set: (info: ScheduleSetType) => Promise<ShopSchedule[] | undefined>;
};
