import { type QrCode } from '../../../../database/schema';
import { ConflictError, NotFoundError } from '../../../helpers/api.erros';
import { type IQrCodeRepository } from '../IqrCode.repository';
import { type QrCodeCreateType } from '../qrCode.schema';
import { QrCodeService } from '../qrCode.service';

describe('QrCode Service', () => {
  let qrCodeService: QrCodeService;
  let qrCodeRepositoryMock: jest.Mocked<IQrCodeRepository>;

  beforeEach(() => {
    qrCodeRepositoryMock = {
      create: jest.fn(),
      list: jest.fn(),
      exists: jest.fn(),
      existsShop: jest.fn(),
      delete: jest.fn(),
      existsByTable: jest.fn(),
      getById: jest.fn(),
    };

    qrCodeService = new QrCodeService(qrCodeRepositoryMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Create QrCode', () => {
    const qrCodeInfo: QrCodeCreateType = {
      shopId: 1,
      table: 1,
    };
    it('should create a qrCode', async () => {
      qrCodeRepositoryMock.existsByTable.mockResolvedValue(false);
      qrCodeRepositoryMock.existsShop.mockResolvedValue(true);
      qrCodeRepositoryMock.create.mockResolvedValue({
        ...qrCodeInfo,
        id: 1,
        qrCodeUrl: 'something.com',
      });

      const qrCode = await qrCodeService.create(qrCodeInfo);

      expect(qrCodeRepositoryMock.existsShop).toBeCalledWith(qrCodeInfo.shopId);
      expect(qrCodeRepositoryMock.existsByTable).toBeCalledWith(
        qrCodeInfo.shopId,
        qrCodeInfo.table,
      );
      expect(qrCodeRepositoryMock.create).toHaveBeenCalledWith({
        ...qrCodeInfo,
        qrCodeUrl: `https://image-charts.com/chart?chs=350x350&cht=qr&choe=UTF-8&icqrf=F3484F&chld=M&chof=.png&chl={shopId:${qrCodeInfo.shopId},table:${qrCodeInfo.table}}`,
      });
      expect(qrCode).toHaveProperty('id');
    });

    it('should throw a error if shop not found with specified id', async () => {
      qrCodeRepositoryMock.existsShop.mockResolvedValue(false);

      await expect(qrCodeService.create(qrCodeInfo)).rejects.toThrowError(
        NotFoundError,
      );

      expect(qrCodeRepositoryMock.create).not.toHaveBeenCalled();
    });

    it('should throw a error if qrCode already exists', async () => {
      qrCodeRepositoryMock.existsShop.mockResolvedValue(true);
      qrCodeRepositoryMock.existsByTable.mockResolvedValue(true);

      await expect(qrCodeService.create(qrCodeInfo)).rejects.toThrowError(
        ConflictError,
      );

      expect(qrCodeRepositoryMock.create).not.toHaveBeenCalled();
    });
  });

  describe('Get By Id QrCode', () => {
    const qrCodeFound: QrCode = {
      id: 1,
      shopId: 1,
      table: 1,
      qrCodeUrl: 'idontlikeanime.net',
    };

    it('should return the qrCode with the specified id', async () => {
      qrCodeRepositoryMock.exists.mockResolvedValue(true);
      qrCodeRepositoryMock.getById.mockResolvedValue(qrCodeFound);

      const qrCode = await qrCodeService.getById('1');

      expect(qrCodeRepositoryMock.exists).toHaveBeenCalledWith(1);
      expect(qrCodeRepositoryMock.getById).toHaveBeenCalledWith('1');
      expect(qrCode).toHaveProperty('id');
    });

    it('should throw a erro if no qrCode found with the specified id', async () => {
      qrCodeRepositoryMock.exists.mockResolvedValue(false);

      await expect(qrCodeService.getById('1')).rejects.toThrowError(
        NotFoundError,
      );

      expect(qrCodeRepositoryMock.exists).toHaveBeenCalledWith(1);
      expect(qrCodeRepositoryMock.getById).not.toHaveBeenCalled();
    });
  });

  describe('List QrCode', () => {
    const qrCodes: QrCode[] = [
      {
        id: 1,
        shopId: 1,
        table: 1,
        qrCodeUrl: 'idontlikeanime.net',
      },
      {
        id: 2,
        shopId: 1,
        table: 2,
        qrCodeUrl: 'something.net',
      },
    ];
    it('should return a list of qrCodes', async () => {
      qrCodeRepositoryMock.list.mockResolvedValue(qrCodes);

      const qrCodeList = await qrCodeService.list();

      expect(qrCodeRepositoryMock.list).toHaveBeenCalled();
      expect(qrCodeList).toBeInstanceOf(Array);
      expect(qrCodeList.length).toBeGreaterThanOrEqual(1);
      expect(qrCodeList).toMatchObject(qrCodes);
    });

    it('should throw a error if no qrCodes found', async () => {
      qrCodeRepositoryMock.list.mockResolvedValue([]);

      await expect(qrCodeService.list()).rejects.toThrowError(NotFoundError);
    });
  });

  describe('Delete QrCode', () => {
    const qrCode: QrCode = {
      id: 1,
      shopId: 1,
      table: 1,
      qrCodeUrl: 'idontlikeanime.net',
    };

    it('should return the deleted qrCode', async () => {
      qrCodeRepositoryMock.exists.mockResolvedValue(true);
      qrCodeRepositoryMock.delete.mockResolvedValue(qrCode);

      const deletedQrCode = await qrCodeService.delete('1');

      expect(qrCodeRepositoryMock.exists).toBeCalledWith(1);
      expect(qrCodeRepositoryMock.delete).toBeCalledWith('1');
      expect(deletedQrCode).toHaveProperty('id');
    });

    it('should throw a error if no QrCode found with the specified id', async () => {
      qrCodeRepositoryMock.exists.mockResolvedValue(false);

      await expect(qrCodeService.delete('1')).rejects.toThrowError(
        NotFoundError,
      );

      expect(qrCodeRepositoryMock.delete).not.toHaveBeenCalled();
    });
  });
});
