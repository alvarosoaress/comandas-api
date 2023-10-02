/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { type Request, type Response } from 'express';
import {
  type GeneralCategoryUpdateType,
  type GeneralCategoryCreateType,
  type GeneralCategoryGetType,
  type GeneralCategorySetType,
  type GeneralCategoryDeleteType,
  type GeneralCategoryShopListType,
} from './generalCategory.schema';
import { type GeneralCategoryService } from './generalCategory.service';

export class GeneralCategoryController {
  constructor(
    private readonly generalCategoryService: GeneralCategoryService,
  ) {}

  async createGeneralCategory(
    req: Request<unknown, unknown, GeneralCategoryCreateType>,
    res: Response,
  ) {
    const newGeneralCategory = await this.generalCategoryService.create(
      req.body,
    );

    return res.status(200).json(newGeneralCategory);
  }

  async getGeneralCategories(req: Request, res: Response) {
    const generalCategories =
      await this.generalCategoryService.getGeneralCategories();

    return res.status(200).json(generalCategories);
  }

  async getGeneralCategoryById(
    req: Request<GeneralCategoryGetType>,
    res: Response,
  ) {
    const generalCategoryFound = await this.generalCategoryService.getById(
      req.params.id,
    );

    return res.status(200).json(generalCategoryFound);
  }

  async updateGeneralCategory(
    req: Request<unknown, unknown, GeneralCategoryUpdateType>,
    res: Response,
  ) {
    const updatedGeneralCategory = await this.generalCategoryService.update(
      req.body,
    );

    return res.status(200).json(updatedGeneralCategory);
  }

  async deleteGeneralCategory(
    req: Request<GeneralCategoryDeleteType>,
    res: Response,
  ) {
    const deletedCategory = await this.generalCategoryService.delete(
      req.params.id,
    );

    return res.status(200).json(deletedCategory);
  }

  async getShopListCategories(
    req: Request<GeneralCategoryShopListType>,
    res: Response,
  ) {
    const shopCategories =
      await this.generalCategoryService.getShopListCategories(req.params.id);

    return res.status(200).json(shopCategories);
  }

  async setGeneralCategory(
    req: Request<unknown, unknown, GeneralCategorySetType>,
    res: Response,
  ) {
    const generalCategorySettled = await this.generalCategoryService.set(
      req.body,
    );

    return res.status(200).json(generalCategorySettled);
  }

  async removeGeneralCategory(
    req: Request<unknown, unknown, GeneralCategorySetType>,
    res: Response,
  ) {
    const generalCategoryRemaining = await this.generalCategoryService.remove(
      req.body,
    );

    return res.status(200).json(generalCategoryRemaining);
  }
}
