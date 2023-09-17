/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { type Request, type Response } from 'express';
import {
  type GeneralCategoryUpdateType,
  type GeneralCategoryCreateType,
  type GeneralCategoryGetType,
  type GeneralCategorySetType,
  type GeneralCategoryDeleteType,
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

    return res.status(200).json({
      error: false,
      data: newGeneralCategory,
    });
  }

  async getGeneralCategories(req: Request, res: Response) {
    const generalCategories =
      await this.generalCategoryService.getGeneralCategories();

    return res.status(200).json({
      error: false,
      data: generalCategories,
    });
  }

  async getGeneralCategoryById(
    req: Request<GeneralCategoryGetType>,
    res: Response,
  ) {
    const generalCategoryFound = await this.generalCategoryService.getById(
      req.params.id,
    );

    return res.status(200).json({
      error: false,
      data: generalCategoryFound,
    });
  }

  async updateGeneralCategory(
    req: Request<unknown, unknown, GeneralCategoryUpdateType>,
    res: Response,
  ) {
    const updatedGeneralCategory = await this.generalCategoryService.update(
      req.body,
    );

    return res.status(200).json({
      error: false,
      data: updatedGeneralCategory,
    });
  }

  async setGeneralCategory(
    req: Request<unknown, unknown, GeneralCategorySetType>,
    res: Response,
  ) {
    const generalCategorySettled = await this.generalCategoryService.set(
      req.body,
    );

    return res.status(200).json({
      error: false,
      data: generalCategorySettled,
    });
  }

  async deleteGeneralCategory(
    req: Request<GeneralCategoryDeleteType>,
    res: Response,
  ) {
    const deletedCategory = await this.generalCategoryService.delete(
      req.params.id,
    );

    return res.status(200).json({
      error: false,
      data: deletedCategory,
    });
  }
}
