import { BadRequestError, NotFoundError } from '../../../helpers/api.erros';
import { type IScheduleRepository } from '../Ischedule.repository';
import { type ScheduleSetType } from '../schedule.schema';
import { ScheduleService } from '../schedule.service';

let scheduleService: ScheduleService;
let scheduleRepositoryMock: jest.Mocked<IScheduleRepository>;

beforeEach(() => {
  scheduleRepositoryMock = {
    shopExists: jest.fn(),
    set: jest.fn(),
  };

  scheduleService = new ScheduleService(scheduleRepositoryMock);
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('Schdeule Service', () => {
  describe('Set Schedule', () => {
    const newSchedule: ScheduleSetType = [
      {
        shop_id: 1,
        day: 0,
        opening: 8,
        closing: 12,
      },
      {
        shop_id: 1,
        day: 1,
        opening: 8,
        closing: 22,
      },
      {
        shop_id: 1,
        day: 2,
        opening: 8,
        closing: 22,
      },
      {
        shop_id: 1,
        day: 3,
        opening: 8,
        closing: 22,
      },
      {
        shop_id: 1,
        day: 4,
        opening: 8,
        closing: 22,
      },
      {
        shop_id: 1,
        day: 5,
        opening: 8,
        closing: 22,
      },
      {
        shop_id: 1,
        day: 6,
        opening: 8,
        closing: 12,
      },
    ];
    it('should return the settled schedule', async () => {
      scheduleRepositoryMock.shopExists.mockResolvedValue(true);
      scheduleRepositoryMock.set.mockResolvedValue(newSchedule);

      const scheduleSettled = await scheduleService.set(newSchedule);

      expect(scheduleRepositoryMock.shopExists).toHaveBeenCalledWith(1);
      expect(scheduleRepositoryMock.set).toBeCalledWith(newSchedule);

      expect(scheduleSettled).toBeInstanceOf(Array);
    });

    it('should throw a error if no shop found with specified id', async () => {
      scheduleRepositoryMock.shopExists.mockResolvedValue(false);

      await expect(scheduleService.set(newSchedule)).rejects.toThrowError(
        NotFoundError,
      );
    });

    it('should throw a error if the newSchedule array is greater than 7 elements', async () => {
      newSchedule.push({ shop_id: 1, opening: 8, closing: 12, day: 5 });
      scheduleRepositoryMock.shopExists.mockResolvedValue(true);

      await expect(scheduleService.set(newSchedule)).rejects.toThrowError(
        BadRequestError,
      );

      newSchedule.pop();
    });

    it('should throw a error if the newSchedule array contains 2 conflicting shop IDs', async () => {
      newSchedule[0] = { shop_id: 2, opening: 8, closing: 12, day: 5 };
      scheduleRepositoryMock.shopExists.mockResolvedValue(true);

      await expect(scheduleService.set(newSchedule)).rejects.toThrowError(
        BadRequestError,
      );
    });

    it('should throw a error if the newSchedule array contains a day greater than 6', async () => {
      newSchedule[0] = { shop_id: 1, opening: 8, closing: 12, day: 12 };
      scheduleRepositoryMock.shopExists.mockResolvedValue(true);

      await expect(scheduleService.set(newSchedule)).rejects.toThrowError(
        BadRequestError,
      );
    });
  });
});
