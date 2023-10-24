import { type ShopSchedule } from '../../../database/schema';
import { BadRequestError, NotFoundError } from '../../helpers/api.erros';
import { type IScheduleRepository } from './Ischedule.repository';
import { type ScheduleSetType } from './schedule.schema';

export class ScheduleService {
  constructor(private readonly scheduleRepository: IScheduleRepository) {}

  async set(info: ScheduleSetType): Promise<ShopSchedule[] | undefined> {
    if (info.length <= 0)
      throw new BadRequestError(
        'Schedule array must contain at least one element',
      );

    if (info.length > 7)
      throw new BadRequestError(
        'Schedule array length cannot exceed 7 elements',
      );

    const isSameShopId = info.every((item, index, array) => {
      return item.shop_id === array[0].shop_id;
    });

    if (!isSameShopId)
      throw new BadRequestError('All shop ids needs to be the same');

    // eslint-disable-next-line @typescript-eslint/naming-convention
    for (const { shop_id, day } of info) {
      if (day > 6)
        throw new BadRequestError('Do not exists day greater than 6');

      const shopExists = await this.scheduleRepository.shopExists(shop_id);
      if (!shopExists) throw new NotFoundError(`Shop id ${shop_id} not found`);
    }

    const scheduleSettled = await this.scheduleRepository.set(info);

    if (!scheduleSettled) return undefined;

    return scheduleSettled;
  }
}
