import { ScheduleController } from './schedule.controller';
import { ScheduleRepository } from './schedule.repository';
import { ScheduleService } from './schedule.service';

export function scheduleFactory(): ScheduleController {
  const scheduleRepository = new ScheduleRepository();
  const scheduleService = new ScheduleService(scheduleRepository);
  const scheduleController = new ScheduleController(scheduleService);
  return scheduleController;
}
