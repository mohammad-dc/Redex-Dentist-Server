import { Request, Response, NextFunction } from "express";
import { LangTypes } from "../@types/app.type";
import { imageUploadProcess } from "../functions/imageUploadProcess";
import { extractDataFromToken } from "../functions/jwt";
import response from "../helpers/response";
import worksModel from "../models/works.model";
import { deleteFileFromS3 } from "../utils/aws/s3";

export class WorksService {
  async uploadWorkImage(req: Request, res: Response, next: NextFunction) {
    const { lang } = req.params;

    try {
      const { user_id } = extractDataFromToken(req);
      const file = req.file as any;
      const image_url = await imageUploadProcess(file);

      await new worksModel({ doctor: user_id, image_url }).save();
      response.addedSuccess(lang as LangTypes, res);
    } catch (error) {
      response.somethingWentWrong(lang as LangTypes, res, error as Error);
    }
  }

  async removeImageFromWorks(req: Request, res: Response, next: NextFunction) {
    const { lang, image_id } = req.params;

    try {
      const { user_id } = extractDataFromToken(req);

      const result = await worksModel.findOneAndDelete({
        _id: image_id,
        doctor: user_id,
      });

      if (result) {
        await deleteFileFromS3(
          result.image_url.substring(result.image_url.lastIndexOf("/") + 1)
        );

        response.deletedSuccess(lang as LangTypes, res);
      } else {
        response.itemNotExist(lang as LangTypes, res);
      }
    } catch (error) {
      response.somethingWentWrong(lang as LangTypes, res, error as Error);
    }
  }

  async getAllImages(req: Request, res: Response, next: NextFunction) {
    const { lang, doctor_id } = req.params;
    const { skip } = req.query;

    try {
      const results = await worksModel
        .find({ doctor: doctor_id }, { _id: 1, image_url: 1 })
        .skip(skip ? parseInt(skip as string) : 0)
        .limit(10);
      response.getSuccess(res, results);
    } catch (error) {
      response.somethingWentWrong(lang as LangTypes, res, error as Error);
    }
  }
}
