import { Request, Response, NextFunction } from "express";

export class UsersServices {
  async getUserProfile(req: Request, res: Response, next: NextFunction) {}

  async updateUserProfile(req: Request, res: Response, next: NextFunction) {}

  async updateImageProfile(req: Request, res: Response, next: NextFunction) {}

  async searchDR(req: Request, res: Response, next: NextFunction) {}
}
