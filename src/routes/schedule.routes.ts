import { Router } from 'express';
import validate from '../middleware/validateResource';
import { scheduleSetSchema } from '../modules/schedule/schedule.schema';
import { scheduleFactory } from '../modules/schedule/schedule.factory';
import verifyToken from '../middleware/verifyToken';

const router = Router();

router
  .route('/set')
  .post(
    validate(scheduleSetSchema),
    verifyToken('shop'),
    async (req, res) => await scheduleFactory().setSchedule(req, res),
  );

export default router;
