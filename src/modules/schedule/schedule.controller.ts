/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { type Request, type Response } from 'express';
import { scheduleShopOwnership } from '../../middleware/ownership';
import verifyOwnership from '../../middleware/verifyOwnership';
import { type ScheduleSetType } from './schedule.schema';
import { type ScheduleService } from './schedule.service';

export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  async setSchedule(
    req: Request<unknown, unknown, ScheduleSetType>,
    res: Response,
  ) {
    verifyOwnership(scheduleShopOwnership(Number(req.user.id), req.body), req);

    const newSchedule = await this.scheduleService.set(req.body);

    return res.status(200).json(newSchedule);
  }
}
